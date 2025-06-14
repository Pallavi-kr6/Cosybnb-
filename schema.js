//does validadation for us in easier way
// This file defines a Joi schema for validating a listing object.
// It ensures that the listing has a title, description, location, country, price, and an optional image field.
// The title, description, location, and country must be strings, while price must be a number greater than or equal to 0.

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      filename: Joi.string().allow("", null),
      url: Joi.string().uri().allow("", null),
    }).optional(),
  }).required(),
});


module.exports.reviewSchema=Joi.object({
    review: Joi.object({
          comment : Joi.string().required(),
        rating : Joi.number().required().min(1).max(5)
      
    }).required(),
})

