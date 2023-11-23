const amqp = require('amqplib');

async function sendRequest() {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();

	const requestQueue = 'request_queue';

	await channel.assertQueue(requestQueue);

	channel.consume(requestQueue, (msg) => {
		console.log(`Received request: ${msg.content.toString()}`);

		const response = 'This is the server response!';

		channel.sendToQueue(msg.properties.replyTo, Buffer.from(response));
		channel.ack(msg);
	});
}

sendRequest().catch(console.error);
