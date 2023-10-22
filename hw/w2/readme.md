# Preparation-for-LN03 - API Validation, API Docs

## Requirements

1. Validate client parameters
   - number of fields
   - datatype
   - field value
2. Make restful api documentation (at least 10 apis) with `openapi 3`, `swagger/postman`, `apidoc`
   - how to describe and explain an api and/or a parameter of that api
   - how to make a UI to test built api (like POSTMAN)
   - how to provide sample data for api request and response

## Dependencies: 
  - `express`: A Node.js framework for building web applications and APIs.
  - `knex`: A SQL query builder for Node.js, simplifying database interactions.
  - `mysql`: A Node.js package for connecting to MySQL databases.
  - `morgan`: An Express middleware for HTTP request logging.
  - `ajv`: JavaScript JSON Schema validator for data validation.
  - `ajv-formats`: An extension for Ajv to support more JSON schema formats.
  - `ajv-errors`: Allow custom error messages in JSON-Schema for Ajv validator.
  - `swagger-jsdoc`: This library reads your JSDoc-annotated source code and generates an OpenAPI (Swagger) specification.
  - `swagger-autogen`: Automates Swagger documentation for APIs by recognizing endpoints, methods, and more from code comments, generating a Swagger JSON file.
  - `swagger-ui-express`: An Express middleware for serving Swagger UI to explore API documentation.

## Steps

### Updating Project from Week 2: LN02 - RESTful API

For this tutorial, we will focus on API validation and API Docs based on the code to build a RESTful API from the previous week.

You can clone down the project by these command lines:
```console
$ git clone https://github.com/nguyenphucbao68/wnc.git
$ cd wnc/hw/hw1
$ yarn
```

### Setup Project Template for API Validation

Now, let's install 2 more dependencies are `ajv` which used for JSON schema validation and `ajv-formats` which adding support for additional data formats validation based on regular expressions as below: 
```console
$ yarn add ajv ajv-formats ajv-errors
```

Our package.json file will look like below:

```json
{
  "type": "module",
  "name": "sakilaapi",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app",
    "dev": "nodemon app"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ajv": "^8.12.0",
    "ajv-errors": "^3.0.0",
    "ajv-formats": "^2.1.1",
    "express": "^4.17.3",
    "knex": "^1.0.3",
    "mysql": "^2.18.1",
  }
}
```

Next, we will create a folder with name `schemas` inside the `wnc/hw/w1/` and create a file with name `film.schema.js` for our JSON schema of table `film`.

You can see the file `film.schema.js` as below. 

```js
const schema = {
  type: "object",
  properties: {
    film_id: {
      type: "integer",
      minimum: 0,
      errorMessage: {
        type: "Film's id is not an integer",
        minimum: "Film's id has to >= 0",
      },
    },
    title: { type: "string", maxLength: 255 },
    description: { type: "string", nullable: true },
    release_year: {
      type: "integer",
      minimum: 1901,
      maximum: 2155,
      nullable: true,
    },
    language_id: { type: "integer", minimum: 0 },
    original_language_id: { type: "integer", minimum: 0, nullable: true },
    rental_duration: { type: "integer", minimum: 0 },
    rental_rate: { type: "number" },
    length: { type: "integer", minimum: 0, nullable: true },
    replacement_cost: { type: "number" },
    rating: {
      type: "string",
      enum: ["G", "PG", "PG-13", "R", "NC-17"],
      nullable: true,
    },
    special_features: {
      type: "string",
      nullable: true,
      specialFeatureSet: true, // Using the custom keyword
    },
    last_update: {
      type: "string",
      format: "date-time", // Using the custom format from dependency ajv-formats
    },
  },
  required: ["title", "language_id"],
  additionalProperties: false,
};

export default schema;
```

Explain the above code: Below are the steps that the above JSON schema is created

1. Visit `phpMyAdmin` page with an url: `http://localhost/phpMyAdmin` (if you are using XAMPP) or `http://localhost/phpMyAdmin5` (if you are using MAMPP) to explore the structure of table `film`. 
<br><br>The structure of table film is as below:

