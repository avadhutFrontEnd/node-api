const db = require("../config/database");

class Product {
  // Get all products with pagination and filters
  static async findAll(filters = {}, pagination = {}) {
    const {
      page = 1,
      limit = 10,
      sort = "created_at",
      order = "DESC",
    } = pagination;
    const { category, minPrice, maxPrice, inStock, search } = filters;

    const offset = (page - 1) * limit;

    let query = "SELECT * FROM products WHERE is_active = true";
    const params = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (minPrice !== undefined) {
      query += " AND price >= ?";
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }

    if (inStock === "true") {
      query += " AND stock > 0";
    } else if (inStock === "false") {
      query += " AND stock = 0";
    }

    if (search) {
      query += " AND (name LIKE ? or description LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Sorting
    const validSortFields = ["name", "price", "created_at", "stock"];
    const sortField = validSortFields.includes(sort) ? sort : "created_at";
    const sortOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Pagination
    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Get total count for pagination
  static async count(filters = {}) {
    const { category, minPrice, maxPrice, inStock, search } = filters;

    let query = "SELECT COUNT(*) as total FROM products WHERE is_active = TRUE";
    const params = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (minPrice !== undefined) {
      query += " AND price >= ?";
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }

    if (inStock === "true") {
      query += " AND stock > 0";
    } else if (inStock === "false") {
      query += " AND stock = 0";
    }

    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    const [rows] = await db.query(query, params);
    return rows[0].total;
  }

  // Get product by ID
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ? AND is_active = TRUE",
      [id],
    );
    return rows[0];
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
      isActive = true,
    } = productData;

    const [result] = db.query(
      "INSERT INTO products (name, description, price, stock, category, sku, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, stock, category, sku, imageUrl, isActive],
    );

    return result.insertId;
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
      isActive,
    } = productData;

    const [result] = await db.query(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, stock = ?, category = ?, 
           sku = ?, image_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, price, stock, category, sku, imageUrl, isActive, id],
    );

    return result.affectedRows;
  }

  // Partial update
  static async partialUpdate(id, productData) {
    const fields = [];
    const values = [];

    Object.keys(productData).forEach((key) => {
      if (productData[key] !== undefined) {
        const dbKey =
          key === "imageUrl"
            ? "image_url"
            : key === "isActive"
              ? "is_active"
              : key;
        fields.push(`${dbKey} = ?`);
        values.push(productData[key]);
      }
    });

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);

    const query = `UPDATE products SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    const [result] = await db.query(query, values);
    return result.affectedRows;
  }

  // Soft delete
  static async softDelete(id) {
    const [result] = await db.query(
      "UPDATE products SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }

  // Check if SKU exists
  static async skuExists(sku, excludeId = null) {
    let query = "SELECT id FROM products WHERE sku = ?";
    const params = [sku];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0;
  }
}

module.exports = Product;
