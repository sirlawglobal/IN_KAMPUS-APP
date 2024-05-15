const mongoose = require('mongoose');


const AdminSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String ,  required: true},
  datejoined: {type: Date, default: Date.now()},
  
},
{timestamps: true}
)


module.exports = mongoose.model("Admin", AdminSchema);
