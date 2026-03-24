const Joi = require('joi');

// Product validation schemas
const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(2000).allow('', null),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  category: Joi.string().max(100).allow('', null),
  sku: Joi.string().alphanum().min(3).max(100).required(),
  imageUrl: Joi.string().uri().allow('', null),
  isActive: Joi.boolean().default(true)
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(2000).allow('', null),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().max(100).allow('', null),
  sku: Joi.string().alphanum().min(3).max(100).required(),
  imageUrl: Joi.string().uri().allow('', null),
  isActive: Joi.boolean().required()
});

const patchProductSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  description: Joi.string().max(2000).allow('', null),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  category: Joi.string().max(100).allow('', null),
  sku: Joi.string().alphanum().min(3).max(100),
  imageUrl: Joi.string().uri().allow('', null),
  isActive: Joi.boolean()
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  validateCreateProduct: validate(createProductSchema),
  validateUpdateProduct: validate(updateProductSchema),
  validatePatchProduct: validate(patchProductSchema)
};