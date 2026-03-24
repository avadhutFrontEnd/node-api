const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).required(),
  content: Joi.string().min(10).required(),
  excerpt: Joi.string().max(500).allow('', null),
  authorName: Joi.string().min(2).max(100).required(),
  status: Joi.string().valid('draft', 'published').default('draft')
});

const commentSchema = Joi.object({
  authorName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  content: Joi.string().min(5).max(2000).required(),
  status: Joi.string().valid('pending', 'approved').default('pending')
});

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
  validatePost: validate(postSchema),
  validateComment: validate(commentSchema)
};