const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const { validateComment } = require('../middleware/validate');

router.get('/', commentController.getCommentsByPost);
router.get('/:commentId', commentController.getCommentById);
router.post('/', validateComment, commentController.createComment);
router.put('/:commentId', validateComment, commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;