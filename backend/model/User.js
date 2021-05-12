const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    username: { type: String, trim: true, unique: true },
    email: { type: String, trim: true },
    phone: { type: String },
    intl: { type: String },
    password: { type: String, minlength: 8, select: false },
    dob: { type: String },
    active: { type: Boolean, default: false },
    tokens: { type: Array, default: [], select: false },
    profilePhoto: { type: Object, default: { public_id: '', url: "https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png" } },
    coverPhoto: { type: Object, default: { public_id: '', url: '' } },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
    retweets: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    role: { type: String, default: "user" },
    registerToken: String,
    registerTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true })

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create register token
UserSchema.methods.getRegisterToken = function () {
    const registerToken = Math.floor(100000 + Math.random() * 900000);

    this.registerToken = registerToken

    // Set expire to 120 mins
    this.registerTokenExpire = Date.now() + 120 * 60 * 1000;

    return registerToken;
};

// Create password reset token
UserSchema.methods.getResetPasswordToken = function () {
    const passwordResetToken = crypto.randomBytes(4).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(passwordResetToken).digest('hex');

    // Set expire to 120 mins
    this.resetPasswordExpire = Date.now() + 120 * 60 * 1000;

    return passwordResetToken;
};



const User = mongoose.model('User', UserSchema);

module.exports = User