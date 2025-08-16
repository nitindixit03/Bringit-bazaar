import { Router } from 'express';
import {
  CashOnDeliveryOrderController,
  getOrderDetails,
  paymentController,

  checkoutSuccessHandler
} from '../controllers/order.controller.js';
import auth from '../middleware/auth.js';
import bodyParser from 'body-parser';

const orderRouter = Router();

// normal order routes (use global express.json())
orderRouter.post('/cash-on-delivey', auth, CashOnDeliveryOrderController);
orderRouter.post('/checkout', auth, paymentController);
orderRouter.post("/checkout/success", checkoutSuccessHandler);
orderRouter.get('/order-list', auth, getOrderDetails);

// // stripe webhook (⚡ must use raw body instead of JSON)
// orderRouter.post(
//   '/webhook',
//   bodyParser.raw({ type: 'application/json' }),
//   webhookStripe
// );

export default orderRouter;
