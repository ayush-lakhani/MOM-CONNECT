const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const { redisClient, subClient } = require('./src/config/redis');
const rateLimiterMiddleware = require('./src/middleware/rate-limit');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const postRoutes = require('./src/routes/posts');
const productRoutes = require('./src/routes/products');
const dashboardRoutes = require('./src/routes/dashboard');
const chatRoutes = require('./src/routes/chat');
const uploadRoutes = require('./src/routes/upload');
const paymentRoutes = require('./src/routes/payments');

const app = express();
const server = http.createServer(app);

// Security & Performance Middleware
app.use(helmet());
app.use(compression());
app.use(rateLimiterMiddleware);
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body limit for security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static uploads folder (Consider moving to S3/CDN for production)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/momconnect')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.io Setup
let ioOptions = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
};

const { isRedisConnected } = require('./src/config/redis');
if (isRedisConnected()) {
    ioOptions.adapter = createAdapter(redisClient, subClient);
    console.log('🚀 Socket.io using Redis Adapter');
} else {
    console.log('🐌 Socket.io using Default Adapter (No Redis)');
}

const io = new Server(server, ioOptions);

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/community', postRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

// PM2 clustering is handled by PM2 itself via ecosystem.config.js usually, 
// but for a single file entry, checking for cluster mode is good practice if coding manually.
// However, standard Express practice with PM2 is just to export/listen and let PM2 manage instances.
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
