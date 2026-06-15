const Joi = require("joi");
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().trim().max(100).required(),

        description: Joi.string().trim().max(1000).required(),

        location: Joi.string().trim().max(100).required(),

        country: Joi.string().trim().max(50).required(),

        price: Joi.number().min(0).integer().required(),

        image: Joi.object({
            url: Joi.string().allow("", null),
        }).optional(),
    }).required(),
        

});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number()
      .min(1)
      .max(5)
      .required(),

    comment: Joi.string()
      .trim()
      .max(500)
      .required(),

  }).required(),
});