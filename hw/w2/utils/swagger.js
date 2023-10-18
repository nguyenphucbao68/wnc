import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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

const swaggerSpecs = swaggerJSDoc(options);

export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  app.get("/docs.json", (req, res) => {
    res.json(swaggerSpecs);
  });
};
