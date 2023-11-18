const amqp = require('amqplib');

async function subscribe() {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();

	const exchange = 'logs';

	await channel.assertExchange(exchange, 'fanout');
	const { queue } = await channel.assertQueue('', { exclusive: true });

	channel.bindQueue(queue, exchange, '');
	console.log('Waiting for logs...');

	channel.consume(
		queue,
		(msg) => {
			console.log(`Received log: ${msg.content.toString()}`);
		},
		{ noAck: true }
	);
}

subscribe().catch(console.error);
