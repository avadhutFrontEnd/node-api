const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {
  validateCreateProduct,
  validateUpdateProduct,
  validatePatchProduct,
} = require("../middleware/validate");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", validateCreateProduct, productController.createProduct);
router.put("/:id", validateUpdateProduct, productController.updateProduct);
router.patch('/:id', validatePatchProduct, productController.patchProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;