![Structure of table film](/hw/w2/assets/images/sakilaapi_structure.png "Structure of table film")


2. Now, you knew the type and some additional information for each columns. Let's go create our schema:

   - First, we create the schema with datatype `object`
      ```js
      const schema = {
      type: "object",
      }
      ```
   - Secondly, we define the key properties for each columns:
     
     - `film_id`: In mysql structure `film_id` has type `smallint(5)`, attribute `UNSIGNED` and `AUTO_INCREMENT`. Therefore, we can define `film_id` with type: `integer` and minimum: 0. Moreover, we can custom error message for each attributes with `ajv-errors` as below:
        ```js
          const schema = {
            type: "object",
            properties: {
              film_id: {
                type: "integer",
                minimum: 0,
                errorMessage: {
                  type: "Film's id is not an integer",
                  minimum: "Film's id has to >= 0",
                },
              },
            }
          }
        ```
      
     - `title`: In mysql structure `title` has type `varchar(255)`. Therefore, we can define `title` with type: `string` and maxLength: 255 as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
              }
            }
        ```
     - `description`: In mysql structure `description` has type `text` and can be `NULL`. Therefore, we can define `description` with type: `string` and nullable: `true` as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
              }
            }
        ```
     - `release_year`: In mysql structure `release_year` has type `year(4)` and can be `NULL`. Therefore, we can define `release_year` with type: `integer`, minimum: 1901, maximum: 2155 (Because data type `year(4)` in mysql limit from 1901 to 2155) and nullable: `true` as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
              }
            }
        ```
     - `language_id`: In mysql structure `language_id` has type `tinyint(3)`, attribute `UNSIGNED`. Therefore, we can define `language_id` with type: `integer` and minimum: `0` as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
                language_id: { type: "integer", minimum: 0 },
              }
            }
        ```
     - `original_language_id`: In mysql structure `original_language_id` has type `tinyint(3)`, attribute `UNSIGNED` and can be `NULL`. Therefore, we can define `original_language_id` with type: `integer` and minimum: `0` and nullable: `true` as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
                language_id: { type: "integer", minimum: 0 },
                original_language_id: { type: "integer", minimum: 0, nullable: true },
              }
            }
        ```
     - `rental_duration`: In mysql structure `rental_duration` has type `tinyint(3)`, attribute `UNSIGNED`. Therefore, we can define `rental_duration` with type: `integer` and minimum: `0` as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
                language_id: { type: "integer", minimum: 0 },
                original_language_id: { type: "integer", minimum: 0, nullable: true },
                rental_duration: { type: "integer", minimum: 0 },
              }
            }
        ```
     - `rental_rate`: In mysql structure `rental_rate` has type `decimal(4,2)`. Therefore, we can define `rental_rate` with type: `number` as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
                language_id: { type: "integer", minimum: 0 },
                original_language_id: { type: "integer", minimum: 0, nullable: true },
                rental_duration: { type: "integer", minimum: 0 },
                rental_rate: { type: "number" },
              }
            }
        ```
     - `length`: In mysql structure `length` has type `smallint(5)`, attribute `UNSIGNED` and can be `NULL`. Therefore, we can define `length` with type: `integer`, minimum: `0` and nullable: `true` as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
                language_id: { type: "integer", minimum: 0 },
                original_language_id: { type: "integer", minimum: 0, nullable: true },
                rental_duration: { type: "integer", minimum: 0 },
                rental_rate: { type: "number" },
                length: { type: "integer", minimum: 0, nullable: true },
              }
            }
        ```
     - `replacement_cost`: In mysql structure `replacement_cost` has type `decimal(5,2)`. Therefore, we can define `replacement_cost` with type: `number` as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
                language_id: { type: "integer", minimum: 0 },
                original_language_id: { type: "integer", minimum: 0, nullable: true },
                rental_duration: { type: "integer", minimum: 0 },
                rental_rate: { type: "number" },
                length: { type: "integer", minimum: 0, nullable: true },
                replacement_cost: { type: "number" },
              }
            }
        ```
     - `rating`: In mysql structure `rating` has type `enum('G', 'PG', 'PG-13', 'R', 'NC-17')` and can be `NULL`. Therefore, we can define `rating` with type: `string`, enum: `["G", "PG", "PG-13", "R", "NC-17"]` and nullable: `true` as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
                language_id: { type: "integer", minimum: 0 },
                original_language_id: { type: "integer", minimum: 0, nullable: true },
                rental_duration: { type: "integer", minimum: 0 },
                rental_rate: { type: "number" },
                length: { type: "integer", minimum: 0, nullable: true },
                replacement_cost: { type: "number" },
                rating: {
                  type: "string",
                  enum: ["G", "PG", "PG-13", "R", "NC-17"],
                  nullable: true,
                },
              }
            }
        ```
     - `special_features`: In mysql structure `special_features` has type `set('Trailers','Commentaries','Deleted Scenes','Behind the Scenes')` and can be `NULL`. Therefore, we can define `special_features` with type: `string`, nullable: `true`, specialFeatureSet: `true` (We will explain this keyword in the next step) as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
                language_id: { type: "integer", minimum: 0 },
                original_language_id: { type: "integer", minimum: 0, nullable: true },
                rental_duration: { type: "integer", minimum: 0 },
                rental_rate: { type: "number" },
                length: { type: "integer", minimum: 0, nullable: true },
                replacement_cost: { type: "number" },
                rating: {
                  type: "string",
                  enum: ["G", "PG", "PG-13", "R", "NC-17"],
                  nullable: true,
                },
                special_features: {
                  type: "string",
                  nullable: true,
                  specialFeatureSet: true, // Using the custom keyword
                },
              }
            }
        ```
     - `last_update`: In mysql structure `last_update` has type `timestamp`. Therefore, we can define `last_update` with type: `string`, format: `date-time` (We will explain this keyword in the next step) as below:

        ```js
            const schema = {
              type: "object",
              properties: {
                film_id: {
                  type: "integer",
                  minimum: 0,
                },
                title: { type: "string", maxLength: 255 },
                description: { type: "string", nullable: true },
                release_year: {
                  type: "integer",
                  minimum: 1901,
                  maximum: 2155,
                  nullable: true,
                },
                language_id: { type: "integer", minimum: 0 },
                original_language_id: { type: "integer", minimum: 0, nullable: true },
                rental_duration: { type: "integer", minimum: 0 },
                rental_rate: { type: "number" },
                length: { type: "integer", minimum: 0, nullable: true },
                replacement_cost: { type: "number" },
                rating: {
                  type: "string",
                  enum: ["G", "PG", "PG-13", "R", "NC-17"],
                  nullable: true,
                },
                special_features: {
                  type: "string",
                  nullable: true,
                  specialFeatureSet: true, // Using the custom keyword
                },
                last_update: {
                  type: "string",
                  format: "date-time", // Using the custom format from  'ajv-formats' dependency
                },
              }
            }
        ```
   - Thirdly, we specify the `required` fields and `additionalProperties` to false so that any mismatch properties will occurs error:

      ```js
        ...
        required: ["title", "language_id"],
        additionalProperties: false,
        ...
      ```

   - Fourthly, we define the custom keyword `specialFeatureSet` and create a file `validate.middleware.js` inside new folder `middlewares` inside `wnc/hw/w1/` as below:

     ```js
      import Ajv from "ajv";
      import addFormats from "ajv-formats";

      export default function (schema) {
        return function validate(req, res, next) {
          const ajv = new Ajv();
          addFormats(ajv);

          // Define the predefined set of special features
          const validSpecialFeatures = new Set([
            "Trailers",
            "Commentaries",
            "Deleted Scenes",
            "Behind the Scenes",
          ]);

          // Define the custom keyword for field special_features in table film
          ajv.addKeyword({
            keyword: "specialFeatureSet",
            validate: (schema, data) => {
              // Check if this keyword is false then return true
              if(!schema) return true; 

              // Check if user did not pass special_features inside request body 
              if (data === null) return true;

              // Check type of data passed in is not a string
              if (typeof data !== "string") {
                return false; // The data is not a string.
              }

              // Split the string into an array using a comma as the delimiter
              const specialFeatures = data
                .split(",")
                .map((feature) => feature.trim());

              // Check if all elements in the array are unique and are in the predefined set
              const result = specialFeatures.every((feature) =>
                validSpecialFeatures.has(feature)
              );
              
              // Custom keyword for keyword specialFeatureSet whenever result is false
              if (!result) {
                validate.errors = [
                  {
                    keyword: "specialFeatureSet",
                    message:
                      "CSV string must be in SET('Trailers,Commentaries,Deleted Scenes,Behind the Scenes')",
                  },
                ];
                return false;
              }

              return true;
            },
          });

          const valid = ajv.validate(schema, req.body);
          if (!valid) {
            return res.status(400).json(ajv.errors);
          }

          next();
        };
      }
     ```
    - Next, we will import this validate in file `film.route.js` for method `POST` and `PATCH` (which passed in body request):
        ```js
         ...
          import validate from "../middlewares/validate.middleware.js";
          import schema from "../schemas/film.schema.js";
         ...
        ```

        ```js
         ...
          router.post("/", validate(schema), async function (req, res) {
            let film = req.body;
            const ret = await filmModel.add(film);

            film = {
              film_id: ret[0],
              ...film,
            };
            res.status(201).json(film);
          });
         ...
        ```

        ```js
         ...
          router.patch("/:id", validate(schema), async function (req, res) {
            const id = req.params.id || 0;
            const film = req.body;
            const n = await filmModel.patch(id, film);
            res.json({
              affected: n,
            });
          });
         ...
        ```
   - Finally, we run the server by enter these lines to command line:
      ```console
      $ yarn dev
      ```

This is the end of tutorial for API Validating with `Ajv`.

Next, we come to the second topic : API Documentation with `Swagger`

### First Approach: Setup Project Template for API Documentation From JSDoc comments

Now, let's install 2 more dependencies are `swagger-jsdoc` which used for generates OpenAPI documentation from JSDoc comments, `swagger-ui-express` which serving Swagger UI to explore API documentation as below: 
```console
$ yarn add swagger-jsdoc swagger-ui-express swagger-autogen
```

Our package.json file will look like below:

```json
{
  "type": "module",
  "name": "sakilaapi",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app",
    "dev": "nodemon app"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1",
    "express": "^4.17.3",
    "knex": "^1.0.3",
    "mysql": "^2.18.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0"
  }
}
```

Next, we will create a file `swagger.js` to initializes and serves Swagger documentation for our Sakila API.

You can follow the step by step for the file `swagger.js` below:

1. Import dependencies: These are modules that help generate and serve Swagger documentation for your API.

```js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
...
```

2. Swagger definition:

```js
...
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
...
```

Explain the above code:

 - `openapi`: "3.0.0" indicates that the API follows the `OpenAPI 3.0.0 specification`.
 - `info` contains details like the `title`, `version` (This is the `project's version` specified in file `package.json`), `description`, and `contact` information for our API.
 - `servers` specifies where our API is hosted. In this case, it's the development server at "http://localhost:3000".


