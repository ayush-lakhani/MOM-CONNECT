const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');

let razorpay = null;
const getRazorpay = () => {
    if (razorpay) return razorpay;
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.warn('⚠️ Razorpay keys missing! Payment features will not work.');
        return null;
    }

    try {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        return razorpay;
    } catch (e) {
        console.error('❌ Razorpay Initialization Error:', e.message);
        return null;
    }
};

const createOrder = async (req, res) => {
  try {
    const rp = getRazorpay();
    if (!rp) return res.status(503).json({ message: 'Payment gateway unavailable (Missing Keys)' });

    const { amount, currency = 'INR', description, type, metadata } = req.body;
    
    // Amount in paise
    const options = {
      amount: amount * 100, 
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await rp.orders.create(options);

    const transaction = new Transaction({
      user: req.user.id,
      amount,
      currency,
      type: type || 'DEBIT',
      status: 'PENDING',
      razorpayOrderId: order.id,
      description,
      metadata
    });

    await transaction.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Could not create order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const rp = getRazorpay();
    if (!rp) return res.status(503).json({ message: 'Payment gateway unavailable' });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment Successful
      const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
      if (transaction) {
        transaction.status = 'SUCCESS';
        transaction.razorpayPaymentId = razorpay_payment_id;
        await transaction.save();
        
        // Handle post-payment logic (e.g., activate subscription, boost post)
        if (transaction.metadata && transaction.metadata.plan) {
            // Activate subscription
            await Subscription.create({
                user: transaction.user,
                plan: transaction.metadata.plan,
                startDate: new Date(),
                // Add 30 days for example
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
            });
        }
      }

      res.json({ success: true, message: 'Payment verified' });
    } else {
      // Payment Failed
      const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
      if (transaction) {
        transaction.status = 'FAILED';
        await transaction.save();
      }
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

module.exports = { createOrder, verifyPayment };
