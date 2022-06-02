const cartModel = require("../model/cartmodel");
const productModel = require("../model/productmodel");
const userModel = require("../model/usermodel");
const validator = require("../Validator/validators");

const createCart = async function (req, res) {
  try {
    const userId = req.params.userId;
    const info = req.body;

    if (!validator.isValidRequestBody(info)) {
      return res
        .status(400)
        .send({ status: false, message: "Product data  required " });
    }

    const userIdFromToken = req.userId;
    if (userIdFromToken != userId) {
      return res
        .status(403)
        .send({ status: false, message: "Unauthorized access." });
    }

    const { productId, cartId } = info;
    if (!validator.isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid productId" });
    }

    let productData = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!productData) {
      return res
        .status(400)
        .send({ status: false, message: "Product doesn't exist" });
    }

    if (cartId) {
      if (!validator.isValidObjectId(cartId)) {
        return res
          .status(400)
          .send({ status: false, message: " invalid cartId" });
      }

      let cart = await cartModel.findOne({ _id: cartId });
      if (!cart)
        return res
          .status(400)
          .send({ status: false, message: "cartId data don't exist" });

      let findcart = await cartModel.findOne({ userId: userId });

      if (cartId !== findcart._id.toString()) {
        return res
          .status(400)
          .send({ status: false, message: "user and cart are different" });
      }

      let cartData = await cartModel.findOne({ userId: userId });
      let arr = cartData.items;
      let product1 = {
        productId: productId,
        quantity: 1,
      };
      compareId = arr.findIndex((obj) => obj.productId == productId);

      if (compareId == -1) {
        arr.push(product1);
      } else {
        arr[compareId].quantity += 1;
        cartData.totalItems += 1;
        cartData.totalPrice = 0;
        for (let i = 0; i < arr.length; i++) {
          let product = await productModel.findOne({ _id: arr[i].productId });
          cartData.totalPrice += arr[i].quantity * product.price;
        }
      }
      await cartData.save();

      return res
        .status(201)
        .send({
          status: true,
          message: "product added to  cart ",
          data: cartData,
        });
    } else {
      let cartData = await cartModel.findOne({ userId: userId });

      if (cartData) {
        let arr = cartData.items;
        let product1 = {
          productId: productId,
          quantity: 1,
        };
        compareId = arr.findIndex((obj) => obj.productId == productId);
        console.log(compareId);
        if (compareId == -1) {
          arr.push(product1);
        } else {
          arr[compareId].quantity += 1;
        }
        cartData.totalItems += 1;
        cartData.totalPrice = 0;
        for (let i = 0; i < arr.length; i++) {
          let product = await productModel.findOne({ _id: arr[i].productId });
          cartData.totalPrice += arr[i].quantity * product.price;
        }
        await cartData.save();

        return res.status(200).send({
          status: true,
          message: "product added to cart",
          data: cartData,
        });
      } else {
        let items = [];
        let product1 = {
          productId: productId,
          quantity: 1,
        };
        items.push(product1);
        let product = await productModel.findOne({ _id: productId });
        let cartBody = {
          userId: userId,
          items: items,
          totalPrice: product.price,
          totalItems: 1,
        };

        let cartSavedData = await cartModel.create(cartBody);
        console.log(cartSavedData);
        return res.status(201).send({
          status: true,
          message: "Cart created successfully",
          data: cartSavedData,
        });
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const updateCart = async function (req, res) {
  try {
    const requestbody = req.body;

    const { cartId, productId, removeProduct } = requestbody;

    if (!validator.isValidObjectId(cartId)) {
      return res
        .status(400)
        .send({ status: false, message: "enter the valid cartId in body" });
    }
    const findCart = await cartModel.findOne({ _id: cartId });
    if (!findCart) {
      return res
        .status(400)
        .send({ status: false, message: "No such cartId exist" });
    }

    if (!validator.isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "enter the valid productId in body" });
    }
    const findProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!findProduct) {
      return res
        .status(400)
        .send({
          status: false,
          message: `No such Product exist with this ${productId} Product id `,
        });
    }

    if (!validator.isValid(removeProduct))
      return res
        .status(400)
        .send({ status: false, message: "removeProduct is required" });

    if (!/^[0|1]$/.test(removeProduct)) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "removeProduct should either be 0 (to remove  product from cart) or 1 (to reduce quantity by one)",
        });
    }

    for (let i = 0; i < findCart.items.length; i++) {
      if (`${findCart.items[i].productId}` == `${findProduct._id}`) {
        if (removeProduct == 1 && findCart.items[i].quantity > 1) {
          findCart.items[i].quantity = findCart.items[i].quantity - 1;
          findCart.save();
          const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cartId },
            {
              $inc: { totalPrice: -findProduct.price }, //$inc
            },
            { new: true }
          );
          let arr1 = findCart.items
          updatedCart.totalItems = arr1.length
          updatedCart.items = findCart.items;
          updatedCart.save();

          return res
            .status(200)
            .send({
              status: true,
              message: "Cart updated successfully",
              data: updatedCart,
            });
        } else {
          const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cartId },
            {
              $pull: { items: { productId: productId } },
              $inc: {
                totalItems: -1,
                totalPrice: -(findProduct.price * findCart.items[i].quantity),
              },
            },
            { new: true }
          );
          updatedCart.items = findCart.items;
          updatedCart.save();

          return res
            .status(200)
            .send({
              status: true,
              message: `${productId} is removed`,
              data: updatedCart,
            }); //$pull
        }
      }
    }

    return res
      .status(400)
      .send({ status: false, message: "product does not exists in cart" });
  } catch (error) {
    res
      .status(500)
      .send({ status: false, msg: "server error", message: error.message });
  }
};

const getCart = async function (req, res) {
  try {
    let userId = req.params.userId;

    if (!validator.isValid(userId)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameters. userId is required",
        });
    }
    if (!validator.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameters. userId is not valid",
        });
    }

    let cartsummary = await cartModel.findOne({ userId: userId });
    if (!cartsummary) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "No such cart found. Please register and try again",
        });
    }
    const userIdFromToken = req.userId;
    if (userIdFromToken != userId) {
      return res
        .status(403)
        .send({ status: false, message: "Unauthorized access." });
    }
    return res.status(200).send({ status: true, data: cartsummary });
  } catch (error) {
    res.status(500).send({ status: false, data: error.message });
  }
};

const deleteCart = async function (req, res) {
  try {
    const userId = req.params.userId;
    
    if (!validator.isValid(userId)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameters. userId is required",
        });
    }

    if (!validator.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid userId" });
    }

    //check cart exist or not
    const findCart = await cartModel.findOne({ userId: userId });
    if (!findCart)
      return res
        .status(404)
        .send({ status: false, message: "Cart doesn't exist for this user" });

    if (findCart.totalItems === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Cart is already deleted" });
    }

    const deletedCart = await cartModel.findOneAndUpdate(
      { userId: userId },
      { items: [], totalItems: 0, totalPrice: 0 },
      { new: true }
    );
    return res
      .status(204)
      .send({ status: true, message: "Deleted", data: deletedCart });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createCart, updateCart, getCart, deleteCart };
