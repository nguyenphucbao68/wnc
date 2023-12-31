import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { readFile } from "fs/promises";

// Parse the 'swagger_output.json' file
const swaggerFile = JSON.parse(
  await readFile(new URL("../default_swagger_output.json", import.meta.url))
);

// Options for the swagger docs
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Sakila API Documentation",
      version: "1.0.0",
      description: "Documentation for Sakila API",
      contact: {
        name: "Group 3",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js", "./schemas/*.js"],
};

// Initialize swagger-jsdoc
const swaggerSpecs = swaggerJSDoc(options);

// Export swagger
export default (app) => {
  // // First approach: Serve swagger docs built by swagger-jsdoc
  // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  // Second approach: Serve swagger docs auto-generated by swagger-autogen
  app.use("/autogen-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

  // Serve swagger specs as JSON endpoint
  app.get("/docs.json", (req, res) => {
    res.json(swaggerSpecs);
  });
};
