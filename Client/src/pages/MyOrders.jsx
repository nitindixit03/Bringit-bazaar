import React from 'react';
import { useSelector } from 'react-redux';
import NoData from '../components/NoData';
import { FaTruck } from 'react-icons/fa'; // Truck icon

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h1 className="text-xl font-semibold">My Orders</h1>
      </div>

      {!orders[0] && <NoData />}

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={order._id + index + "order"}
            className="bg-white shadow-md rounded-md p-4 relative flex flex-col sm:flex-row sm:items-start sm:gap-6"
          >
            {/* Shipped Badge - Top Right */}
            <div className="absolute top-3 right-3 inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full border border-blue-200">
              <FaTruck className="text-blue-600" />
              <span className="font-medium">Shipped</span>
            </div>

            {/* Product Image */}
            <img
              src={order.product_details.image[0]}
              alt={order.product_details.name}
              className="w-20 h-20 object-cover rounded"
            />

            {/* Product & Order Details */}
            <div className="flex-1 mt-2 sm:mt-0">
              <p className="text-sm text-gray-500">
                Order No: <span className="font-medium">{order.orderId}</span>
              </p>
              <p className="font-semibold mt-1">{order.product_details.name}</p>

              {/* Payment & Status */}
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>Payment Status: <span className="font-medium">{order.payment_status || "Pending"}</span></p>
                <p>Subtotal: ₹{order.subTotalAmt}</p>
                <p>Total: ₹{order.totalAmt}</p>
                <p>Ordered On: {new Date(order.createdAt).toLocaleString()}</p>
              </div>

              {/* Delivery Address */}
              {order.delivery_address && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-2 rounded">
                  <p className="font-medium">Delivery Address:</p>
                  <p>{order.delivery_address.address_line}, {order.delivery_address.city}</p>
                  <p>{order.delivery_address.state} - {order.delivery_address.pincode}</p>
                  <p>{order.delivery_address.country}</p>
                  <p>Mobile: {order.delivery_address.mobile}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
