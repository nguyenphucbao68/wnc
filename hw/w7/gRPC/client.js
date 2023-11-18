var PROTO_PATH = __dirname + '/protos/person.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});
var personProto = grpc.loadPackageDefinition(packageDefinition);

function main() {
	var client = new personProto.Person(
		'localhost:50051',
		grpc.credentials.createInsecure()
	);

	// Calling the RPC method
	client.getPerson({ id: 1 }, function (err, response) {
		if (err) {
			console.log('Fail to send request');
		} else {
			console.log('Hello: ', response);
		}
	});
}

main();