3. Swagger options:

```js
...
// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js", "./schemas/*.js"],
};
...
```
Explain: 

 - `options` is an object that includes the swaggerDefinition and the paths to the API route and schema files.
 - `swaggerDefinition` is set to the previously defined swaggerDefinition.
 - `apis` is an array containing file paths to route and schema files. This tells `swagger-jsdoc` where to look for API documentation annotations. It includes all JavaScript files in the `./routes` and `./schemas` directories that have a `.js` extension.

4. Swagger options:

```js
...
// Initialize swagger-jsdoc
const swaggerSpecs = swaggerJSDoc(options);
...
```
Explain: 

 - This generates the Swagger documentation based on the configuration in above.

5. Export swagger middleware function:

```js
...
// Export swagger
export default (app) => {
  // Serve swagger docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  // Serve swagger specs as JSON endpoint
  app.get("/docs.json", (req, res) => {
    res.json(swaggerSpecs);
  });
};
...
```
Explain: 

 - `app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))` serves the Swagger UI at the `/api-docs` route. Users can access the Swagger documentation interface through this route. The swaggerUi.serve and swaggerUi.setup functions are used to display the Swagger UI.
 - `app.get("/docs.json", (req, res) => {...})` serves the Swagger documentation as a JSON endpoint at the "/docs.json" route. Users or applications can access the raw Swagger JSON data from this route.

