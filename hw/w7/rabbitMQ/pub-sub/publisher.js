const amqp = require('amqplib');

async function publish() {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();

	const exchange = 'logs';
	const message1 = 'Log message 1';
	const message2 = 'Log message 2';

	await channel.assertExchange(exchange, 'fanout');

	channel.publish(exchange, '', Buffer.from(message1));
	console.log(`Published: ${message1}`);

	channel.publish(exchange, '', Buffer.from(message2));
	console.log(`Published: ${message2}`);

	setTimeout(() => {
		connection.close();
		process.exit(0);
	}, 500);
}

publish().catch(console.error);
