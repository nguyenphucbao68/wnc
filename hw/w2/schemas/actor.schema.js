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
const schema = {
  type: "object",
  properties: {
    actor_id: {
      type: "integer",
      minimum: 0,
    },
    first_name: { type: "string", maxLength: 45 },
    last_name: { type: "string", maxLength: 45 },
    last_update: { type: "string", format: "date-time" },
  },
  required: ["first_name", "last_name"],
  additionalProperties: false,
};

export default schema;
