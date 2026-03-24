const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [255, "Name cannot exceed 255 characters"],
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    category: {
      type: String,
      maxlength: [100, "Category cannot exceed 100 characters"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      match: [/^[A-Za-z0-9-]+$/, "SKU must be alphanumeric with hyphens"],
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          return /^https?:\/\/.+/.test(v);
        },
        message: "Image URL must be a valid URL",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Create indexes
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: "text", description: "text" }); // Text search index


// Static method: Find all products with filters and pagination
productSchema.statics.findAll = async function(filters = {}, pagination = {}) {
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = pagination;
  const { category, minPrice, maxPrice, inStock, search } = filters;

  // Build query
  const query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
    if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
  }

  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  } else if (inStock === 'false') {
    query.stock = 0;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Sorting
  const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;
  const sortObj = {};
  sortObj[sort] = sortOrder;

  // Pagination
  const skip = (page - 1) * limit;

  const products = await this.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  return products;
};

// Static method: Count products with filters
productSchema.statics.countProducts = async function(filters = {}) {
  const { category, minPrice, maxPrice, inStock, search } = filters;

  const query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
    if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
  }

  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  } else if (inStock === 'false') {
    query.stock = 0;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  return await this.countDocuments(query);
};

// Static method: Find by ID
productSchema.statics.findById = async function(id) {
  return await this.findOne({ _id: id, isActive: true }).lean();
};

// Static method: Check if SKU exists
productSchema.statics.skuExists = async function(sku, excludeId = null) {
  const query = { sku };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const product = await this.findOne(query);
  return !!product;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
