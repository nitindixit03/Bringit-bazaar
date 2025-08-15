import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js"
import CartProductModel from "../models/cartproduct.model.js"
import mongoose from "mongoose";
import Stripe from "../config/stripe.js";
import dotenv from "dotenv"
dotenv.config()

export async function CashOnDeliveryOrderController(req, res) {
    try {
        const userId = req.userId
        const { list_items, totalAmt, addressID, subTotalAmt } = req.body

        if (totalAmt < 45) {
            return res.status(400).json({
                message: "Please add items worth at least ₹45 to continue with payment.",
                error: true,
                succes: false,
            })
        }

        const payload = list_items.map(el => {
            return ({
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
            })
        })

        const generateOrder = await OrderModel.insertMany(payload)

        //remove from the cart

        const removeCartItem = await CartProductModel.deleteMany({ userId: userId })
        const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

        return res.json({
            message: "Order Successfully",
            success: true,
            error: false,
            data: generateOrder
        })

    } catch (error) {
        return res.json(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const PriceWithDiscount = (price, dis = 1) => {
    const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmount)

    return actualPrice
}

export async function paymentController(req, res) {
    try {
        const userId = req.userId
        const { list_items, totalAmt, addressID, subTotalAmt } = req.body

        const user = await UserModel.findById(userId)


        if (totalAmt < 45) {
            return res.status(400).json({
                message: "Please add items worth at least ₹45 to continue with payment.",
                error: true,
                succes: false,
            })
        }

        const line_items = list_items.map(item => {
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.productId.name,
                        images: item.productId.image,
                        metadata: {
                            productId: item.productId._id
                        }
                    },
                    unit_amount: PriceWithDiscount(item.productId.price, item.productId.discount) * 100
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item.quantity
            }
        })

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressID
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return res.status(200).json(session)

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const getOrderProductItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {
    const productList = []

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product)

            const paylod = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,
                product_details: {
                    name: product.name,
                    image: product.images
                },
                paymentId: paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmt: Number(item.amount_total / 100),
                totalAmt: Number(item.amount_total / 100),
            }

            productList.push(paylod)
        }
    }

    return productList
}

//http://localhost:8000/api/order/webhook

export async function webhookStripe(req, res) {
    const event = req.body;
    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY

    console.log("event", event)

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
            const userId = session.metadata.userId
            const orderProduct = await getOrderProductItems(
                {
                    lineItems: lineItems,
                    userId: userId,
                    addressId: session.metadata.addressId,
                    paymentId: session.payment_intent,
                    payment_status: session.payment_status,
                })

            const order = await OrderModel.insertMany(orderProduct)

            console.log(order)
            if (Boolean(order[0])) {
                const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
                    shopping_cart: []
                })
                const removeCartProductDB = await CartProductModel.deleteMany({ userId: userId })
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
}

export async function getOrderDetails(req, res) {
    try {
        const userId = req.userId

        const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address')

        return res.json({
            message: "order list",
            data: orderlist,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}