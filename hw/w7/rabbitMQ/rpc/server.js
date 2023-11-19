const amqp = require('amqplib');

async function respondToRPC() {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();

	const queue = 'rpc_queue';

	await channel.assertQueue(queue);

	channel.consume(queue, (msg) => {
		console.log(`Received RPC request: ${msg.content.toString()}`);

		const response = 'RPC response';
		channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
			correlationId: msg.properties.correlationId,
		});

		channel.ack(msg);
	});
}

respondToRPC().catch(console.error);
