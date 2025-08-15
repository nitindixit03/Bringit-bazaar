import React from "react";

const Cancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8 sm:py-12">
      <div className="max-w-md mx-auto">
        {/* Main Cancel Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          {/* Header with X icon */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Payment Cancelled
              </h1>
              <p className="text-red-100 text-sm sm:text-base">
                Your transaction was not completed
              </p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          </div>

          {/* Information Section */}
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-amber-800 mb-1">
                    What happened?
                  </h3>
                  <p className="text-sm text-amber-700">
                    Your payment was cancelled and no charges were made to your
                    account. This could happen if you closed the payment window
                    or clicked the back button.
                  </p>
                </div>
              </div>
            </div>

            {/* Common Reasons */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Common reasons for cancellation:
              </h3>
              <div className="space-y-2">
                {[
                  "Payment window was closed",
                  "Browser back button was pressed",
                  "Session timeout or network issue",
                  "Changed mind about the purchase",
                ].map((reason, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-blue-800">
                  Good news!
                </h3>
              </div>
              <p className="text-sm text-blue-700">
                Your items are still saved in your cart. You can continue
                shopping or try checking out again when you're ready.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6 space-y-3">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Return to Home
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => (window.location.href = "/checkout")}
              className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Try Payment Again
            </button>
          </div>
        </div>

        

        {/* Reassurance Message */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold text-green-800">
              Secure & Safe
            </span>
          </div>
          <p className="text-sm text-green-700">
            No charges were made to your payment method. Your financial
            information remains secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
