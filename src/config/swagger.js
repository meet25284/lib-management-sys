import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Library Management API",
      version: "1.0.0",
      description: "API Documentation",
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },

  apis: ["../routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;