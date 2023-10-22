import swaggerAutogen from "swagger-autogen";

// Specify the path to the JSON file where the Swagger documentation will be generated.
const outputFile = "./swagger_output.json";

// Specify an array of files that contain the endpoint definitions/routes want to document.
const endpointsFiles = ["./app.js"];

// Use 'swagger-autogen' to generate Swagger documentation. This function will take the
// 'outputFile' as the target location for the generated documentation and 'endpointsFiles'
// as an array of files that contain the API endpoint definitions want to document.
swaggerAutogen(outputFile, endpointsFiles);
