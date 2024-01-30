const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // trip: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Trip'
    // },
    itinerary: {
        type: Object,
        required: true
    }
}, {
  // tells mongoose to add and maintain `createdAt` and `updatedAt` fields with
  // datetime timestamps
  timestamps: true
});

module.exports = mongoose.model('Itinerary', itinerarySchema);