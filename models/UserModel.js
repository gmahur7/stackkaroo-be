const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: 'client-admin'
    }
},{
    timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;