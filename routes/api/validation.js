const Joi = require("joi");

const validateJoi = (obj) => {
  const person = Joi.object({
    id: Joi.string().guid(), 
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(9).max(15).required(),
    favorite: Joi.bool(),
  });
  
  return person.validate(obj);
};

module.exports = {
  validateJoi,
};