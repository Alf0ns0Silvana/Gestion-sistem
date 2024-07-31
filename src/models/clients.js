const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose; 

const clientSchema = new Schema ({
    email: String,
    name: String,
    lastname: String,
    contact: Number,
    details: String,
    role: String,
    eventDate:  { type: Date, required: true },
    salonType: { type: String, required: true },
    payments: [{
        date: Date, 
        amountChild: Number,
        amountAdult: Number,
        specificDetails: String
    }]
}, {
    timestamps: true
}); 

clientSchema.plugin(mongoosePaginate);
module.exports = mongoose.model( 'clientSchema', clientSchema);