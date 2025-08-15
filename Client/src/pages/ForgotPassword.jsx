import React, { useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6"
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const valideValue = Object.values(data).every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data
      })
      if (response.data.error) {
        toast.error(response.data.message)
      }
      if (response.data.success) {
        toast.success(response.data.message)
        navigate("/verification-otp", {
            state: { email: data.email } 
        });

        setData({
          email: "",                 
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }


  }

  return (
    <section className="w-full container mx-auto px-2">
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <p className='font-semibold text-lg mb-2'>Forgot Password</p>

        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>

          <div className='grid gap-1'>
            <label htmlFor='email'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
              value={data.email}
              onChange={handleChange}
              placeholder='Enter your email'
              autoComplete='email'
            />
          </div>

          <button
            type="submit"
            disabled={!valideValue}
            className={`${
              valideValue
                ? "bg-green-800 hover:bg-green-700"
                : "bg-gray-500 opacity-60 cursor-not-allowed"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Send OTP
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

export default ForgotPassword