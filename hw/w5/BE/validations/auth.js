import Joi from 'joi';

export const registerValidator = (data) => {
  const rule = Joi.object({
    email: Joi.string().min(6).max(225).required().email(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{6,20}$'))
      .required(),
  });

  const validation = rule.validate(data);

  if (validation.error) {
    throw new Error(validation.error.details[0].message);
  }

  return validation.value;
};

