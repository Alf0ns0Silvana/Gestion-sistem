const mongoose = require('mongoose');

const { Schema } = mongoose; 

const clientSchema = new Schema ({
    email: String,
    name: String,
    lastname: String,
    contact: Number,
    details: String,
    role: String
}, {
    timestamps: true
})

module.exports = mongoose.model( 'clientSchema', clientSchema);