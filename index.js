const express = require('express')
const app = express()

const server = require('http').Server(app)
	.listen(8888, () => {console.log('open Server')})

const io = require('socket.io')(server)

let roomList = []
let userList = []
let userIdList = []

io.on('connection', socket => {
	console.log('success connect')

	let initUser = {
		name: '',
		id: userId(),
		roomId: '',
	}

	socket.emit('connectionSuccess', initUser)
	socket.emit('getRoomList', roomList)

	userList.push(initUser)

	socket.on('createRoom', createRoom)
	socket.on('joinRoom', joinRoom)

	function createRoom(roomInfo) {
		if (roomList.length <= 3) {
			const id =  roomList.length
			roomList.push({...roomInfo, id, numOfPeople: 0,})
			socket.emit('createRoomSuccess', '')
			joinRoom(id)
		} else {
			socket.emit('createRoomFail', '')
		}
	}

	function joinRoom(roomId) {
		const room = roomList.filter((item) => item.id === roomId)[0]
		if (room.numOfPeople >= room.numOfMaxPeople) {
			socket.emit('addRoomFail', roomList)
		} else {
			room.numOfPeople = room.numOfPeople + 1
			socket.join(roomId)
			socket.emit('getRoomList', roomList)
		}
	}

	function leaveRoom() {
		
	}
	function close() {

	}
})

function userId() {
	const randomId = () => Math.floor( Math.random() * (9999) ) + 1
	let userId = randomId()
	while (userIdList.includes(userId)) {
		userId = randomId()
	}
	userIdList.push(userId)
	return userId
}