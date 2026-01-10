const express = require("express");
const mongoose = require("mongoose");
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
  console.log("Uploads directory created successfully");
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

// ==================== MONGOOSE SCHEMAS ====================
// User Schema
// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Document Schema
const documentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    filename: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: true,
    },
    filesize: {
      type: Number,
    },
    mimetype: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Create Models
const User = mongoose.model("User", userSchema);
const Document = mongoose.model("Document", documentSchema);
const Product = mongoose.model("Product", productSchema);

// ==================== DATABASE CONNECTION ====================
// Test database connection
async function testConnection() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/myapp_db"
      // Note: useNewUrlParser and useUnifiedTopology are deprecated in Mongoose 6+
      // They are no longer needed and are ignored if provided
    );
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

// Initialize database (MongoDB creates collections automatically, but we can add indexes)
async function initDatabase() {
  try {
    // Create indexes for better performance
    await User.createIndexes();
    await Document.createIndexes();
    await Product.createIndexes();

    // Create index on user_id for faster queries
    await Document.collection.createIndex({ user_id: 1 });

    // Create index on email for faster lookups
    await User.collection.createIndex({ email: 1 }, { unique: true });

    console.log("✅ Database indexes initialized");
  } catch (error) {
    console.log("❌ Database initialization failed:", error.message);
  }
}

// ==================== DATABASE UTILITY FUNCTIONS ====================
// List all databases
async function listDatabases() {
  try {
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.listDatabases();
    return result.databases.map((db) => ({
      name: db.name,
      sizeOnDisk: db.sizeOnDisk,
      empty: db.empty,
    }));
  } catch (error) {
    throw new Error(`Failed to list databases: ${error.message}`);
  }
}

// Check if a database exists
async function databaseExists(dbName) {
  try {
    const databases = await listDatabases();
    return databases.some((db) => db.name === dbName);
  } catch (error) {
    throw new Error(`Failed to check database existence: ${error.message}`);
  }
}

// Get current database name
function getCurrentDatabase() {
  return mongoose.connection.db.databaseName;
}

// Get database stats
async function getDatabaseStats(dbName = null) {
  try {
    const targetDb = dbName
      ? mongoose.connection.client.db(dbName)
      : mongoose.connection.db;
    const stats = await targetDb.stats();
    return {
      database: stats.db,
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      objects: stats.objects,
    };
  } catch (error) {
    throw new Error(`Failed to get database stats: ${error.message}`);
  }
}

// Note: In MongoDB, databases are created automatically when you first write data to them.
// To "create" a database, simply connect to it and insert data:
// await mongoose.connect('mongodb://localhost:27017/new_database_name');
// Then insert a document into any collection.

// Pagination helper function
function getPaginationParams(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Routes
// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    features: ["File Upload", "Rate Limiting", "Pagination", "Authentication"],
  });
});

// ==================== DATABASE MANAGEMENT ROUTES ====================
// List all databases
app.get("/api/databases", async (req, res) => {
  try {
    const databases = await listDatabases();
    res.json({
      success: true,
      data: databases,
      currentDatabase: getCurrentDatabase(),
      total: databases.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check if a specific database exists
app.get("/api/databases/:dbName/exists", async (req, res) => {
  try {
    const dbName = req.params.dbName;
    const exists = await databaseExists(dbName);
    res.json({
      success: true,
      database: dbName,
      exists: exists,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current database info
app.get("/api/database/current", async (req, res) => {
  try {
    const dbName = getCurrentDatabase();
    const stats = await getDatabaseStats();
    res.json({
      success: true,
      database: dbName,
      stats: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get database stats for a specific database
app.get("/api/databases/:dbName/stats", async (req, res) => {
  try {
    const dbName = req.params.dbName;
    const stats = await getDatabaseStats(dbName);
    res.json({
      success: true,
      database: dbName,
      stats: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== USER ROUTES WITH PAGINATION ====================
// Get all users with pagination
app.get("/api/users", async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    // Get total count and paginated data
    const [total, users] = await Promise.all([
      User.countDocuments(),
      User.find()
        .select("name email avatar createdAt")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
    ]);

    res.json({
      success: true,
      data: users,
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
      const user = new User({
        name,
        email,
        avatar,
      });

      const savedUser = await user.save();

      res.status(201).json({
        success: true,
        data: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          avatar: savedUser.avatar,
          message: avatar
            ? "User created with avatar"
            : "User created without avatar",
        },
      });
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
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
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      if (user.avatar) {
        const oldAvatarPath = `.${user.avatar}`;
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      const avatar = `/uploads/${req.file.filename}`;
      user.avatar = avatar;
      await user.save();

      res.json({
        success: true,
        message: "Avatar updated successfully",
        avatar,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
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

      // Verify user exists
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const document = new Document({
        user_id,
        title,
        filename: req.file.filename,
        filepath: `/uploads/${req.file.filename}`,
        filesize: req.file.size,
        mimetype: req.file.mimetype,
      });

      const savedDocument = await document.save();

      res.status(201).json({
        success: true,
        data: {
          id: savedDocument._id,
          user_id: savedDocument.user_id,
          title: savedDocument.title,
          filename: savedDocument.filename,
          filepath: savedDocument.filepath,
          filesize: savedDocument.filesize,
          mimetype: savedDocument.mimetype,
        },
        message: "Document uploaded successfully",
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          error: "Invalid user_id",
        });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Get all documents with pagination
app.get("/api/documents", async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { user_id } = req.query;

    // Build query
    const query = user_id ? { user_id } : {};

    // Get total count and paginated data
    const [total, documents] = await Promise.all([
      Document.countDocuments(query),
      Document.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
    ]);

    res.json({
      success: true,
      data: documents,
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
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid user_id",
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete document
app.delete("/api/documents/:id", async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await Document.findById(documentId);

    if (!document) {
      return res
        .status(404)
        .json({ success: false, error: "Document not found" });
    }

    const filepath = `.${document.filepath}`;
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await Document.findByIdAndDelete(documentId);

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PRODUCT ROUTES WITH PAGINATION ====================
// Get all products with pagination and filtering
app.get("/api/products", async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { category, minPrice, maxPrice, search } = req.query;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count and paginated data
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
    ]);

    res.json({
      success: true,
      data: products,
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
      const product = new Product({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        image,
        category,
      });

      const savedProduct = await product.save();

      res.status(201).json({
        success: true,
        data: {
          id: savedProduct._id,
          name: savedProduct.name,
          description: savedProduct.description,
          price: savedProduct.price,
          stock: savedProduct.stock,
          image: savedProduct.image,
          category: savedProduct.category,
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

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      // Delete old image if new one is uploaded
      if (req.file && product.image) {
        const imagePath = `.${product.image}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Update product fields
      product.name = name;
      product.description = description;
      product.price = parseFloat(price);
      product.stock = parseInt(stock) || 0;
      product.category = category;
      if (req.file) {
        product.image = `/uploads/${req.file.filename}`;
      }

      const updatedProduct = await product.save();

      res.json({
        success: true,
        data: {
          id: updatedProduct._id,
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          image: updatedProduct.image,
          category: updatedProduct.category,
        },
        message: "Product updated successfully",
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

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
    console.log(`   GET    /api/databases (list all databases)`);
    console.log(`   GET    /api/databases/:dbName/exists (check if database exists)`);
    console.log(`   GET    /api/database/current (get current database info)`);
    console.log(`   GET    /api/databases/:dbName/stats (get database statistics)`);
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
