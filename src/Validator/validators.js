const mongoose = require('mongoose')

const isValidSize = function (size) {
    const validSize = size.split(",").map(x => x.toUpperCase().trim())
  
    let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
  
    for (let i = 0; i < validSize.length; i++) {
      if (!sizes.includes(validSize[i])) {
        return false
      }
    }
    return validSize
  }
  
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const validString = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidString = function(value){
    if(!/^[A-Za-z ]+$/.test(value)) {return false}
    else return true
}

const isValidEmail = function(value){
    if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value)){return true}
    else return false
}

const isValidPassword = function(value){
    if(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/.test(value)==true) {return true}
    else return false
}

const isValidPhone = function(value){
    if( /^\d{10}$/.test(value)) {return true}
    else return false
}

const validInstallment = function isInteger(value) {
    if(value < 0) return false
     if(value % 1 == 0 ) return true
}
const validQuantity = function isInteger(value) {
    if(value < 1) return false
     if(value % 1 == 0 ) return true
}

const isValidStatus = function(status) {
    return ['pending', 'completed', 'cancelled'].indexOf(status) !== -1
}

const isValidPincode = function(value){
if(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(value)==true) {return true}
}

//const pincodeRegex = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;

// const passwordRegex =
//   /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/;

module.exports = {
    isValid,
    isValidRequestBody,
    isValidObjectId,
    validString,
    isValidString,
    validInstallment,
    validQuantity,
    isValidStatus,
    isValidPincode,
    isValidPassword,
    isValidSize,
    isValidEmail,
    isValidPhone
}