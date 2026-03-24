const db = require('../config/database');

class Post {
  static async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = pagination;
    const { status } = filters;

    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM posts WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    const validSortFields = ['title', 'created_at', 'updated_at', 'status'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async count(filters = {}) {
    const { status } = filters;
    let query = 'SELECT COUNT(*) as total FROM posts WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    const [rows] = await db.query(query, params);
    return rows[0].total;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByIdWithComments(id) {
    const [rows] = await db.query(
      `SELECT p.*, c.id as comment_id, c.author_name as comment_author_name, c.email as comment_email,
       c.content as comment_content, c.status as comment_status, c.created_at as comment_created_at
       FROM posts p
       LEFT JOIN comments c ON p.id = c.post_id
       WHERE p.id = ?
       ORDER BY c.created_at DESC`,
      [id]
    );
    return rows;
  }

  static async create(data) {
    const { title, slug, content, excerpt, authorName, status = 'draft' } = data;
    const [result] = await db.query(
      `INSERT INTO posts (title, slug, content, excerpt, author_name, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, slug, content, excerpt || null, authorName, status]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { title, slug, content, excerpt, authorName, status } = data;
    const [result] = await db.query(
      `UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, author_name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, slug, content, excerpt || null, authorName, status, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async slugExists(slug, excludeId = null) {
    let query = 'SELECT id FROM posts WHERE slug = ?';
    const params = [slug];
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows.length > 0;
  }
}

module.exports = Post;