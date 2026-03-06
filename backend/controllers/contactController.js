const Contact = require('../models/ContactModel');

// @desc    Get the Contact Page configuration
// @route   GET /api/contact
// @access  Public
const getContactConfig = async (req, res) => {
    try {
        let contactConfig = await Contact.findOne();

        // If it doesn't exist, create a default one
        if (!contactConfig) {
            contactConfig = await Contact.create({});
        }
        res.status(200).json(contactConfig);
    } catch (error) {
        console.error('Error fetching Contact config:', error);
        res.status(500).json({ message: 'Server error while fetching Contact config' });
    }
};

// @desc    Update the Contact Page configuration
// @route   PUT /api/contact
// @access  Private/Admin
const updateContactConfig = async (req, res) => {
    try {
        let contactConfig = await Contact.findOne();

        if (contactConfig) {
            // Update existing
            contactConfig.hero = req.body.hero || contactConfig.hero;
            contactConfig.instagramSection = req.body.instagramSection || contactConfig.instagramSection;
            contactConfig.contactOptions = req.body.contactOptions || contactConfig.contactOptions;
            contactConfig.contactForm = req.body.contactForm || contactConfig.contactForm;
            contactConfig.socialLinks = req.body.socialLinks || contactConfig.socialLinks;
            contactConfig.faq = req.body.faq || contactConfig.faq;

            const updatedConfig = await contactConfig.save();
            res.status(200).json(updatedConfig);
        } else {
            // Create New
            const newConfig = await Contact.create(req.body);
            res.status(201).json(newConfig);
        }
    } catch (error) {
        console.error('Error updating Contact config:', error);
        res.status(500).json({ message: 'Server error while updating Contact config' });
    }
};

module.exports = {
    getContactConfig,
    updateContactConfig
};
