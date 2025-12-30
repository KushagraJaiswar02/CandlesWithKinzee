const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by seeder or model middleware (need to handle this)
        isAdmin: true
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        isAdmin: false
    }
];

module.exports = users;
