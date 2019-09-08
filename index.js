const express = require('express')
const app = express()

const server = require('http').Server(app)
	.listen(8888, () => {console.log('open Server')})

const io = require('socket.io')(server)

let roomList = []
let userList = {}
let userIdList = []
let roomIdList = []
io.on('connection', socket => {
	console.log('success connect')

	const id = userId()
	userList[id] = {
		id: id,
		name: '',
		roomId: '',
	}

	socket.emit('connectionSuccess', userList[id])
	socket.emit('roomList', roomList)

	socket.on('setUserName', setUserName)
	socket.on('setUserRoomId', setUserRoomId)
	socket.on('createRoom', createRoom)
	socket.on('joinRoom', joinRoom)

	function setUserName({user, userName}) {
		userList[user.id].name = userName
		socket.emit('userStatus', userList[user.id])
	}

	function setUserRoomId({user, roomId}) {
		userList[user.id].roomId = roomId
		socket.emit('userStatus', userList[user.id]) 
	}

	function createRoom({ user ,roomInfo }) {
		const id = roomId()
		roomList.push({...roomInfo, id, numOfPeople: 0,})
		socket.emit('createRoomSuccess', '')

		joinRoom(id)
		changeUserStatus(user, id)
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

function randomId() {
	return Math.floor( Math.random() * (9999) ) + 1
}

function userId() {
	let userId = randomId()
	while (userIdList.includes(userId)) {
		userId = randomId()
	}
	userIdList.push(userId)
	return userId
}

function roomId() {
	let roomId = randomId()
	while (roomIdList.includes(roomId)) {
		roomId = randomId()
	}
	roomIdList.push(roomId)
	return roomId
}


function userJoinRoom() {

}
