import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger definition
const swaggerDefinition = {
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
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js", "./schemas/*.js"],
};

// Initialize swagger-jsdoc
const swaggerSpecs = swaggerJSDoc(options);

// Export swagger
export default (app) => {
  // Serve swagger docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  // Serve swagger specs as JSON endpoint
  app.get("/docs.json", (req, res) => {
    res.json(swaggerSpecs);
  });
};
