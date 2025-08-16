import React from "react";
import { Link } from "react-router-dom";

const Success = () => {

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-gradient-to-br from-green-50 via-white to-green-50 px-4 py-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-full mb-4 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-green-100 text-sm sm:text-base">
              Your order has been confirmed
            </p>
          </div>

          {/* Body */}
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order will be processed shortly.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition"
              >
                Continue Shopping
              </Link>
              <Link
                to="/dashboard/myorders"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg transition"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;