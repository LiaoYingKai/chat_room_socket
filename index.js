const express = require('express')
const app = express()

const server = require('http').Server(app)
	.listen(8888, () => {console.log('open Server')})

const io = require('socket.io')(server)

let roomList = []

io.on('connection', socket => {
	console.log('success connect')

	socket.emit("connectionSuccess", "success")
	socket.emit("getRoomList", roomList)

	socket.on('createRoom', roomInfo => {
		if (roomList <= 3) {
			roomList.push({...roomInfo, id: roomList.length})
			socket.emit("createRoomSuccess", '')
		} else {
			socket.emit("createRoomFail", '')
		}
		// console.log(roomName)
		// socket.emit('getRoomList', roomList)
	})
})