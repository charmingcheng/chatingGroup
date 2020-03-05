/* 首先在根目录下安装nodeJs的ws模块：npm install ws */

/* 引入nodejs的webSocket模块 */
var WebSocket = require('ws').Server
// var moment = require('moment')

/* 创建一个webSocket实例 */
var wss = new WebSocket({
  url: 'localhost', // webSocket服务的ip
  port: 9999 // webSocket服务的端口
})

/* 监听客户端连接 */
wss.on('connection', function (ws, req) {
  console.log('客户端链接')

  /* 监听客户端发过来的信息 */
  ws.on('message', function (data) {
    console.log(data, '客户端发来消息')
    wss.clients.forEach(itemWs => {
      itemWs.send(data)
    })
  })

  /* 监听客户端关闭 */
  ws.on('close', function (ev) {
    console.log('客户端断开连接')
  })

  /* 监听客户端发生异常 */
  ws.on('error', function (ve) {
    console.log('客户端异常')
  })
})

console.log('webSocket服务已开启，端口为：9999')
