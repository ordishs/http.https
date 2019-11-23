'use strict'

var fs = require('fs')
var path = require('path')
var express = require('express')
var http_https = require('./')
var socketio = require('socket.io')

var credentials = {
  key: fs.readFileSync(path.join(__dirname, 'example.key')),
  cert: fs.readFileSync(path.join(__dirname, 'example.crt'))
}

// Create a standard instance of Express...
var app = express()

// Tell Express to serve static content from the public folder...
app.use(express.static(path.join(__dirname, 'public')))

// If the request was not previously handled, send 404...
app.use(function(req, res) {
  console.log('BAD REQUEST: ' + req.url)
  res.status(404).send('Not found')
})

// Create a server that will handle HTTP and HTTPS requests...
var server = http_https.createServer(credentials, app)

// Create a socket.io instance an attach the HTTP and HTTPS servers to it...
var io = socketio()
io.attach(server.http)
io.attach(server.https)

// Each time we receive a new socket connection, output an initial message and then heartbeat messages every 2 seconds afterwards...
io.sockets.on('connection', function (socket) {
  console.log('Connection established.')
  socket.emit('message', 'Initial message: ' + new Date().toISOString())

  var heartbeat = setInterval(function () {
    socket.emit('message', 'Heartbeat message: ' + new Date().toISOString())
  }, 2000)

  socket.on('disconnect', () => {
    console.log('Connection closed.')
    clearInterval(heartbeat)
  })
})

var port = 3000

// Tell the server to start listening...
server.listen(port, '0.0.0.0', function () {
  console.log('HTTP and HTTPS servers listening on port ' + port)
})
