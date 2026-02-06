const Product = require('../models/Product');
const { generatePresignedUrls } = require('../config/s3'); // Import S3 util
const Transaction = require('../models/Transaction');

const getUploadUrls = async (req, res) => {
  try {
    const { count, contentType } = req.body;
    const { signedUrls, publicUrls } = await generatePresignedUrls(count || 1, contentType);
    res.json({ signedUrls, targetUrls: publicUrls });
  } catch (error) {
    console.error('S3 Presign Error:', error);
    res.status(500).json({ message: 'Could not generate upload URLs' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, images, razorpay_payment_id } = req.body;

    // Verify payment if not redundant check
    // In a real app, verify razorpay_payment_id against DB transaction to ensure it's paid
    
    const product = new Product({
      seller: req.user.id,
      name,
      price,
      description,
      category,
      images,
      image: images[0], // Set first image as main
    });

    await product.save();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emit('newListing', await product.populate('seller', 'name profileImage'));
    }

    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: 'Could not create product' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isSold: false }).populate('seller', 'name profileImage').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct, getProducts, getUploadUrls, getMyListings };
