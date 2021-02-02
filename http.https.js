'use strict'

const net = require('net')
const http = require('http')
const https = require('https')

const createServer = function (opts, handler) {
  const server = net.createServer(function (socket) {
    socket.once('data', buffer => {
      // Pause the socket
      socket.pause()

      // Determine if this is an HTTP(s) request
      const byte = buffer[0]

      // Push the buffer back onto the front of the data stream
      socket.unshift(buffer)
  
      if (byte === 22) {
        const proxy = server['https']
        if (proxy) {
          // Emit the socket to the HTTP(s) server
          proxy.emit('connection', socket)
        }
      } else {
        const proxy = server['http']
        if (proxy) {
          // Emit the socket to the HTTP(s) server
          proxy.emit('connection', socket)
          socket.resume()
        }
      }
    })
  })

  server.http = http.createServer(handler)
  server.https = https.createServer(opts, handler)
  return server
}

module.exports = {
  createServer
}
