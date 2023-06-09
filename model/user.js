const { Schema, model } = require('mongoose');
const { Gender } = require('../config/constant');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;

const userSchema = new Schema(
    {
        name: {
            type: String,
            default: 'Guest',
        },
        email: {
            type: String,
            required: [true, 'Email for contact is required'],
            unique: true,
            validate(value) {
                const re = /\S+@\S+.\S+/;
                return re.test(String(value).toLowerCase());
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        gender: {
            type: String,
            enum: {
                values: [Gender.MALE, Gender.FEMALE, Gender.NONE],
                message: 'Gender not allowed',
            },
            default: Gender.NONE,
        },
        subscription: {
            type: String,
            enum: ['starter', 'pro', 'business'],
            default: 'starter',
        },
        token: {
            type: String,
            default: null,
        },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                return ret;
            },
        },
        toObject: { virtuals: true },
    },
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});


userSchema.methods.isValidPassword = async function (password) {

    return bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
