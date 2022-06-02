const jwt=require("jsonwebtoken");
const mongoose = require('mongoose')
const userModel = require("../model/userModel");

const authentication = async function (req, res, next) {
    try {
      const token = req.header("Authorization");
  
      if (!token) {
        return res
          .status(400)
          .send({ status: false, message: "Please pass token" });
      }
  
      let splitToken = token.split(" ");
  
  
      //decode token
      try {
        const decodedToken = jwt.verify(splitToken[1], "productmanagment-26", {
          ignoreExpiration: true,
        });
  
        if (Date.now() > decodedToken.exp * 1000) {
          return res
            .status(401)
            .send({ status: false, message: "session expired" });
        }
  
        req.userId = decodedToken.userId;
      } catch (error) {
        return res
          .status(401)
          .send({ status: false, message: "Authentication failed" });
      }
      console.log("authentication successful");
      next();
      // });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };
  
  //Authorization
  const authorization = async function (req, res, next) {
    try {
      const _id = req.params.userId;
  
      if (!_id) return res.status(400).send({ status: false, message: "userId is required" })
  
      //id format validation
      if (_id) {
        if (mongoose.Types.ObjectId.isValid(_id) == false) {
          return res
            .status(400)
            .send({ status: false, message: "Invalid userId" });
        }
      }
  
      const user = await userModel.findById({ _id });
  
      //no user found
      if (!user) {
        return res
          .status(404)
          .send({ status: false, message: "user not found" });
      }
  
      if (req.userId != _id) {
        return res
          .status(401)
          .send({ status: false, message: "Not authorised" });
      }
  
      console.log("authorization successful");
  
      next();
  
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };
  
  module.exports = { authentication, authorization };