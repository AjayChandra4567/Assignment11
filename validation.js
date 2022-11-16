//VALIDATION
const Joi = require("joi");


//Register Validation
registerValidation = data => {
const schema = Joi.object({
    firstName: Joi.string().required().min(3).max(15),
    lastName: Joi.string().required().min(3).max(15),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(15),
})
    return schema.validate(data);
}
//Login Validation
loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })
        return schema.validate(data);
    }


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;