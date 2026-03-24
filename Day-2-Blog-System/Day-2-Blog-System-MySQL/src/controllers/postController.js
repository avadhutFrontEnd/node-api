const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const { asyncHandler } = require('../middleware/errorHandler');

function toPostResponse(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    authorName: row.author_name,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

exports.getAll = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const filters = {};
  if (status) filters.status = status;

  const [posts, total] = await Promise.all([
    Post.findAll(filters, { page: pageNum, limit: limitNum, sort: 'created_at', order: 'DESC' }),
    Post.count(filters)
  ]);

  res.json({
    success: true,
    data: posts.map(toPostResponse),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

exports.getById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const includeComments = req.query.includeComments === 'true';

  if (includeComments) {
    const rows = await Post.findByIdWithComments(id);
    if (!rows || rows.length === 0) {
      const err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }
    const post = toPostResponse(rows[0]);
    post.comments = rows
      .filter(r => r.comment_id)
      .map(r => ({
        id: r.comment_id,
        authorName: r.comment_author_name,
        content: r.comment_content,
        status: r.comment_status,
        createdAt: r.comment_created_at
      }));
    return res.json({ success: true, data: post });
  }

  const post = await Post.findById(id);
  if (!post) {
    const err = new Error('Post not found');
    err.status = 404;
    return next(err);
  }
  res.json({ success: true, data: toPostResponse(post) });
});

exports.create = asyncHandler(async (req, res) => {
  const data = req.body;
  const slugExists = await Post.slugExists(data.slug);
  if (slugExists) {
    return res.status(409).json({
      success: false,
      error: 'Slug already exists',
      message: 'A post with this slug already exists'
    });
  }
  const id = await Post.create(data);
  const post = await Post.findById(id);
  res.status(201).json({ success: true, data: toPostResponse(post) });
});

exports.update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    const err = new Error('Post not found');
    err.status = 404;
    return next(err);
  }
  const slugExists = await Post.slugExists(req.body.slug, id);
  if (slugExists) {
    return res.status(409).json({
      success: false,
      error: 'Slug already exists'
    });
  }
  await Post.update(id, req.body);
  const updated = await Post.findById(id);
  res.json({ success: true, data: toPostResponse(updated) });
});

exports.delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    const err = new Error('Post not found');
    err.status = 404;
    return next(err);
  }
  await Post.delete(id);
  res.json({ success: true, message: 'Post deleted successfully' });
});