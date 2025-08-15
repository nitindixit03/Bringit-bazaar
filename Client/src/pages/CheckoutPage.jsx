import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../components/DisplayPriceInRupees.jsx'
import AddAddress from '../components/AddAddress.jsx'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError.js'
import Axios from '../utils/axios.js'
import SummaryApi from '../common/SummaryApi.js'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
    const { noDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const addressList = useSelector(state => state.address.addressList)
    const [selectAddress, setSelectAddress] = useState(0)
    const cartItemList = useSelector(state => state.cartItem.cart)
    const navigate = useNavigate()


    const handleCashOnDelivery = async () => {
        let loadingToast = null;
        try {
            loadingToast = toast.loading("Loading...")
            const response = await Axios({
                ...SummaryApi.CashOnDeliveryOrder,
                data: {
                    list_items: cartItemList,
                    totalAmt: totalPrice,
                    addressID: addressList[selectAddress]?._id,
                    subTotalAmt: totalPrice,
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
                if (fetchOrder) {
                    fetchOrder()
                }
                navigate('/success', {
                    state: {
                        text: "Order"
                    }
                })
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            if (loadingToast) toast.dismiss(loadingToast)
        }
    }

    const handleOnlinePayment = async () => {
        let loadingToast = null;
        try {
            loadingToast = toast.loading("Loading...")

            const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY

            const stripePromise = await loadStripe(stripePublicKey)

            const response = await Axios({
                ...SummaryApi.payment_url,
                data: {
                    list_items: cartItemList,
                    totalAmt: totalPrice,
                    addressID: addressList[selectAddress]?._id,
                    subTotalAmt: totalPrice,
                }
            })

            const { data: responseData } = response

            stripePromise.redirectToCheckout({ sessionId: responseData.id })

            if (fetchCartItem) {
                fetchCartItem()
            }
            if (fetchOrder) {
                fetchOrder()
            }

        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            if (loadingToast) toast.dismiss(loadingToast);
        }
    }

    return (
        <section className='bg-blue-50'>
            <div className='max-w-[90rem] mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>

                <div className='w-full'>
                    {/* address */}
                    <h3 className='text-lg font-semibold'>Choose your address</h3>
                    <div className='bg-white p-2 grid gap-4'>
                        <div className="space-y-4">
                            {addressList.map((address, index) => {
                                if (!address.status) return null;

                                const isSelected = selectAddress === index; // ✅ number comparison

                                return (
                                    <label
                                        key={address._id || index}
                                        htmlFor={`address-${index}`}
                                        className="block cursor-pointer group"
                                    >
                                        <div
                                            className={`
            relative border-2 rounded-lg p-4 transition-all duration-200 bg-white
            ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                }
            group-hover:transform group-hover:scale-[1.01]
          `}
                                        >
                                            <div className="flex gap-4">
                                                {/* Radio button */}
                                                <div className="flex-shrink-0 pt-1">
                                                    <input
                                                        id={`address-${index}`}
                                                        type="radio"
                                                        value={index}
                                                        checked={isSelected}
                                                        onChange={(e) => setSelectAddress(Number(e.target.value))} // ✅ store as number
                                                        name="address"
                                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                    />
                                                </div>

                                                {/* Address details */}
                                                <div className="flex-1">
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-gray-900 text-base leading-snug">
                                                            {address.address_line}
                                                        </p>
                                                        <p className="text-gray-700">{address.city}</p>
                                                        <p className="text-gray-700">{address.state}</p>
                                                        <p className="text-gray-700">{address.pincode}</p>
                                                        <p className="text-gray-700">{address.country}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                                                        <span className="text-gray-500 text-sm">📞</span>
                                                        <span className="text-gray-700 text-sm font-medium">
                                                            {address.mobile}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tick mark when selected */}
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm">✓</span>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                    </div>
                    <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                        Add address
                    </div>
                </div>

                <div className='w-full max-w-128 bg-white py-4 px-2'>
                    {/* summary */}
                    <h3 className='text-lg font-semibold'>Summary</h3>
                    <div className='bg-white p-4'>
                        <h3 className='font-semibold text-base mb-2'>Billing Summary</h3>
                        <div className='flex justify-between ml-1 text-sm'>
                            <p>Item Total</p>
                            <p className='flex items-center gap-2'>
                                <span className='line-through text-neutral-400'>{DisplayPriceInRupees(noDiscountTotalPrice)}</span>
                                <span>{DisplayPriceInRupees(totalPrice)}</span>
                            </p>
                        </div>
                        <div className='flex justify-between ml-1 text-sm'>
                            <p>Total Quantity</p>
                            <p>{totalQty} item{totalQty > 1 ? 's' : ''}</p>
                        </div>
                        <div className='flex justify-between ml-1 text-sm'>
                            <p>Delivery Charges</p>
                            <p className='text-green-600'>Free</p>
                        </div>
                        <div className='font-semibold flex justify-between ml-1 mt-2 text-base'>
                            <p>Grand Total</p>
                            <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                    </div>
                    <div className='w-full  flex flex-col gap-4 '>
                        <button onClick={handleOnlinePayment} className='py-2 px-4 bg-green-600 text-white font-semibold hover:bg-green-700 rounded cursor-pointer'>Online Payment</button>
                        <button onClick={handleCashOnDelivery} className='py-2 px-4 border-2 border-green-600 text-green-600 font-semibold hover:bg-green-600 hover:text-white rounded cursor-pointer'>Cash on delivery</button>
                    </div>
                </div>

            </div>


            {
                openAddress && (
                    <AddAddress close={() => setOpenAddress(false)} />
                )
            }

        </section>
    )
}

export default CheckoutPage