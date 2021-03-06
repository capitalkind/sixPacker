var mongoose = require('mongoose');


var PackSchema = mongoose.Schema({
  username: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  position: { lat: { type: Number }, lng: { type: Number } },
  brand: { type: String, required: true },
  price: { type: Number, required: true}
}, { timestamps:true });


module.exports = mongoose.model('Pack', PackSchema);
