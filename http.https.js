'use strict'

var net = require('net')
var http = require('http')
var https = require('https')

var createServer = function (opts, handler) {
  var server = net.createServer(function (socket) {
    socket.once('data', buffer => {
      // Pause the socket
      socket.pause()

      // Determine if this is an HTTP(s) request
      var byte = buffer[0]

      var protocol
      if (byte === 22) {
        protocol = 'https'
      } else {
        protocol = 'http'
      }

      var proxy = server[protocol]
      if (proxy) {
        // Push the buffer back onto the front of the data stream
        socket.unshift(buffer)

        // Emit the socket to the HTTP(s) server
        proxy.emit('connection', socket)
      }
    })
  })

  server.http = http.createServer(handler)
  server.https = https.createServer(opts, handler)
  return server
}

module.exports = {
  createServer: createServer
}
