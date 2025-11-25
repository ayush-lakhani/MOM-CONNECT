const express = require('express');
const { getDashboard, verifyUser } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:userId', auth, getDashboard);
router.put('/:userId/verify', auth, verifyUser);

module.exports = router;
