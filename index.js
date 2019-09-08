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
		if (roomList.length <= 3) {
			const id =  roomList.length
			roomList.push({...roomInfo, id, numOfPeople: 0,})
			socket.emit("createRoomSuccess", '')
			joinRoom(id)
		} else {
			socket.emit("createRoomFail", '')
		}
		// console.log(roomName)
		// socket.emit('getRoomList', roomList)
	})
	
	function joinRoom(roomId) {
		const room = roomList.filter((item) => item.id === roomId)[0]
		if (room.numOfPeople >= room.numOfMaxPeople) {
			socket.emit("addRoomFail", roomList)
		} else {
			room.numOfPeople = room.numOfPeople + 1
			socket.join(roomId)
			socket.emit("getRoomList", roomList)
		}
	}
})