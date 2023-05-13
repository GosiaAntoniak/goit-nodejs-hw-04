const { Schema, model, SchemaTypes } = require('mongoose');
const { ValidInfoContact } = require('../config/constant');
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        age: {
            type: Number,
            min: ValidInfoContact.MIN_AGE,
            max: ValidInfoContact.MAX_AGE,
        },
        email: {
            type: String,
            required: [true, 'Email for contact is required'],
        },
        favorite: {
            type: Boolean,
            default: false,
            required: true,
        },
        owner: {
            type: SchemaTypes.ObjectId,
            ref: 'user',
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

contactSchema.virtual('status').get(function () {
    if (this.age >= 60) {
        return 'old';
    }
    return 'young';
});

contactSchema.path('name').validate(function (value) {
    const re = /[A-Z]\w+/;
    return re.test(String(value));
});

contactSchema.plugin(mongoosePaginate);

const Contact = model('contact', contactSchema);

module.exports = Contact;
