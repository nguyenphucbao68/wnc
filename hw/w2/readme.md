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
  - `swagger-jsdoc`: This library reads your JSDoc-annotated source code and generates an OpenAPI (Swagger) specification.
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
$ yarn add ajv ajv-formats
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
     
     - `film_id`: In mysql structure `film_id` has type `smallint(5)`, attribute `UNSIGNED` and `AUTO_INCREMENT`. Therefore, we can define `film_id` with type: `integer` and minimum: 0 as below:
        ```js
          const schema = {
            type: "object",
            properties: {
              film_id: {
                type: "integer",
                minimum: 0,
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
              return specialFeatures.every((feature) =>
                validSpecialFeatures.has(feature)
              );
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

### Setup Project Template for API Documentation

Now, let's install 2 more dependencies are `swagger-jsdoc` which used for generates OpenAPI documentation from JSDoc comments. and `swagger-ui-express` which serving Swagger UI to explore API documentation as below: 
```console
$ yarn add swagger-jsdoc swagger-ui-express
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

## Video


