import React, { useState, useEffect } from 'react'
import CardLoading from '../components/CardLoading.jsx'
import AxiosToastError from '../utils/AxiosToastError.js'
import Axios from '../utils/axios.js'
import SummaryApi from '../common/SummaryApi.js'
import CardProduct from '../components/CardProduct.jsx'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'
import useDebounce from '../hooks/useDebounce.jsx' // ✅ import debounce hook

const Search = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const loadingArrayCard = new Array(10).fill(null)
  const params = useLocation()
  const searchText = params?.search?.slice(3) || ""
  const debouncedSearchText = useDebounce(searchText, 500)  // ✅ debounce searchText

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: debouncedSearchText,
          page: page,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data)
        } else {
          setData(prev => [...prev, ...responseData.data])
        }
        setTotalPage(responseData.totalPage)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // reset to page 1 when debounced search changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearchText])

  useEffect(() => {
    fetchData()
  }, [page, debouncedSearchText])

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage(prev => prev + 1)
    }
  }

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        <p className='font-semibold'>Search results: {data.length}</p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={page < totalPage}
          next={handleFetchMore}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-4'>
            {
              data.map((p, index) => (
                <CardProduct data={p} key={p?._id + "searchProduct" + index} />
              ))
            }

            {
              loading && loadingArrayCard.map((_, index) => (
                <CardLoading key={"loadingsearchPage" + index} />
              ))
            }
          </div>
        </InfiniteScroll>

        {
          !data[0] && !loading && (
            <div className='flex flex-col justify-center items-center w-full mx-auto'>
              <img
                src={noDataImage}
                className='w-full h-full max-w-xs max-h-xs object-scale-down'
                alt="No data"
              />
              <p className='font-semibold my-2'>No Data found</p>
            </div>
          )
        }
      </div>
    </section>
  )
}

export default Search
