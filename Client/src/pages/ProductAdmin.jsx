import React, { useState, useEffect, useCallback } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5"

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search,
        }
      })
      const { data: responseData } = response

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchProductData()
  }, [fetchProductData])


  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1) 
      fetchProductData()
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  const handleNextPage = () => {
    if (page < totalPageCount) {
      setPage(prev => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }

  const handleOnChange = (e) => {
    setSearch(e.target.value)
  }

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between gap-4'>
        <h2 className='font-semibold'>Product</h2>
        <div className='h-full min-w-24 max-w-60 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 border focus-within:border-primary-200 rounded'>
          <IoSearchOutline size={25} />
          <input
            type='text'
            placeholder='Search product here...'
            className='h-full w-full outline-none bg-transparent'
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {loading && <Loading />}

      <div className='p-4 bg-blue-50'>
        <div className='min-h-55vh'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {productData.map((p) => (
              <ProductCardAdmin
                key={p._id}
                data={p}
                fetchProductData={fetchProductData}
              />
            ))}
          </div>
        </div>

        <div className='flex justify-between my-4'>
          <button
            onClick={handlePreviousPage}
            className='border border-primary-200 px-4 py-1 hover:bg-primary-200 cursor-pointer'
          >
            Previous
          </button>
          <button className='w-full bg-slate-100'>{page}/{totalPageCount}</button>
          <button
            onClick={handleNextPage}
            className='border border-primary-200 px-4 py-1 hover:bg-primary-200 cursor-pointer mr-11'
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductAdmin
