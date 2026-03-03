const LandingConfig = require('../models/LandingConfigModel');

// @desc    Get landing page config (creates default if none exists)
// @route   GET /api/landing-config
// @access  Public
const getLandingConfig = async (req, res) => {
    try {
        // findOneOrCreate pattern — always returns the singleton doc
        let config = await LandingConfig.findOne();
        if (!config) {
            config = await LandingConfig.create({});
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch landing config' });
    }
};

// @desc    Update landing page config
// @route   PUT /api/landing-config
// @access  Private/Admin
const updateLandingConfig = async (req, res) => {
    try {
        const {
            heroTitle,
            heroSubtitle,
            heroImage,
            festiveModeActive,
            discountBannerActive,
            discountBannerText,
            featuredCollection,
        } = req.body;

        // findOneAndUpdate with upsert — creates if doesn't exist
        const config = await LandingConfig.findOneAndUpdate(
            {},
            {
                ...(heroTitle !== undefined && { heroTitle }),
                ...(heroSubtitle !== undefined && { heroSubtitle }),
                ...(heroImage !== undefined && { heroImage }),
                ...(festiveModeActive !== undefined && { festiveModeActive }),
                ...(discountBannerActive !== undefined && { discountBannerActive }),
                ...(discountBannerText !== undefined && { discountBannerText }),
                ...(featuredCollection !== undefined && { featuredCollection }),
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.json(config);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update landing config' });
    }
};

module.exports = { getLandingConfig, updateLandingConfig };
