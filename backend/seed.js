const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/momconnect')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const seedProducts = async () => {
  try {
    // Find a user to assign products to, or create one
    let seller = await User.findOne({ email: 'priya@example.com' });
    if (!seller) {
        seller = await User.create({
            name: 'Priya Sharma',
            email: 'priya@example.com',
            password: 'password123',
            phone: '9876543210',
            isCreator: true,
            isVerified: true
        });
        console.log('Created Seed User: Priya');
    }

    const products = [
      {
        name: 'Baby Stroller (Graco)',
        price: 4500,
        description: 'Gently used Graco stroller. Good condition.',
        category: 'Baby Gear',
        images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1000'],
        seller: seller._id,
        isSold: false
      },
      {
        name: 'Wooden Crib',
        price: 8000,
        description: 'Solid wood crib with mattress. Convertible.',
        category: 'Furniture',
        images: ['https://images.unsplash.com/photo-1522771753035-42d655f46450?auto=format&fit=crop&q=80&w=1000'],
        seller: seller._id,
        isSold: false
      },
      {
         name: 'Baby Carriers',
         price: 1200,
         description: 'Ergonomic baby carrier, barely used.',
         category: 'Baby Gear',
         images: ['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80&w=1000'],
         seller: seller._id,
         isSold: false
      }
    ];

    await Product.deleteMany({}); // Clear existing
    await Product.insertMany(products);
    
    console.log('✅ Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedProducts();
