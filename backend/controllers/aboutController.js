const About = require('../models/AboutModel');

// @desc    Get the About Page configuration
// @route   GET /api/about
// @access  Public
const getAboutConfig = async (req, res) => {
    try {
        let aboutConfig = await About.findOne();

        // If it doesn't exist, create a default one
        if (!aboutConfig) {
            aboutConfig = await About.create({});
        }
        res.status(200).json(aboutConfig);
    } catch (error) {
        console.error('Error fetching About config:', error);
        res.status(500).json({ message: 'Server error while fetching About config' });
    }
};

// @desc    Update the About Page configuration
// @route   PUT /api/about
// @access  Private/Admin
const updateAboutConfig = async (req, res) => {
    try {
        let aboutConfig = await About.findOne();

        if (aboutConfig) {
            // Update existing
            aboutConfig.hero = req.body.hero || aboutConfig.hero;
            aboutConfig.story = req.body.story || aboutConfig.story;
            aboutConfig.craftFeatures = req.body.craftFeatures || aboutConfig.craftFeatures;
            aboutConfig.values = req.body.values || aboutConfig.values;
            aboutConfig.founder = req.body.founder || aboutConfig.founder;
            aboutConfig.socialLinks = req.body.socialLinks || aboutConfig.socialLinks;
            aboutConfig.ctaSection = req.body.ctaSection || aboutConfig.ctaSection;

            const updatedConfig = await aboutConfig.save();
            res.status(200).json(updatedConfig);
        } else {
            // Create New
            const newConfig = await About.create(req.body);
            res.status(201).json(newConfig);
        }
    } catch (error) {
        console.error('Error updating About config:', error);
        res.status(500).json({ message: 'Server error while updating About config' });
    }
};

module.exports = {
    getAboutConfig,
    updateAboutConfig
};
