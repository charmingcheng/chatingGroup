/* 首先在根目录下安装nodeJs的ws模块：npm install ws */

/* 引入nodejs的webSocket模块 */
var WebSocket = require('ws').Server
var moment = require('moment')


/* 创建一个webSocket实例 */
var wss = new WebSocket({
  url: 'localhost', // webSocket服务的ip
  port: 8888 // webSocket服务的端口
})

/* socketId */
var id = 0
var onlineMemberList = []
var defaultUser = 'user'

/* 监听客户端连接 */
wss.on('connection', function (ws,req) {
  id++
  ws.id = id // 给每个连接的客户端绑定一个id
  let reqUser = req.url.split('?')[1]
  let name = reqUser && reqUser.split('=')[1]
  let userName;
  if (name) {
    /* 因为传过来的名字可能是中文的，这里需要解码，否则前端接收到的是一堆编码后的字符串 */
    userName = decodeURIComponent(name)
  } else {
    userName = defaultUser + id
  }
  var userInfo = {
    userName: userName,
    socketId: id,
    date: moment().format('MMMM Do YYYY, h:mm:ss a')
  }
  /* 当用户名一样的时候，表示重新登录 */
  for (var i = 0; i < onlineMemberList.length; i++) {
    if (userInfo.userName == onlineMemberList[i].userName) {
      onlineMemberList[i] = userInfo
      wss.clients.forEach((itemWs)=>{
        itemWs.send(JSON.stringify(onlineMemberList))
      })
      return
    }
  }

  onlineMemberList.push(userInfo)
  wss.clients.forEach((itemWs)=>{
    itemWs.send(JSON.stringify(onlineMemberList))
  })



  /* 监听客户端发过来的信息 */
  ws.on('message', function (data) {
    console.log(data)
    let newData = JSON.parse(data)
    newData.serveDate = moment().format('MMMM Do YYYY, h:mm:ss a')
      /* 给所有连接的客户端发送数据 */
    wss.clients.forEach(itemWs => {
      itemWs.send(JSON.stringify(newData))
    })

    /* 给最后一个连接的客户端发送数据 */
    // ws.send(JSON.stringify(newData))
  })

  /* 监听客户端关闭 */
  ws.on('close', function (ev) {
    console.log('客户端断开连接')
    /* 监听到用户断开连接后，将在线的重新广播给所有有人 */
    onlineMemberList = onlineMemberList.filter((item) => {
      return item.socketId != ws.id
    })

    wss.clients.forEach((itemWs) => {
      itemWs.send(JSON.stringify(onlineMemberList))
    })
    console.log(onlineMemberList, 'onlineMemberList')
    console.log(ws.id,'ws.id')
  })

  /* 监听客户端发生异常 */
  ws.on('error', function (ve) {
    console.log('客户端异常')
  })
})

console.log('webSocket服务已开启，端口为：8888')
