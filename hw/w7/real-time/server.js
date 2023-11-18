const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
	console.log('A user connected');

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});

	socket.on('chat message', (msg) => {
		io.emit('chat message', msg);
	});
});

server.listen(3000, () => {
	console.log('Server listening on port 3000');
});
