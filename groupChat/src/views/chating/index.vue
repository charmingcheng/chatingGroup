<template>
  <div class="chating">
    <div class="chating-wrap">
      <div class="title">聊天页面</div>
      <div class="chating-content">
        <div class="chating-body">
          <div class="chating-list">
            <ul class="chating-records">
              <div v-for="(item, index) in chatingRecords" :key="index">
                <li v-show="item.nickName != myNickName" class="other" >
                  <img src="../../assets/logo.png" alt="用户头像">
                  <div class="record-text-wrap">
                    <div class="nick-name">{{item.nickName}}</div>
                    <div class="record-text">
                      {{item.message}}
                    </div>
                  </div>
                </li>
                <li v-show="item.nickName == myNickName" class="my">
                  <div class="record-text-wrap">
                    <!-- <div class="nick-name">迷离</div> -->
                    <div class="record-text">
                      {{item.message}}
                    </div>
                  </div>
                  <img src="../../assets/logo.png" alt="用户头像">
                </li>
              </div>
            </ul>
          </div>
          <div class="chating-btns">
            <input class="input-text" v-model="text" type="text" placeholder="请输入聊天内容">
            <button class="send" @click="sendData">发送</button>
          </div>
        </div>
        <div v-if="userList.length > 0" class="chating-online-number">
          <div class="online-num">在线用户{{userList.length}}</div>
          <ul>
            <li class="user" v-for="(item, index) in userList" :key="index">
              <img src="../../assets/logo.png" alt="用户头像">
              <span>{{item.userName}}</span>
            </li>
          </ul>
          <button @click="loginOutHandler">退出群聊</button>
        </div>
      </div>
    </div>

    <div v-if="showLogin" class="login">
      <div class="opacity-wrap">
        <div>用户名：<input class="user-name" v-model="userName"></div>
        <button class="login-btn" @click="loginHandler">登录</button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      socketUrl: 'ws://localhost:8888', // socket服务地址
      client: null, // webSocket实例
      chatingRecords: [], // 聊天记录
      myNickName: '', // 是否是自己
      userName: '',
      showLogin: false,
      userList: []
    }
  },
  created () {
    console.log('created')
  },
  mounted () {
    console.log('mounted')
  },
  methods: {
    /* 初始化聊天，连接socket */
    initChaing () {
      let that = this
      if (window.WebSocket) {
        /* webSocket 连接服务器 */
        this.client = new WebSocket(this.socketUrl)

        /* 监听客户端连接 */
        this.client.onopen = function (ev) {
          console.log(ev)
          if (ev.type === 'open') {
            /* 连接到socket服务后，把用户信息发过去，好让后台统计在线用户信心 */
            let userInfo = {
              userName: that.myNickName,
              calculateUserInfo: true,
              login: true
            }
            that.client.send(JSON.stringify(userInfo))
            console.log('客户端连接socket服务')
          }
        }

        /* 监听服务端发送的消息 */
        this.client.onmessage = function (ev) {
          console.log(JSON.parse(ev.data), '服务端发送过来的数据')
          let data = JSON.parse(ev.data)
          if (data instanceof Array === true) {
            that.userList = data // 在线用户数量变化
          } else {
            that.chatingRecords.push(data) // 在线用户聊天
          }
        }

        /* 监听服务端关闭 */
        this.client.onclose = function (ev) {
          console.log('socket服务已关闭')
          that.client = null // 客户端或者是服务端断开后，将webSocket实例清除
        }

        /* 监听服务端异常 */
        this.client.onerror = function () {
          if (!that.client) {
            console.log('socket服务连接失败')
          }
          that.loginOutHandler()
          that.client = null // 客户端或者是服务端断开后，将webSocket实例清除
        }
      } else {
        alert('该浏览器不支持webSocket，请使用主流浏览器，如chrome')
      }
    },
    loginHandler () {
      this.myNickName = this.userName
      this.showLogin = false
      /* 登录成功后再连接服务，是为了连接服务的时候把用户信息发过去 */
      this.initChaing()
      console.log(this.myNickName)
      console.log(this.userName)
    },
    loginOutHandler () {
      let userInfo = {
        userName: this.myNickName,
        calculateUserInfo: true,
        login: false
      }
      this.client.send(JSON.stringify(userInfo))
      this.client.close()
    },
    sendData () {
      console.log(this.myNickName, 'this.myNickName')
      if (!this.myNickName) {
        alert('请登录')
        this.showLogin = true
        return
      }

      let data = {
        nickName: this.myNickName || 'user1',
        uid: new Date().getTime(),
        message: this.text,
        date: new Date()
      }
      if (this.client) {
        this.client.send(JSON.stringify(data))
        this.text = ''
      } else {
        console.log('socket服务连接失败,正在重新连接服务..')

        this.initChaing()
        this.client.send(JSON.stringify(data))
      }
      console.log(this.client, 'this.client')
      console.log(this.client.readyState, 'aaa')
    }
  },
  beforeDestroy () {
    let userInfo = {
      userName: this.myNickName,
      calculateUserInfo: true,
      login: false
    }
    this.client.send(JSON.stringify(userInfo))
  }
}
</script>

