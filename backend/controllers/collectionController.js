const Collection = require('../models/CollectionModel');
const Product = require('../models/ProductModel');

// @desc    Create a collection
// @route   POST /api/collections
// @access  Private/Admin
const createCollection = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            type,
            bannerImage,
            featuredProduct,
            isActive,
            rules,
            productIds,
            seo,
        } = req.body;

        const collectionExists = await Collection.findOne({ slug });

        if (collectionExists) {
            return res.status(400).json({ message: 'Collection slug already exists' });
        }

        const collection = await Collection.create({
            name,
            slug,
            description,
            type,
            bannerImage,
            featuredProduct,
            isActive,
            rules,
            productIds,
            seo,
        });

        res.status(201).json(collection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create collection', error: error.message });
    }
};

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
const getCollections = async (req, res) => {
    try {
        // Find active collections, populate featured product
        const collections = await Collection.find({ isActive: true }).populate(
            'featuredProduct',
            'name image price'
        );
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch collections', error: error.message });
    }
};

// @desc    Get all collections (Admin - includes inactive)
// @route   GET /api/collections/admin
// @access  Private/Admin
const getAdminCollections = async (req, res) => {
    try {
        const collections = await Collection.find({});
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch collections', error: error.message });
    }
};

// @desc    Get collection by slug and resolve products
// @route   GET /api/collections/:slug
// @access  Public
const getCollectionBySlug = async (req, res) => {
    try {
        const collection = await Collection.findOne({ slug: req.params.slug, isActive: true })
            .populate('featuredProduct', 'name image price rating numReviews');

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        let products = [];

        if (collection.type === 'manual') {
            // Populate manually selected products
            products = await Product.find({ _id: { $in: collection.productIds } });
        } else if (collection.type === 'automated' && collection.rules) {
            // Build dynamic query based on rules
            const query = {};

            if (collection.rules.tags && collection.rules.tags.length > 0) {
                // Assuming you use category or a tags array for filtering - adjusting to match your schema
                // If Product model doesn't have 'tags', we'll map this to 'category' for now
                query.category = { $in: collection.rules.tags };
            }

            if (collection.rules.priceRange) {
                if (collection.rules.priceRange.min !== undefined || collection.rules.priceRange.max !== undefined) {
                    query.price = {};
                    if (collection.rules.priceRange.min !== undefined) query.price.$gte = collection.rules.priceRange.min;
                    if (collection.rules.priceRange.max !== undefined) query.price.$lte = collection.rules.priceRange.max;
                }
            }

            if (collection.rules.inStockOnly) {
                query.countInStock = { $gt: 0 };
            }

            // Note: discountOnly logic can be added here if ProductSchema has discount fields

            products = await Product.find(query);
        }

        res.json({
            collection,
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch collection details', error: error.message });
    }
};

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
const updateCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (collection) {
            collection.name = req.body.name || collection.name;
            collection.slug = req.body.slug || collection.slug;
            collection.description = req.body.description !== undefined ? req.body.description : collection.description;
            collection.type = req.body.type || collection.type;
            collection.bannerImage = req.body.bannerImage !== undefined ? req.body.bannerImage : collection.bannerImage;
            collection.featuredProduct = req.body.featuredProduct || collection.featuredProduct;
            collection.isActive = req.body.isActive !== undefined ? req.body.isActive : collection.isActive;
            collection.rules = req.body.rules || collection.rules;
            collection.productIds = req.body.productIds || collection.productIds;
            collection.seo = req.body.seo || collection.seo;

            const updatedCollection = await collection.save();
            res.json(updatedCollection);
        } else {
            res.status(404).json({ message: 'Collection not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update collection', error: error.message });
    }
};

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        // using collection.deleteOne() in newer mongoose
        if (collection) {
            await collection.deleteOne();
            res.json({ message: 'Collection removed' });
        } else {
            res.status(404).json({ message: 'Collection not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete collection', error: error.message });
    }
};

module.exports = {
    createCollection,
    getCollections,
    getAdminCollections,
    getCollectionBySlug,
    updateCollection,
    deleteCollection,
};
