import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import mongoose from "mongoose";
import Stripe from "../config/stripe.js";
import dotenv from "dotenv";
dotenv.config();

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
      userId: userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: el.productId._id,
      product_details: {
        name: el.productId.name,
        image: el.productId.image,
      },
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressID,
      subTotalAmt: subTotalAmt,
      totalAmt: totalAmt,
    }));

    const generateOrder = await OrderModel.insertMany(payload);

    // remove from cart
    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return res.json({
      message: "Order Successfully",
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
 * Utility: Calculate discounted price
 */
export const PriceWithDiscount = (price, dis = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmount);

  return actualPrice;
};

/**
 * Online Payment Controller
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

    const line_items = list_items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.productId.name,
          images: item.productId.image,
          metadata: {
            productId: item.productId._id,
          },
        },
        unit_amount:
          PriceWithDiscount(item.productId.price, item.productId.discount) * 100,
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
      },
      quantity: item.quantity,
    }));

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressID,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

/**
 * Helper: Get Order Product Items from Stripe LineItems
 */
const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const payload = {
        userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId,
        payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      };

      productList.push(payload);
    }
  }

  return productList;
};

/**
 * Stripe Webhook (Secure Verification)
 */
export async function webhookStripe(req, res) {

  console.log(req.body)
  const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  let event;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }

    console.log("✅ Verified event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        try {
          const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
          const userId = session.metadata.userId;

          const orderProduct = await getOrderProductItems({
            lineItems,
            userId,
            addressId: session.metadata.addressId,
            paymentId: session.payment_intent,
            payment_status: session.payment_status,
          });

          const order = await OrderModel.insertMany(orderProduct);

          console.log("✅ Order created:", order);

          if (order[0]) {
            await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
            await CartProductModel.deleteMany({ userId });
            console.log("🛒 Cart cleared for user:", userId);
          }
        } catch (err) {
          console.error("❌ Error handling checkout.session.completed:", err);
        }
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  } else {
    return res.status(400).json({ error: "Endpoint secret not set" });
  }
}


/**
 * Get Order Details (for user)
 */
export async function getOrderDetails(req, res) {
  try {
    const userId = req.userId;

    const orderlist = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return res.json({
      message: "order list",
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
