import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import ProductModel from "../models/product.model.js"; // optional, for fetching product details
import mongoose from "mongoose";
import Stripe from "../config/stripe.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Utility: Calculate price after discount
 */
export const PriceWithDiscount = (price, dis = 0) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  return Number(price) - discountAmount;
};

/**
 * Cash on Delivery Order
 */
export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressID, subTotalAmt } = req.body;

    if (totalAmt < 45) {
      return res.status(400).json({
        message: "Please add items worth at least ₹45 to continue with payment.",
        error: true,
        success: false,
      });
    }

    const payload = list_items.map((el) => ({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: new mongoose.Types.ObjectId(el.productId._id),
      product_details: { name: el.productId.name, image: el.productId.image },
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressID,
      subTotalAmt,
      totalAmt,
    }));

    const generateOrder = await OrderModel.insertMany(payload);

    // Clear cart
    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return res.json({
      message: "Order placed successfully",
      success: true,
      error: false,
      data: generateOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

/**
 * Online Payment Controller (Create Stripe Session)
 */
export async function paymentController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressID, subTotalAmt } = req.body;
    const user = await UserModel.findById(userId);

    if (totalAmt < 45) {
      return res.status(400).json({
        message: "Please add items worth at least ₹45 to continue with payment.",
        error: true,
        success: false,
      });
    }

    // Prepare Stripe line items
    const line_items = list_items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.productId.name,
        },
        unit_amount: PriceWithDiscount(item.productId.price, item.productId.discount) * 100,
      },
      adjustable_quantity: { enabled: true, minimum: 1 },
      quantity: item.quantity,
    }));

    // Minimal metadata
    const metadata = {
      userId,
      addressID,
      list_items: JSON.stringify(
        list_items.map((i) => ({ productId: i.productId._id.toString(), quantity: i.quantity }))
      ),
      totalAmt,
      subTotalAmt,
    };

    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items,
      metadata,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    return res.json({ id: session.id });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

/**
 * Stripe Success Handler
 */
export async function checkoutSuccessHandler(req, res) {
  try {
    const { session_id } = req.body;
    if (!session_id)
      return res.status(400).json({ success: false, message: "Session ID missing" });

    const session = await Stripe.checkout.sessions.retrieve(session_id);
    const userId = session.metadata.userId;
    const addressId = session.metadata.addressID;
    const list_items = JSON.parse(session.metadata.list_items);
    const totalAmt = session.metadata.totalAmt;
    const subTotalAmt = session.metadata.subTotalAmt;

    // Fetch product details from DB
    const productDetailsMap = {};
    for (const item of list_items) {
      const product = await ProductModel.findById(item.productId);
      productDetailsMap[item.productId] = product
        ? { name: product.name, image: product.image }
        : { name: "Product", image: [] };
    }

    // Prepare orders with correct ObjectIds
    const orderProduct = list_items.map((item) => ({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: new mongoose.Types.ObjectId(item.productId),
      product_details: productDetailsMap[item.productId],
      paymentId: session.payment_intent,
      payment_status: session.payment_status,
      delivery_address: addressId,
      subTotalAmt,
      totalAmt,
    }));

    const order = await OrderModel.insertMany(orderProduct);

    // Clear cart
    await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
    await CartProductModel.deleteMany({ userId });

    return res.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
}

/**
 * Get Order Details
 */
export async function getOrderDetails(req, res) {
  try {
    const userId = req.userId;

    const orderlist = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return res.json({
      message: "Order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
