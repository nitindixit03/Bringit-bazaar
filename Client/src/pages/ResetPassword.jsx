import React, { useEffect, useState } from 'react'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const valideValue = Object.values(data).every(el => el)

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate('/')
        }
        if (location?.state?.email) {
            setData((prev) => {
                return {
                    ...prev,
                    email: location?.state?.email
                }
            })
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }



    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.newPassword !== data.confirmPassword) {
            toast.error("New password and Confirm Password must be same")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data: data
            })
            if (response.data.error) {
                toast.error(response.data.message)
            }
            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
        } catch (error) {
            AxiosToastError(error)
        }


    }


    return (
        <section className="w-full container mx-auto px-2">
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='font-semibold text-lg mb-2'>Enter Your Password</p>

                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>

                    <div className='grid gap-1'>
                        <input
                            type="text"
                            name="username"
                            autoComplete="username"
                            value={data.email}
                            hidden
                            readOnly
                        />
                        <label htmlFor='newPassword'>New Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='newPassword'
                                className='w-full outline-none'
                                name='newPassword'
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder='Enter your new password'
                                autoComplete='new-password'
                                aria-describedby='password-help'
                            />
                            <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : <FaEyeSlash />
                                }
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='confirmPassword'>Confirm Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full outline-none'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirm Password'
                                autoComplete='new-password'
                                aria-describedby='password-help'
                            />
                            <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye />
                                    ) : <FaEyeSlash />
                                }
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!valideValue}
                        className={`${valideValue
                            ? "bg-green-800 hover:bg-green-700"
                            : "bg-gray-500 opacity-60 cursor-not-allowed"
                            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Change Password
                    </button>

                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-200"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </section>
    )
}

export default ResetPassword