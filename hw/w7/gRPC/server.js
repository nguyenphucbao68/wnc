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

const data = [
	{ id: 0, name: 'admin' },
	{ id: 1, name: 'user' },
];
function getPerson(call, callback) {
	const requestedId = call.request.id;
	const personData = data.find((item) => item.id == requestedId);
	callback(null, personData);
}

/**
 * Starts an RPC server that receives requests for the Person service at the
 * sample server port
 */
function main() {
	var server = new grpc.Server();
	server.addService(personProto.Person.service, { getPerson: getPerson });
	server.bindAsync(
		'0.0.0.0:50051',
		grpc.ServerCredentials.createInsecure(),
		() => {
			server.start();
		}
	);
}

main();
