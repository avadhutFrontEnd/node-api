const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { validatePost } = require('../middleware/validate');

router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.post('/', validatePost, postController.create);
router.put('/:id', validatePost, postController.update);
router.delete('/:id', postController.delete);

module.exports = router;