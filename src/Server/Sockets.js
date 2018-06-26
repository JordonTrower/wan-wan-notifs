import io from 'socket.io';

const connectedUsers = {};

export default (server) => {
	const socket = io.listen(server);

	socket.on('connection', (client) => {
		connectedUsers[client.id] = client.request._query.user //eslint-disable-line
		client.on('disconnect', () => {
			delete connectedUsers[client.id]
		})

	})

	return socket
}