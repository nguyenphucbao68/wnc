# Homework 7

👉 Students make a simple demonstration for showing how to use gRPC to integrate 2 systems
👉 Students make a simple demonstration for showing how to use Messag Queue to integrate 2 systems, follow the request/reply, pub/sub, remote procedure call
👉 Students describe the differences between synchronous api call and asynchronous api call
👉 Students make a simple demonstration for creating simple chat application using socket.io / SignraR or other libraries

Let's dive in

# Using gRPC to integerate 2 systems by NodeJS

## Prerequisite:

1.  NodeJS

## 1. Setup folder

```console
$ mkdir gRPC
$ cd gRPC
$ npm init
```

## 2. Install libraries/dependencies

Let's install 2 libraries/dependencies:

1. @grpc/grpc-js: Allows you to create gRPC servers and clients in JavaScript. It provides the necessary tools to interact with gRPC services, make RPC calls, and handle communication between client and server.
2. @grpc/proto-loader: This package is used to load Protocol Buffers (.proto files) in Node.js applications. A module that helps in loading, parsing, and converting Protocol Buffer definitions to usable JavaScript objects

```console
$ npm install @grpc/grpc-js @grpc/proto-loader
```

Our package.json file will look alike below:

```json
{
	"name": "grpc-node",
	"version": "1.0.0",
	"description": "integrate 2 systems",
	"main": "",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"author": "",
	"license": "ISC",
	"dependencies": {
		"@grpc/grpc-js": "^1.9.11",
		"@grpc/proto-loader": "^0.7.10"
	}
}
```

## 3. Defining the services

Next, we define the gRPC _service_ and the method _request_ and _response_ types using protocol buffers (all in .proto file).
We create a .protofile named `person.proto` in new folder `protos`.

```console
$ mkdir protos
$ cd protos
$ echo > person.proto
```

To define a service, we specify a named service in our `.proto` file.

```console
service Person {
   ...
}
```

Then we define rpc methods inside our service definition, specifying their request and response types. gRPC lets us define our kinds of service methods, all of which are used in the `Person` service:

```console
service Person {
   // Get a person by id
    rpc GetPerson(PersonRequest) returns (PersonResponse) {}
}
```

Now, we define our request/response structure `PersonRequest` and `PersonResponse`with keyword `message`

```console
message PersonRequest {
  int32 id = 1;
}

message PersonResponse {
  int32 id = 1;
  string name = 2;
}
```

The whole file `person.proto` will look like this

```console
syntax = "proto3";

service Person {
   // Get a person by id
    rpc GetPerson(PersonRequest) returns (PersonResponse) {}
}

message PersonRequest {
  int32 id = 1;
}

message PersonResponse {
  int32 id = 1;
  string name = 2;
}
```

The `syntax = "proto3"`; statement is essential because it informs the Protocol Buffers compiler about the specific syntax version to be used for parsing and interpreting the content of the `.proto` file.

## 4. Loading service descriptors from proto files

The Node.js library dynamically generates service descriptors and client stub definitions from `.proto` files loaded at runtime.

To load a `.proto` file, simply require the gRPC proto loader library and use its `loadSync()` method, then pass the output to the gRPC library’s `loadPackageDefinition` method:

```console
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
```

Once we done this, the stub constructor is in the personProto namespace and the service descriptor (which is used to create a server) is a property of the stub;

## 5. Create the server

First, our server has a `Server` constructor generated from service descriptor.

```console
var server = new grpc.Server();
```

Second, we implement the service method, which is `getPerson`. Before that, we can prepare a list of person data (object with `id` and `name`)

```console
const data = [
	{ id: 0, name: 'admin' },
	{ id: 1, name: 'user' },
];
function getPerson(call, callback) {
	const requestedId = call.request.id;
	const personData = data.find((item) => item.id == requestedId);
	callback(null, personData);
}
```

This function get the id of request sent to and search the person in `data` whose id equals to it. `callback` function will run to send the response containing the data back to gRPC client.
`callback` has 2 arguments:

1. `null` represent an error.
2. `personData` contains the data (if found) or undefined (if not found).

Third, we define the service to the gRPC server.

```console
server.addService(personProto.Person.service, { getPerson: getPerson });
```

- `personProto.Person.service`: This references the service definition from the `personProto` object, which is generated from the `.proto` file using gRPC tools. It represents the service definition (`Person`) defined in the `.proto` file.
- `{ getPerson: getPerson }`: Within the `Person` service, this associates the `getPerson` method defined in the service with the `getPerson` function in your Node.js code. It links the RPC method in the gRPC service definition (`getPerson`) to the JavaScript function (`getPerson`) that will handle this specific RPC call when invoked.

Next part,

```console
server.bindAsync(
	'0.0.0.0:50051',
	grpc.ServerCredentials.createInsecure(),
	() => {
		server.start();
	}
);

```

This code snippet will set the server to listen on a specific port (`50051`).

- The IP address 0.0.0.0 used in the server.bindAsync() function call indicates that the gRPC server should listen on all available network interfaces on the machine. It means the server will be reachable via any of the IP addresses associated with the machine, including 127.0.0.1 (localhost), the local loopback address.

- `grpc.ServerCredentials.createInsecure()`: Creates server credentials using the `createInsecure()` method, indicating that the server will run without any transport security (no encryption). This is suitable for development or testing environments but not recommended for production.
- `() => { server.start(); }`: This is the callback function will run after the server is successfully bound to the specified address and port. Inside the callback, server.start() is called to start the gRPC server, making it ready to accept incoming gRPC requests.

The whole file will look like [this](https://github.com/nguyenphucbao68/wnc/blob/master/hw/w7/gRPC/server.js):

## Create the client

To call service methods, we first need to create a _stub_. To do this, we just need to call the `personProto` stub constructor, specifying the server address and port.

```console
	var client = new personProto.Person(
		'localhost:50051',
		grpc.credentials.createInsecure()
	);
```

`grpc.credentials.createInsecure()`: Creates insecure credentials for the gRPC client. In this context, `createInsecure()` method is used to set up the client without any transport security (no encryption).

And next, we simply call the method

```console
// Calling the RPC method
	client.getPerson({ id: 0 }, function (err, response) {
		if (err) {
			console.log('Fail to send request');
		} else {
			console.log('Hello: ', response);
		}
	});
```

## 6 Run server and client

Run the 2 following commands in 2 different cmd to see the result:

```console
$ node server.js
```

```console
$ node client.js
```

# Using RabbitMQ to integrate 2 systems (request/reply, pub/sub, remote procedure call)

# Differentiation between synchronous api call vs asynchoronous api call

# Simple chat application using socket.io and NodeJS

# Yêu cầu alternative RestufulAPI để kết nối 2 máy tính

- Tất cả các nhóm làm GRPC
- Xài yêu cầu đơn giản: 1 + 1 = 2
- Message Queue (Capcha,RabbitMQ):
  - Phân biệt async / sync api call
- Khi nào nên sử dụng message queue, khi nào sử dụng Restful API

# Làm socket

- Express: SocketIO (gợi ý)
- 2 client chat realtime, không cần F5
- Giao diện: 2 file html có chat box, nút gửi

React

Redux

Router
