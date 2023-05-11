const {Schema, model} = require('mongoose');
const {ValidInfoContact} = require('../config/constant');

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        age: {
            type: Number,
            min: ValidInfoContact.MIN_AGE,
            max: ValidInfoContact.MAX_AGE,
        },
        email: {
            type: String,
            required: [true, 'Set email for contact'],
        },
        favorite: {
            type: Boolean,
            default: false,
            required: true,
        },
    }
);

contactSchema.path('name').validate(function (value) {
    const re = /[A-Z]\w+/;
    return re.test(String(value));
});

const Contact = model('contact', contactSchema);

module.exports = Contact;
