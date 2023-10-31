import Ajv from "ajv";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

export default function (schema) {
  return function validate(req, res, next) {
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    ajvErrors(ajv);

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
      validate: function validate(schema, data) {
        // Check if this keyword is false then return true
        if (!schema) return true;

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
