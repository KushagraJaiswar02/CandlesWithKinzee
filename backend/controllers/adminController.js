const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    const totalOrders = await Order.countDocuments(); // Count all attempts (or switch to isPaid: true if desired)
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 5 } });

    // Use aggregation for revenue — avoids fetching all orders into memory (N+1 fix)
    const [revenueResult] = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult?.total || 0;

    res.json({
        totalOrders,
        totalUsers,
        totalProducts,
        lowStockProducts,
        totalRevenue
    });
};

module.exports = { getAdminStats };
