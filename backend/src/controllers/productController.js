const Product = require('../models/Product');
const User = require('../models/User');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    
    const newProduct = new Product({
      seller: req.user.id,
      name,
      description,
      price,
      image,
      category,
    });

    const savedProduct = await newProduct.save();

    // Update user's product count
    await User.findByIdAndUpdate(req.user.id, { $inc: { productsCount: 1 } });

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name profileImage')
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
