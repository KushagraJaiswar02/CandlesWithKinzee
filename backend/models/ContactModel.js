const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: "Let's Connect" },
        description: { type: String, default: "Have a question about our candles, custom orders, or collaborations? We'd love to hear from you." },
        instagramCTAtext: { type: String, default: "Message us on Instagram" },
        instagramLink: { type: String, default: "https://instagram.com/candlewithkinzee" }
    },
    instagramSection: {
        handle: { type: String, default: "@candlewithkinzee" },
        link: { type: String, default: "https://instagram.com/candlewithkinzee" },
        description: { type: String, default: "DM us on Instagram for quick replies, custom orders, and updates on new collections." }
    },
    contactOptions: {
        email: { type: String, default: "hello@candlewithkinzee.com" },
        phone: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
        businessHours: { type: String, default: "Mon-Fri: 9AM - 6PM" }
    },
    contactForm: {
        enabled: { type: Boolean, default: true },
        recipientEmail: { type: String, default: "hello@candlewithkinzee.com" }
    },
    socialLinks: {
        instagram: { type: String, default: "https://instagram.com/candlewithkinzee" },
        pinterest: { type: String, default: "" },
        facebook: { type: String, default: "" },
        youtube: { type: String, default: "" }
    },
    faq: [{
        question: { type: String },
        answer: { type: String }
    }]
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
