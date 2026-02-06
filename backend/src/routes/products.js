const express = require('express');
const { createProduct, getProducts, getUploadUrls, getMyListings } = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/upload-urls', auth, getUploadUrls);
router.post('/', auth, createProduct);
router.get('/', getProducts); // Public feed
router.get('/my-listings', auth, getMyListings);

module.exports = router;
