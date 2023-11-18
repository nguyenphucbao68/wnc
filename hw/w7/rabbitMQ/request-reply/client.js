const amqp = require('amqplib');

async function receiveRequest() {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();

	const requestQueue = 'request_queue';
	const replyQueue = 'reply_queue';

	await channel.assertQueue(requestQueue);
	await channel.assertQueue(replyQueue);

	const message = 'Hello, Server!';

	channel.sendToQueue(requestQueue, Buffer.from(message), {
		replyTo: replyQueue,
	});

	console.log(`Sent request: ${message}`);

	channel.consume(
		replyQueue,
		(msg) => {
			console.log(`Received response: ${msg.content.toString()}`);
			connection.close();
		},
		{ noAck: true }
	);
}

receiveRequest().catch(console.error);
