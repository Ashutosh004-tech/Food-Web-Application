const Joi = require('joi');

// Items Schema 
module.exports.itemShema = Joi.object({
    items : Joi.object({
        item:Joi.string().required(),
        price:Joi.number().required().min(0),
        description:Joi.string().required(),
        image:Joi.string().allow("",null),
    }).required(),
});

// Review Schema
module.exports.reviewShema = Joi.object({
    review : Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});

