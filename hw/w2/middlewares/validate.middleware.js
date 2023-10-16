import Ajv from "ajv";
import addFormats from "ajv-formats";

export default function (schema) {
  return function validate(req, res, next) {
    const ajv = new Ajv();
    addFormats(ajv);
    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      return res.status(400).json(ajv.errors);
    }

    next();
  };
}
