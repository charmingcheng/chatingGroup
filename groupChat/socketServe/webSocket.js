/* 首先在根目录下安装nodeJs的ws模块：npm install ws */

/* 引入nodejs的webSocket模块 */
var WebSocket = require('ws').Server
var moment = require('moment')

/* 创建一个webSocket实例 */
var wss = new WebSocket({
  url: 'localhost', // webSocket服务的ip
  port: 8888 // webSocket服务的端口
})

var onlineMember = 0
var onlineMemberList = []

/* 监听客户端连接 */
wss.on('connection', function (ws) {
  console.log(ws, 'ws')
  console.log('客户端连接成功')
  onlineMember++

  /* 监听客户端发过来的信息 */
  ws.on('message', function (data) {
    console.log(data)
    let newData = JSON.parse(data)
    newData.serveDate = moment().format('MMMM Do YYYY, h:mm:ss a')
    newData.onlineMember = onlineMember

    /* 登录用户的信息 */
    if (newData.calculateUserInfo === true) {
      if (newData.login === true) { // 用户登录
        onlineMemberList.push(newData)
      } else { // 用户退出登录
        onlineMemberList = onlineMemberList.filter(item => item.userName !== newData.userName)
      }

      wss.clients.forEach(itemWs => {
        itemWs.send(JSON.stringify(onlineMemberList))
      })
    } else {
      /* 给所有连接的客户端发送数据 */
      wss.clients.forEach(itemWs => {
        itemWs.send(JSON.stringify(newData))
      })
    }

    /* 给最后一个连接的客户端发送数据 */
    // ws.send(JSON.stringify(newData))
  })

  /* 监听客户端关闭 */
  ws.on('close', function (ev) {
    console.log('客户端断开连接')
    onlineMember--
  })

  /* 监听客户端发生异常 */
  ws.on('error', function (ve) {
    console.log('客户端异常')
  })
})

console.log('webSocket服务已开启，端口为：8888')
