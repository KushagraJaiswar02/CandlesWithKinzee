const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 5 } });

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    res.json({
        totalOrders,
        totalUsers,
        totalProducts,
        lowStockProducts,
        totalRevenue
    });
};

module.exports = { getAdminStats };