Now we will update the `schemas` and `routes` of `film`, `actor`, and `category`:

 1. Film
  
    - `film.schema.js`

      ```js
      /**
        ...
        * @openapi
        * components:
        *   schemas:
        *    Film:
        *      type: object
        *      required:
        *        - title
        *        - language_id
        *      properties:
        *        film_id:
        *          type: integer
        *          description: The auto-generated id of the film
        *          example: 1
        *        title:
        *          type: string
        *          description: The title of the film
        *          example: string
        *        description:
        *          type: string
        *          description: The description of the film
        *          example: string
        *        release_year:
        *          type: integer
        *          description: The release year of the film
        *          example: 2006
        *        language_id:
        *          type: integer
        *          description: The language id of the film
        *          example: 1
        *        original_language_id:
        *          type: integer
        *          description: The original language id of the film
        *          example: 1
        *        rental_duration:
        *          type: integer
        *          description: The rental duration of the film
        *          example: 6
        *        rental_rate:
        *          type: number
        *          description: The rental rate of the film
        *          example: 0.99
        *        length:
        *          type: integer
        *          description: The length of the film
        *          example: 86
        *        replacement_cost:
        *          type: number
        *          description: The replacement cost of the film
        *          example: 20.99
        *        rating:
        *          type: string
        *          description: The rating of the film
        *          enum: [G, PG, PG-13, R, NC-17]
        *        special_features:
        *          type: string
        *          description: CSV string of set ["Trailers","Commentaries","Deleted Scenes","Behind the Scenes",]
        *          example: "Trailers,Deleted Scenes"
        *        last_update:
        *          type: string
        *          format: date-time
        *          description: The last update of the film
        *          example: 2006-02-15 05:03:42
        */
        ...
      ```

    - `film.route.js`: 
    
      1. API route to get all films 

          ```js
            ...
            /**
              * @openapi
              * tags:
              *   name: Films
              *   description: The films managing API
              * /api/films/:
              *   get:
              *     tags: [Films]
              *     summary: Returns all films
              *     responses:
              *       200:
              *         description: An array of films
              *         content:
              *           application/json:
              *             schema:
              *               $ref: '#/components/schemas/Film'
              *             example:
              *             - film_id: 1
              *               title: string
              *               description: string
              *               release_year: 2006
              *               language_id: 1
              *               original_language_id: 1
              *               rental_duration: 6
              *               rental_rate: 0.99
              *               length: 86
              *               replacement_cost: 20.99
              *               special_features: "Trailers,Deleted Scenes"
              *               rating: G
              *               last_update: 2006-02-15 05:03:42
              */
            ...
          ```
      2. API route to get film by id 

          ```js
            ...
            /**
              * @openapi
              * /api/films/{id}:
              *   get:
              *     tags: [Films]
              *     summary: Returns a single film
              *     parameters:
              *       - name: id
              *         description: Film's id
              *         in: path
              *         required: true
              *         type: integer
              *     responses:
              *       200:
              *         description: A single film
              *         content:
              *           application/json:
              *             schema:
              *               $ref: '#/components/schemas/Film'
              *       204:
              *         description: No content
              */
            ...
          ```
      3. API route to add a new film

          ```js
            ...
            /**
              * @openapi
              * /api/films/:
              *   post:
              *     tags: [Films]
              *     summary: Adds a new film
              *     requestBody:
              *       description: Film object
              *       required: true
              *       content:
              *         application/json:
              *           schema:
              *             $ref: '#/components/schemas/Film'
              *     responses:
              *       201:
              *         description: The created film
              *         content:
              *           application/json:
              *             schema:
              *               $ref: '#/components/schemas/Film'
              */
            ...
          ```
      4. API route to delete a film by id

          ```js
            ...
            /**
              * @openapi
              * /api/films/{id}:
              *   delete:
              *     tags: [Films]
              *     summary: Removes a single film
              *     parameters:
              *       - name: id
              *         description: Film's id
              *         in: path
              *         required: true
              *         type: integer
              *     responses:
              *       200:
              *         description: Number of affected rows
              *         content:
              *           application/json:
              *             schema:
              *               type: object
              *               properties:
              *                 affected:
              *                   type: integer
              *             example:
              *               affected: 1
              */
            ...
          ```
      5. API route to update a film by id

          ```js
            ...
            /**
              * @openapi
              * /api/films/{id}:
              *   patch:
              *     tags: [Films]
              *     summary: Updates a single film
              *     parameters:
              *       - name: id
              *         description: Film's id
              *         in: path
              *         required: true
              *         type: integer  
              *     requestBody:
              *       description: Film object
              *       required: true
              *       content:
              *         application/json:
              *           schema:
              *             $ref: '#/components/schemas/Film'
              *     responses:
              *       200:
              *         description: Number of affected rows
              *         content:
              *           application/json:
              *             schema:
              *               type: object
              *               properties: 
              *                 affected:
              *                   type: integer  
              *             example:
              *               affected: 1
              */
            ...
          ```
 2. Actor
  
    - `actor.schema.js`

      ```js
      /**
        * @openapi
        * components:
        *   schemas:
        *    Actor:
        *      type: object
        *      required:
        *        - first_name
        *        - last_name
        *      properties:
        *        actor_id:
        *          type: integer
        *          description: The auto-generated id of the actor
        *          example: 1
        *        first_name:
        *          type: string
        *          description: The first name of the actor
        *          example: string 
        *        last_name:
        *          type: string
        *          description: The last name of the actor
        *          example: string
        *        last_update:
        *          type: string
        *          format: date-time
        *          description: The last update of the actor
        *          example: 2006-02-15 05:03:42
        */
        ...
      ```

    - `actor.route.js`: 
    
      1. API route to get all actors 

          ```js
            ...
            /**
              * @openapi
              * tags:
              *   name: Actors
              *   description: The actors managing API
              * /api/actors/:
              *   get:
              *     tags: 
              *       - Actors
              *     summary: Returns all actors
              *     responses:
              *       200:
              *         description: An array of actors
              *         content:
              *           application/json:
              *             schema:
              *               $ref: '#/components/schemas/Actor'
              *             example:
              *               - actor_id: 1
              *                 first_name: string
              *                 last_name: string
              *                 last_update: 2006-02-15 05:03:42
              */
            ...
          ```
      2. API route to get actor by id 

          ```js
            ...
            /**
              * @openapi
              * /api/actors/{id}/:
              *   get:
              *     tags: [Actors]
              *     summary: Returns a single actor
              *     parameters:
              *       - name: id
              *         description: Actor's id
              *         in: path
              *         required: true
              *         type: integer
              *     responses:
              *       200:
              *         description: A single actor
              *         content:
              *           application/json:
              *             schema:
              *               $ref: '#/components/schemas/Actor'
              *       204:
              *         description: No actor found
              */
            ...
          ```

      3. API route to add a new actor

          ```js
            ...
            /** 
              * @openapi
              * /api/actors/:
              *   post:
              *     tags: [Actors]
              *     summary: Create a new actor
              *     requestBody:
              *       description: Actor's data
              *       required: true
              *       content:
              *         application/json:
              *           schema:
              *             $ref: '#/components/schemas/Actor'
              *     responses:
              *       201:
              *         description: Created
              *         content:
              *           application/json:
              *             schema:
              *               $ref: '#/components/schemas/Actor'
              */
            ...
          ```

      4. API route to delete an actor by id

          ```js
            ...
            /**
              * @openapi
              * /api/actors/{id}/:
              *   delete:
              *     tags: [Actors]
              *     summary: Remove a single actor
              *     parameters:
              *       - name: id
              *         description: Actor's id
              *         in: path
              *         required: true
              *         type: integer
              *     responses:
              *       200:
              *         description: Number of affected rows
              *         content:
              *           application/json:
              *             schema:
              *               $ref: '#/components/schemas/Actor'
              *         example:
              *           affected: 1
              *       204:
              *         description: No actor found
              */
            ...
          ```

      5. API route to update an actor by id

          ```js
            ...
            /**
              * @openapi
              * /api/actors/{id}/:
              *   patch:
              *     tags: [Actors]
              *     summary: Updates a single actor
              *     parameters:
              *       - name: id
              *         description: Actor's id
              *         in: path
              *         required: true
              *         type: integer
              *     requestBody:
              *       description: Actor object
              *       required: true
              *       content:
              *         application/json:
              *           schema:
              *             $ref: '#/components/schemas/Actor'
              *     responses:
              *       200:
              *         description: A single actor
              *         content:
              *           application/json:
              *             schema:
              *               $ref: '#/components/schemas/Actor'
              *       204:
              *         description: No actor found
              */
            ...
          ```

