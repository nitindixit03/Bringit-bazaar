import React, { useEffect, useRef, useState } from 'react'
import { FaEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6"
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const OtpVerification = () => {
  const [data, setData] = useState(["","","","","",""])
  const navigate = useNavigate()
  const inputRef = useRef([])
  const location = useLocation()

  useEffect(()=>{
    if(!location?.state?.email){
        navigate("/")
    }
  },[])

  const valideValue = data.every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: {
            otp : data.join(""),
            email : location.state?.email
        }
      })
      if (response.data.error) {
        toast.error(response.data.message)
      }
      if (response.data.success) {
        toast.success(response.data.message)
        setData(["","","","","",""])
        navigate("/reset-password",{
            state : {
                data : response.data,
                email : location?.state?.email
            }
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }


  }

  return (
    <section className="w-full container mx-auto px-2">
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <p className='font-semibold text-lg mb-2'>Enetr OTP</p>

        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>

          <div className='grid gap-1'>
            <label htmlFor='otp'>Enter Your OTP :</label>
            <div className='flex items-center gap-2 justify-between mt-3'>
                {
                    data.map((element, index)=>{
                        return (
                            <input
                            key={"otp"+index}
                                type='text'
                                id='otp'
                                ref={(ref)=> {
                                    inputRef.current[index] = ref
                                    return ref
                                }}
                                maxLength={1}
                                value={data[index]}
                                onChange={(e)=>{
                                    const value = e.target.value
                                    const newData = [...data]
                                    newData[index] = value
                                    setData(newData)

                                    if(value && index < 5){
                                        inputRef.current[index+1].focus()
                                    }
                                }}
                                className='bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold'
                            />
                        )
                    })
                }
            </div>
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
            Verify OTP
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

export default OtpVerification