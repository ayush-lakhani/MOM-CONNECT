const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/products', auth, createProduct);
router.get('/products', getProducts);

module.exports = router;
