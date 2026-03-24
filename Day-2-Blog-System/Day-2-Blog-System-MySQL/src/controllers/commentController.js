const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const { asyncHandler } = require('../middleware/errorHandler');

function toCommentResponse(row) {
  if (!row) return null;
  return {
    id: row.id,
    postId: row.post_id,
    authorName: row.author_name,
    email: row.email,
    content: row.content,
    status: row.status,
    createdAt: row.created_at
  };
}

async function ensurePostExists(postId) {
  const post = await Post.findById(postId);
  if (!post) {
    const err = new Error('Post not found');
    err.status = 404;
    throw err;
  }
}

exports.getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  await ensurePostExists(postId);

  const { page = 1, limit = 10, status } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const filters = {};
  if (status) filters.status = status;

  const [comments, total] = await Promise.all([
    Comment.findByPostId(postId, { page: pageNum, limit: limitNum }),
    Comment.countByPostId(postId, filters)
  ]);

  res.json({
    success: true,
    data: comments.map(toCommentResponse),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

exports.getCommentById = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  await ensurePostExists(postId);

  const comment = await Comment.findById(commentId, postId);
  if (!comment) {
    const err = new Error('Comment not found');
    err.status = 404;
    return next(err);
  }
  res.json({ success: true, data: toCommentResponse(comment) });
});

exports.createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  await ensurePostExists(postId);

  const id = await Comment.create(postId, req.body);
  const comment = await Comment.findById(id, postId);
  res.status(201).json({ success: true, data: toCommentResponse(comment) });
});

exports.updateComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  await ensurePostExists(postId);

  const comment = await Comment.findById(commentId, postId);
  if (!comment) {
    const err = new Error('Comment not found');
    err.status = 404;
    return next(err);
  }
  await Comment.update(commentId, postId, req.body);
  const updated = await Comment.findById(commentId, postId);
  res.json({ success: true, data: toCommentResponse(updated) });
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  await ensurePostExists(postId);

  const comment = await Comment.findById(commentId, postId);
  if (!comment) {
    const err = new Error('Comment not found');
    err.status = 404;
    return next(err);
  }
  await Comment.delete(commentId, postId);
  res.json({ success: true, message: 'Comment deleted successfully' });
});