<style lang="">
.login{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, .6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.opacity-wrap{
  width: 500px;
  height: 300px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.user-name{
  font-size: 16px;
  padding: 5px;
  text-indent: 10px;
}
.login-btn{
  font-size: 20px;
  background: cornflowerblue;
  color: 20px;
  margin-top: 30px;
  color: #fff;
  border: none;
  outline: none;
  padding: 10px 20px;
  border-radius: 10px;
}
ul{
  list-style: none;
  margin: 0;
  padding: 0;
}
.chating{
  max-width: 800px;
  border: 20px solid lightcyan;
  border-radius: 20px;
  margin: 0 auto 0;
}
.title{
  background: cornflowerblue;
  color: #fff;
  padding: 5px 0 5px;
}
.chating-content{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.chating-body{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #f3f3f3;
}
.chating-list{
  flex: 1;
  border: 1px solid cornflowerblue;
}
.chating-records{
  padding: 10px;
  min-height: 300px;
  max-height: 600px;
  overflow-y: auto;
}
.chating-records li{
  margin-bottom: 20px;
}
.chating-records .other{
  display: flex;
  justify-content: start;
  align-items: flex-start;
}
.chating-records .my{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.chating-records img{
  width: 36px;
  height: 36px;
  /* border-radius: 50%; */
  margin-right: 15px;
  background: purple
}
.chating-records .my img{
  margin-right: 0;
  margin-left: 15px;
}
.chating-records .other .record-text-wrap{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.chating-records .my .record-text-wrap{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.nick-name{
  font-size: 14px;
  margin-bottom: 5px;
  color: #666;
}
.record-text{
  max-width: 260px;
  text-align: left;
  font-size: 14px;
  padding: 5px;
  background: #fff;
  border-radius: 5px;
}

.chating-btns{
  background: burlywood;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

}
.input-text{
  font-size: 16px;
  border: none;
  outline: none;
  padding: 5px 0 5px 5px;
}
.send{
  font-size: 16px;
  border: none;
  outline: none;
  padding: 4px 15px;
  margin-left: 20px;
}

.online-num{
  font-size: 12px;
  padding-bottom: 15px;
}
.chating-online-number{
  padding: 15px;
  height: 100%;
}
.chating-online-number ul{
  list-style: none;
  margin: 0;
  padding: 0;
  min-width: 120px;
  max-height: 580px;
  overflow-y: auto;
}
.user{
  display: flex;
  justify-content: space-between;
  align-content: center;
  line-height: 20px;
  font-size: 12px;
  border-bottom: 1px solid aqua;
  padding: 10px;
  margin-bottom: 5px;
}
.user img{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
  background: palevioletred
}

</style>
