const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Rate Limiting Configuration
// General rate limiter - 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for file uploads - 10 uploads per hour
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "Upload limit reached. Maximum 10 uploads per hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiter to all routes
app.use("/api/", generalLimiter);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: JPEG, PNG, GIF, PDF, DOC, DOCX"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "myapp_db",
  port: process.env.DB_PORT || 5432,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.connect();
    console.log("✅ Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

// Initialize database tables
async function initDatabase() {
  try {
    // Create users table
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      avatar VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create function to update updated_at timestamp
    await pool.query(`CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger for users table
    await pool.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create documents table
    await pool.query(`CREATE TABLE IF NOT EXISTS documents(
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      title VARCHAR(200) NOT NULL,
      filename VARCHAR(255) NOT NULL,
      filepath VARCHAR(500) NOT NULL,
      filesize INTEGER,
      mimetype VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Create products table
    await pool.query(`CREATE TABLE IF NOT EXISTS products(
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock INTEGER DEFAULT 0,
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create trigger for products table
    await pool.query(`DROP TRIGGER IF EXISTS update_products_updated_at ON products;
      CREATE TRIGGER update_products_updated_at
      BEFORE UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log("✅ Database tables initialized");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
  }
}

// Pagination helper function
function getPaginationParams(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

// Routes
// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    features: ["File Upload", "Rate Limiting", "Pagination"],
  });
});

// ==================== USER ROUTES WITH PAGINATION ====================
// Get all users with pagination
app.get("/api/users", async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    // Get total count
    const countResult = await pool.query("SELECT COUNT(*) as total FROM users");
    const total = parseInt(countResult.rows[0].total);

    // Get paginated data
    const result = await pool.query(
      "SELECT id, name, email, avatar, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create user with avatar upload
app.post(
  "/api/users",
  uploadLimiter,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: "Name and email are required",
        });
      }

      const avatar = req.file ? `/uploads/${req.file.filename}` : null;
      const result = await pool.query(
        "INSERT INTO users (name, email, avatar) VALUES ($1, $2, $3) RETURNING id",
        [name, email, avatar]
      );

      res.status(201).json({
        success: true,
        data: {
          id: result.rows[0].id,
          name,
          email,
          avatar,
          message: avatar
            ? "User created with avatar"
            : "User created without avatar",
        },
      });
    } catch (error) {
      if (error.code === "23505") {
        // PostgreSQL unique violation error code
        return res.status(409).json({
          success: false,
          error: "Email already exists",
        });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// update user avatar
app.put(
  "/api/users/:id/avatar",
  uploadLimiter,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const userId = req.params.id;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      // Get old avatar to delete
      const userResult = await pool.query(
        "SELECT avatar FROM users WHERE id = $1",
        [userId]
      );
      if (userResult.rows.length > 0 && userResult.rows[0].avatar) {
        const oldAvatarPath = `.${userResult.rows[0].avatar}`;
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      const avatar = `/uploads/${req.file.filename}`;
      const result = await pool.query(
        "UPDATE users SET avatar = $1 WHERE id = $2",
        [avatar, userId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Avatar updated successfully",
        avatar,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// ==================== DOCUMENT ROUTES WITH FILE UPLOAD ====================
// Upload document for a user
app.post(
  "/api/documents",
  uploadLimiter,
  upload.single("document"),
  async (req, res) => {
    try {
      const { user_id, title } = req.body;

      if (!user_id || !title || !req.file) {
        return res.status(400).json({
          success: false,
          error: "user_id, title, and document file are required",
        });
      }

      const result = await pool.query(
        "INSERT INTO documents (user_id, title, filename, filepath, filesize, mimetype) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [
          user_id,
          title,
          req.file.filename,
          `/uploads/${req.file.filename}`,
          req.file.size,
          req.file.mimetype,
        ]
      );

      res.status(201).json({
        success: true,
        data: {
          id: result.rows[0].id,
          user_id,
          title,
          filename: req.file.filename,
          filepath: `/uploads/${req.file.filename}`,
          filesize: req.file.size,
          mimetype: req.file.mimetype,
        },
        message: "Document uploaded successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Get all documents with pagination
app.get("/api/documents", async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { user_id } = req.query;

    let query = "SELECT * FROM documents";
    let countQuery = "SELECT COUNT(*) as total FROM documents";
    const params = [];
    let paramCount = 0;

    if (user_id) {
      paramCount++;
      query += ` WHERE user_id = $${paramCount}`;
      countQuery += ` WHERE user_id = $${paramCount}`;
      params.push(user_id);
    }

    paramCount++;
    query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(limit, offset);

    const countResult = await pool.query(countQuery, user_id ? [user_id] : []);
    const total = parseInt(countResult.rows[0].total);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete document
app.delete("/api/documents/:id", async (req, res) => {
  try {
    const documentId = req.params.id;
    const result = await pool.query(
      "SELECT filepath FROM documents WHERE id = $1",
      [documentId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Document not found" });
    }

    const filepath = `.${result.rows[0].filepath}`;
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await pool.query("DELETE FROM documents WHERE id = $1", [documentId]);

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PRODUCT ROUTES WITH PAGINATION ====================
// Get all products with pagination and filtering
app.get("/api/products", async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { category, minPrice, maxPrice, search } = req.query;

    let query = "SELECT * FROM products WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1";
    const params = [];
    const countParams = [];
    let paramCount = 0;
    let countParamCount = 0;

    if (category) {
      paramCount++;
      countParamCount++;
      query += ` AND category = $${paramCount}`;
      countQuery += ` AND category = $${countParamCount}`;
      params.push(category);
      countParams.push(category);
    }

    if (minPrice) {
      paramCount++;
      countParamCount++;
      query += ` AND price >= $${paramCount}`;
      countQuery += ` AND price >= $${countParamCount}`;
      params.push(parseFloat(minPrice));
      countParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      countParamCount++;
      query += ` AND price <= $${paramCount}`;
      countQuery += ` AND price <= $${countParamCount}`;
      params.push(parseFloat(maxPrice));
      countParams.push(parseFloat(maxPrice));
    }

    if (search) {
      paramCount++;
      countParamCount++;
      const searchTerm = `%${search}%`;
      query += ` AND (name LIKE $${paramCount} OR description LIKE $${
        paramCount + 1
      })`;
      countQuery += ` AND (name LIKE $${countParamCount} OR description LIKE $${
        countParamCount + 1
      })`;
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
      paramCount++;
      countParamCount++;
    }

    paramCount++;
    query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(limit, offset);

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      filters: { category, minPrice, maxPrice, search },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// create product with image upload
app.post(
  "/api/products",
  uploadLimiter,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, stock, category } = req.body;

      if (!name || !price) {
        return res.status(400).json({
          success: false,
          error: "Name and price are required",
        });
      }

      const image = req.file ? `/uploads/${req.file.filename}` : null;
      const result = await pool.query(
        "INSERT INTO products (name, description, price, stock, image, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [
          name,
          description,
          parseFloat(price),
          parseInt(stock) || 0,
          image,
          category,
        ]
      );

      res.status(201).json({
        success: true,
        data: {
          id: result.rows[0].id,
          name,
          description,
          price,
          stock,
          image,
          category,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// update product with image upload
app.put(
  "/api/products/:id",
  uploadLimiter,
  upload.single("image"),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, description, price, stock, category } = req.body;

      if (!name || !price) {
        return res.status(400).json({
          success: false,
          error: "Name and price are required",
        });
      }

      const productResult = await pool.query(
        "SELECT image FROM products WHERE id = $1",
        [productId]
      );
      if (productResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      if (productResult.rows[0].image) {
        const imagePath = `.${productResult.rows[0].image}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      const image = req.file
        ? `/uploads/${req.file.filename}`
        : productResult.rows[0].image;

      const result = await pool.query(
        "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image = $5, category = $6 WHERE id = $7 RETURNING id",
        [
          name,
          description,
          parseFloat(price),
          parseInt(stock) || 0,
          image,
          category,
          productId,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      res.json({
        success: true,
        data: {
          id: result.rows[0].id,
          name,
          description,
          price,
          stock,
          image,
          category,
        },
        message: "Product updated successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// ==================== DELETE PRODUCT ====================
app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await pool.query("DELETE FROM products WHERE id = $1", [
      productId,
    ]);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || "Something went wrong!",
  });
});

// Start server
async function startServer() {
  await testConnection();
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`\n📚 API Features Demonstration:`);
    console.log(`\n🔒 RATE LIMITING:`);
    console.log(`   - General API: 100 requests per 15 minutes`);
    console.log(`   - File Uploads: 10 uploads per hour`);
    console.log(`\n📄 PAGINATION:`);
    console.log(`   - Add ?page=1&limit=10 to list endpoints`);
    console.log(`   - Includes metadata: total, totalPages, hasNext, hasPrev`);
    console.log(`\n📤 FILE UPLOAD:`);
    console.log(`   - Max file size: 5MB`);
    console.log(`   - Allowed types: JPEG, PNG, GIF, PDF, DOC, DOCX`);
    console.log(`   - Files stored in ./uploads directory`);
    console.log(`\n🔗 API Endpoints:`);
    console.log(`   GET    /api/health`);
    console.log(`   GET    /api/users?page=1&limit=10`);
    console.log(`   POST   /api/users (with avatar file)`);
    console.log(`   PUT    /api/users/:id/avatar (with avatar file)`);
    console.log(`   GET    /api/documents?page=1&limit=10&user_id=1`);
    console.log(`   POST   /api/documents (with document file)`);
    console.log(`   DELETE /api/documents/:id`);
    console.log(`   GET    /api/products?page=1&limit=10&category=electronics`);
    console.log(`   POST   /api/products (with image file)`);
    console.log(`   PUT    /api/products/:id (with image file)`);
  });
}

startServer();