Now, we can visit the url `/api-docs` we specified in the previous section at
[http://localhost:3000/api-docs](http://localhost:3000/api-docs) to test out the API endpoints.

![Swagger UI](/hw/w2/assets/images/api_docs_swagger_ui.png "Swagger UI")

### Second Approach: Setup Project Template for API Documentation From auto-generated JSDoc by module `swagger-autogen`

As an alternative to manually writing JSDoc comments, the second approach automates API documentation using the `swagger-autogen` module. This approach streamlines the process and reduces the need for manual documentation.
<br><br>Now we need to add module `swagger-autogen` into our `package.json` file by enter the below command:

```console
$ yarn add swagger-autogen
```

Our package.json file will look like below:

```json
{
  "type": "module",
  "name": "sakilaapi",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "swagger-autogen": "node swagger_autogen.js",
    "start": "node app",
    "dev": "nodemon app"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ajv": "^8.12.0",
    "ajv-errors": "^3.0.0",
    "ajv-formats": "^2.1.1",
    "express": "^4.17.3",
    "knex": "^1.0.3",
    "morgan": "^1.10.0",
    "mysql": "^2.18.1",
    "swagger-autogen": "^2.23.6",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

Now, we need to create a file to use function `swaggerAutogen` provided by module `swagger-autogen` to write JSDoc to output file.

```js
import swaggerAutogen from "swagger-autogen";

// Specify the path to the JSON file where the Swagger documentation will be generated.
const outputFile = "./swagger_output.json";

// Specify an array of files that contain the endpoint definitions/routes want to document.
const endpointsFiles = ["./app.js"];

// Use 'swagger-autogen' to generate Swagger documentation. This function will take the
// 'outputFile' as the target location for the generated documentation and 'endpointsFiles'
// as an array of files that contain the API endpoint definitions want to document.
swaggerAutogen(outputFile, endpointsFiles);
```

Next, we just have to enter this command to write down automated JSDoc to output file `swagger_output.json` :

```console
$ node swagger_autogen.js
```

A file with name `swagger_output.json` will be created at the root directory as below:

```json
{
  "swagger": "2.0",
  "info": {
    "title": "Sakila API Documentation",
    "version": "1.0.0",
    "description": "Documentation for Sakila API"
  },
  "servers": [
    {
      "url": "http://localhost:3000/"
    }
  ],
  "paths": {
    "/": {
      "get": {
        "description": "",
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "post": {
        "description": "",
        "responses": {
          "201": {
            "description": "Created"
          }
        }
      }
    },
    "/err": {
      "get": {
        "description": "",
        "responses": {
          "default": {
            "description": ""
          }
        }
      }
    },
    "/api/categories/": {
      "get": {
        "description": "",
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "post": {
        "description": "",
        "responses": {
          "201": {
            "description": "Created"
          }
        }
      }
    },
    "/api/categories/{id}": {
      "get": {
        "description": "",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "204": {
            "description": "No Content"
          }
        }
      },
      "delete": {
        "description": "",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "patch": {
        "description": "",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/films/": {
      "get": {
        "description": "",
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "post": {
        "description": "",
        "responses": {
          "201": {
            "description": "Created"
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    },
    "/api/films/{id}": {
      "get": {
        "description": "",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "204": {
            "description": "No Content"
          }
        }
      },
      "delete": {
        "description": "",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "patch": {
        "description": "",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    },
    "/api/actors/": {
      "get": {
        "description": "",
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "post": {
        "description": "",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "actor_id": {
                  "example": "any"
                }
              }
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Created"
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    },
    "/api/actors/{id}": {
      "get": {
        "description": "",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "204": {
            "description": "No Content"
          }
        }
      },
      "delete": {
        "description": "",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      },
      "patch": {
        "description": "",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    }
  }
}
```

Finally, we need to adjust `swagger.js` file to read above json file in `type: "module"`:

```js
...
import { readFile } from "fs/promises";

// Parse the 'swagger_output.json' file
const swaggerFile = JSON.parse(
  await readFile(new URL("../swagger_output.json", import.meta.url))
);
...
```

```js
...
// Export swagger
export default (app) => {
  // Second approach: Serve swagger docs auto-generated by swagger-autogen
  app.use("/autogen-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

  // Serve swagger specs as JSON endpoint
  app.get("/docs.json", (req, res) => {
    res.json(swaggerFile);
  });
};
```

Now, we can visit the url `/autogen-docs` we specified in the previous section at
[http://localhost:3000/autogen-docs](http://localhost:3000/autogen-docs) to test out the API endpoints.

![Swagger UI](/hw/w2/assets/images/autogen_docs.png "Swagger UI")

In summary, `swagger-jsdoc` relies on JSDoc comments in your code to annotate and document API routes. It requires manual comment annotations for each route, allowing you to precisely define request and response information. This manual approach provides fine-grained control and flexibility but can be time-consuming for larger APIs.

On the other hand, `swagger-autogen` automatically generates Swagger documentation by inspecting your Express routes, identifying endpoints, HTTP methods, and parameters. It reduces the need for manual documentation and is suitable for quickly setting up documentation. While it may lack the granular control of Swagger-JSDoc, it offers a convenient way to get started with documentation, especially for smaller or rapidly evolving projects.

### Import Swagger APIs into Postman

1. Visit the url `/docs.json` we specified in the previous section at
[http://localhost:3000/docs.json](http://localhost:3000/docs.json) and copy the raw Swagger documentation JSON.

![Swagger documentation JSON](/hw/w2/assets/images/docs_json.png "Swagger documentation JSON")

2. Open `Postman` and click on the `Import` button.

![Postman import button](/hw/w2/assets/images/postman_import_button.png "Postman import button")

3. Paste the URL from step 1 and follow the default process. After the imported successfully, you will get the collection of our Sakila API as below: 

![Postman Imported Collection](/hw/w2/assets/images/postman_imported_collection.png "Postman Imported Collection")

## Video
[[Group03 - CSC13114_20KTPM1 - Web nâng cao] Preparation-for-LN03 - API Validation, API Docs](https://youtu.be/zPeanYsoS4A)
