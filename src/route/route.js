const express = require("express"); //import express
const router = express.Router(); //used express to create route handlers
const {createUser,login,getUserProfile,updateUser} = require("../controller/usercontroller")
const {createProduct,filterProduct,productById,deleteProduct,updateProduct}=require("../controller/productcontroller")
const {createCart, updateCart, getCart, deleteCart} = require("../controller/cartcontroller")
const {createOrder, orderUpdate} = require("../controller/ordercontroller")
const { authentication, authorization }=require("../middleware/middleware")

//user APIs
router.post('/register', createUser)
router.post('/login', login)
router.get('/user/:userId/profile', authentication, authorization , getUserProfile)
router.put("/user/:userId/profile",  authentication, authorization ,updateUser);
//product APIs
router.post("/products", createProduct)
router.get("/products", filterProduct)
router.get("/products/:productId",productById)
router.put("/products/:productId",updateProduct)
router.delete("/products/:productId",deleteProduct)

//cart APIs
router.post("/users/:userId/cart", authentication, authorization , createCart)
router.put("/users/:userId/cart", authentication, authorization , updateCart)
router.get("/users/:userId/cart", authentication, authorization , getCart)
router.delete("/users/:userId/cart", authentication, authorization , deleteCart)

//order APIs
router.post("/users/:userId/orders", authentication, authorization , createOrder)
router.put("/users/:userId/orders" , authentication, authorization  , orderUpdate)





//----------------if api is invalid OR wrong URL-------------------------
router.all("/**", function (req, res) {
    res
      .status(404)
      .send({ status: false, msg: "The api you request is not available" });
  });


//export router
module.exports = router;