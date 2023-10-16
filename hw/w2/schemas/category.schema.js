/**
 * @openapi
 * components:
 *   schemas:
 *    Category:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        category_id:
 *          type: integer
 *          description: The auto-generated id of the category
 *          example: 1
 *        name:
 *          type: string
 *          description: The first name of the category
 *          example: Action 
 *        last_update:
 *          type: string
 *          format: date-time
 *          description: The last update of the category
 *          example: 2006-02-15 05:03:42
 */
const schema = {
    type: "object",
    properties: {
      category_id: {
        type: "integer",
        minimum: 0,
      },
      name: { type: "string", maxLength: 25 },
      last_update: { type: "string", format: "date-time" },
    },
    required: ["name"],
    additionalProperties: false,
  };
  
  export default schema;
  