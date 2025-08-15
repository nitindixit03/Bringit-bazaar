import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from './DisplayPriceInRupees'
import { FaCaretRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { PriceWithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {
    const { noDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = ()=>{
        if(user?._id){
            navigate('/checkout')
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
    }

    return (
        <section className='bg-neutral-900/70 fixed inset-0 z-50'>
            <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
                {/* Header */}
                <div className='flex items-center p-4 shadow-md justify-between'>
                    <h2 className='font-semibold text-lg'>Your Cart</h2>
                    <Link to={"/"} className='lg:hidden'>
                        <IoClose size={25} />
                    </Link>
                    <button onClick={close} className='hidden lg:block cursor-pointer'>
                        <IoClose size={25} />
                    </button>
                </div>

                {/* Cart Content */}
                <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
                    {cartItem.length > 0 ? (
                        <>
                            {/* Savings Info */}
                            <div className='flex items-center justify-between p-2 bg-blue-100 text-blue-500 rounded-full px-4 py-2'>
                                <p>Total Savings</p>
                                <p>{DisplayPriceInRupees(noDiscountTotalPrice - totalPrice)}</p>
                            </div>

                            {/* Cart Items */}
                            <div className='bg-white rounded-lg p-4 grid gap-2 overflow-auto'>
                                {cartItem.map((item, index) => (
                                    <div key={index} className='flex w-full gap-4'>
                                        <div className='w-16 h-16 min-h-16 min-w-16 bg-gray-200 border rounded'>
                                            <img
                                                src={item?.productId?.image[0]}
                                                alt={item?.productId?.name}
                                                className='object-scale-down w-full h-full'
                                            />
                                        </div>
                                        <div className='w-full max-w-sm'>
                                            <p className='text-xs line-clamp-2'>{item?.productId?.name}</p>
                                            <p className='text-neutral-400 text-sm'>{item?.productId?.unit}</p>
                                            <p className='font-semibold'>
                                                {DisplayPriceInRupees(PriceWithDiscount(item?.productId?.price, item?.productId?.discount))}
                                            </p>
                                        </div>
                                        <div>
                                            <AddToCartButton data={item?.productId} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bill Summary */}
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
                        </>
                    ) : (
                        <div className='bg-white flex flex-col justify-center items-center py-10 gap-4'>
                            <img
                                src={imageEmpty}
                                alt='Empty Cart'
                                className='w-full h-full max-w-xs object-scale-down'
                            />
                            <Link
                                onClick={close}
                                to={"/"}
                                className='bg-green-600 text-white rounded px-4 py-2'
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer Checkout */}
                {cartItem.length > 0 && (
                    <div className='p-2'>
                        <div className='bg-green-700 text-white p-3 sticky bottom-3 rounded flex items-center justify-between font-bold text-base'>
                            <div>{DisplayPriceInRupees(totalPrice)}</div>
                            <button onClick={redirectToCheckoutPage} className='flex items-center gap-1 cursor-pointer'>
                                Checkout
                                <FaCaretRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default DisplayCartItem
