const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({

    fname: {type: String, required:"fname is required"},
    lname: {type: String, required:"lname is required"},
    email: {type: String, required:"email is required",  unique:true},  //valid email
    profileImage: {type: String }, // s3 link
    phone: {type: String, required:"phone is required",  unique:true },// valid Indian mobile number
    password: {type: String, required:"password is required"}, //minLen 8, maxLen 15}, // encrypted password
    address: {
      shipping: {
        street: {type: String },
        city: {type: String},
        pincode: {type: String}
      },
      billing: {
        street: {type: String},
        city: {type: String},
        pincode: {type: Number}
}}},
  {timestamps: true });

  module.exports =
  mongoose.models.User || mongoose.model('User', userSchema);
