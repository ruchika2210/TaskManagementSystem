const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6 
    }
}, {
    timestamps: true 
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
