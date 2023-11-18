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

function getPerson(call, callback) {
	console.log('call ' + call.request.id);
	callback(null, { message: call.request.id });
}

/**
 * Starts an RPC server that receives requests for the Person service at the
 * sample server port
 */
function main() {
	console.log('personProto.Person.service ', personProto.Person.service);
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
