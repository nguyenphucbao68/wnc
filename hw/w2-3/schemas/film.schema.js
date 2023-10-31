/**
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
