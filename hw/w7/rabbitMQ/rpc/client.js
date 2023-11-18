const amqp = require('amqplib');

async function callRPC() {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();

	const queue = 'rpc_queue';
	const replyQueue = await channel.assertQueue('', { exclusive: true });

	const correlationId = generateUuid();

	channel.consume(
		replyQueue.queue,
		(msg) => {
			if (msg.properties.correlationId == correlationId) {
				console.log(`Received response: ${msg.content.toString()}`);
				channel.close();
				connection.close();
			}
		},
		{ noAck: true }
	);

	const message = 'RPC request';
	channel.sendToQueue(queue, Buffer.from(message), {
		correlationId: correlationId,
		replyTo: replyQueue.queue,
	});
	console.log(`Sent RPC request: ${message}`);
}

function generateUuid() {
	return (
		Math.random().toString() +
		Math.random().toString() +
		Math.random().toString()
	);
}

callRPC().catch(console.error);
