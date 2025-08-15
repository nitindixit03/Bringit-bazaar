import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCatgeoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: { id }
            })
            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCatgeoryWiseProduct()
    }, [id])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.scrollBehavior = 'smooth'
        }
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }
    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    const handleRedirectURL = () => {
        const subCategory = subCategoryData.find(sub =>
            sub.category.some(c => c._id === id)
        )

        if (!subCategory) return '#' 

        return `/${validURLConvert(name)}-${id}/${validURLConvert(subCategory?.name)}-${subCategory?._id}`
    }

    return (
        data.length > 0 && (
            <div>
                <div className='container mx-auto p-4 max-w-[90rem] flex items-center justify-between gap-4'>
                    <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                    <Link to={handleRedirectURL()} className='text-green-600 hover:text-green-400'>See All</Link>
                </div>

                <div className='relative flex items-center'>
                    <div
                        className='flex gap-4 md:gap-6 lg:gap-14 container mx-auto max-w-[90rem] px-4 overflow-x-scroll scrollbar-none scroll-smooth [&::-webkit-scrollbar]:hidden'
                        ref={containerRef}
                    >
                        {loading
                            ? loadingCardNumber.map((_, index) => (
                                <CardLoading key={"CategorywiseProductDisplay123" + index} />
                            ))
                            : data.map((p, index) => (
                                <CardProduct key={p._id + "CategorywiseProductDisplay" + index} data={p} />
                            ))
                        }
                    </div>

                    <div className='w-full left-0 right-0 container mx-auto max-w-[90rem] px-2 absolute hidden lg:flex justify-between'>
                        <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full cursor-pointer hover:scale-110 transition'>
                            <FaAngleLeft />
                        </button>
                        <button onClick={handleScrollRight} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full cursor-pointer hover:scale-110 transition'>
                            <FaAngleRight />
                        </button>
                    </div>
                </div>
            </div>
        )
    )
}

export default CategoryWiseProductDisplay
