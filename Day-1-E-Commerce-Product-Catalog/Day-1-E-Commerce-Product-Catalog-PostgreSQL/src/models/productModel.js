const db = require('../config/database');

class Product {
  // Get all products with pagination and filters
  static async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = pagination;
    const { category, minPrice, maxPrice, inStock, search } = filters;
    
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM products WHERE is_active = TRUE';
    const params = [];
    let paramCount = 0;

    // Apply filters
    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (minPrice !== undefined) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      params.push(maxPrice);
    }

    if (inStock === 'true') {
      query += ' AND stock > 0';
    } else if (inStock === 'false') {
      query += ' AND stock = 0';
    }

    if (search) {
      paramCount++;
      const searchTerm = `%${search}%`;
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(searchTerm);
    }

    // Sorting
    const validSortFields = ['name', 'price', 'created_at', 'stock'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Pagination
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  // Get total count for pagination
  static async count(filters = {}) {
    const { category, minPrice, maxPrice, inStock, search } = filters;
    
    let query = 'SELECT COUNT(*) as total FROM products WHERE is_active = TRUE';
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (minPrice !== undefined) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      params.push(maxPrice);
    }

    if (inStock === 'true') {
      query += ' AND stock > 0';
    } else if (inStock === 'false') {
      query += ' AND stock = 0';
    }

    if (search) {
      paramCount++;
      const searchTerm = `%${search}%`;
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(searchTerm);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].total);
  }

  // Get product by ID
  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = TRUE',
      [id]
    );
    return result.rows[0];
  }

  // Create product
  static async create(productData) {
    const {
      name,
      description,
      price,
      stock = 0,
      category,
      sku,
      imageUrl,
      isActive = true
    } = productData;

    const result = await db.query(
      `INSERT INTO products (name, description, price, stock, category, sku, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [name, description, price, stock, category, sku, imageUrl, isActive]
    );

    return result.rows[0].id;
  }

  // Update entire product
  static async update(id, productData) {
    const {
      name,
      description,
      price,
      stock,
      category,
      sku,
      imageUrl,
      isActive
    } = productData;

    const result = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock = $4, category = $5, 
           sku = $6, image_url = $7, is_active = $8
       WHERE id = $9
       RETURNING *`,
      [name, description, price, stock, category, sku, imageUrl, isActive, id]
    );

    return result.rowCount;
  }

  // Partial update
  static async partialUpdate(id, productData) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    Object.keys(productData).forEach(key => {
      if (productData[key] !== undefined) {
        paramCount++;
        const dbKey = key === 'imageUrl' ? 'image_url' : 
                     key === 'isActive' ? 'is_active' : key;
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(productData[key]);
      }
    });

    if (fields.length === 0) {
      return 0;
    }

    paramCount++;
    values.push(id);
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await db.query(query, values);
    return result.rowCount;
  }

  // Soft delete
  static async softDelete(id) {
    const result = await db.query(
      'UPDATE products SET is_active = FALSE WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rowCount;
  }

  // Check if SKU exists
  static async skuExists(sku, excludeId = null) {
    let query = 'SELECT id FROM products WHERE sku = $1';
    const params = [sku];

    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }

    const result = await db.query(query, params);
    return result.rows.length > 0;
  }
}

module.exports = Product;