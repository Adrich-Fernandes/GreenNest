const express = require("express");
const router = express.Router();
const { createProduct, updateProduct, getAllProducts, deleteProduct, getProductById } = require("../Controller/productController");

router.get("/allProducts", getAllProducts);
router.get("/product/:id", getProductById);
router.post("/insertProduct", createProduct);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;