const Product = require("../models/productModel");
const { asyncHandler } = require("../middleware/errorHandler");

// Get all products with pagination and filters
exports.getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    inStock,
    search,
    sort = "created_at",
    order = "DESC",
  } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

  // Build filters
  const filters = {};
  if (category) filters.category = category;
  if (minPrice) filters.minPrice = parseFloat(minPrice);
  if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
  if (inStock) filters.inStock = inStock;
  if (search) filters.search = search;

  const pagination = {
    page: pageNum,
    limit: limitNum,
    sort,
    order: order.toUpperCase(),
  };

  // Get products and total count
  const [products, total] = await Promise.all([
    Product.findAll(filters, pagination),
    Product.count(filters),
  ]);

  const pages = Math.ceil(total / limitNum);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages,
    },
  });
});

// Get single product by ID
exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: "Product not found",
    });
  }

  res.json({
    success: true,
    data: product,
  });
});

// Create new product
exports.createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;

  // Check if SKU already exists
  const skuExists = await Product.skuExists(productData.sku);
  if (skuExists) {
    return res.status(409).json({
      success: false,
      error: "SKU already exists",
      message: "A product with this SKU already exists",
    });
  }

  const productId = await Product.create(productData);
  const product = await Product.findById(productId);

  res.status(201).json({
    success: true,
    data: product,
  });
});

// Update entire product
exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  // Check if SKU exists for another product
  const skuExists = await Product.skuExists(productData.sku, id);
  if (skuExists) {
    return res.status(409).json({
      success: false,
      error: "SKU already exists",
      message: "A product with this SKU already exists",
    });
  }

  const affectedRows = await Product.update(id, productData);

  if (affectedRows === 0) {
    return res.status(404).json({
      success: false,
      error: "Product not found",
    });
  }

  const product = await Product.findById(id);
  res.json({
    success: true,
    data: product,
  });
});

// Partially update product
exports.patchProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  // Check SKU if provided
  if (productData.sku) {
    const skuExists = await Product.skuExists(productData.sku, id);
    if (skuExists) {
      return res.status(409).json({
        success: false,
        error: "SKU already exists",
      });
    }
  }

  const affectedRows = await Product.partialUpdate(id, productData);

  if (affectedRows === 0) {
    return res.status(404).json({
      success: false,
      error: "Product not found",
    });
  }

  const product = await Product.findById(id);
  res.json({
    success: true,
    data: product,
  });
});

// Delete product (soft delete)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const affectedRows = await Product.softDelete(id);

  if (affectedRows === 0) {
    return res.status(404).json({
      success: false,
      error: "Product not found",
    });
  }

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
});
