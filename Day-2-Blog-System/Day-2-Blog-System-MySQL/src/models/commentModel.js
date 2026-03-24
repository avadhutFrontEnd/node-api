const db = require('../config/database');

class Comment {
  static async findByPostId(postId, pagination = {}) {
    const { page = 1, limit = 10, order = 'DESC' } = pagination;
    const offset = (page - 1) * limit;
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const [rows] = await db.query(
      `SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ${sortOrder} LIMIT ? OFFSET ?`,
      [postId, parseInt(limit), offset]
    );
    return rows;
  }

  static async countByPostId(postId, filters = {}) {
    const { status } = filters;
    let query = 'SELECT COUNT(*) as total FROM comments WHERE post_id = ?';
    const params = [postId];
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    const [rows] = await db.query(query, params);
    return rows[0].total;
  }

  static async findById(commentId, postId) {
    const [rows] = await db.query(
      'SELECT * FROM comments WHERE id = ? AND post_id = ?',
      [commentId, postId]
    );
    return rows[0];
  }

  static async create(postId, data) {
    const { authorName, email, content, status = 'pending' } = data;
    const [result] = await db.query(
      `INSERT INTO comments (post_id, author_name, email, content, status)
       VALUES (?, ?, ?, ?, ?)`,
      [postId, authorName, email, content, status]
    );
    return result.insertId;
  }

  static async update(commentId, postId, data) {
    const { authorName, email, content, status } = data;
    const [result] = await db.query(
      `UPDATE comments SET author_name = ?, email = ?, content = ?, status = ? WHERE id = ? AND post_id = ?`,
      [authorName, email, content, status, commentId, postId]
    );
    return result.affectedRows;
  }

  static async delete(commentId, postId) {
    const [result] = await db.query(
      'DELETE FROM comments WHERE id = ? AND post_id = ?',
      [commentId, postId]
    );
    return result.affectedRows;
  }
}

module.exports = Comment;