import React, { useState } from 'react'
import UploadcategoryModel from '../components/UploadcategoryModel'
import { useEffect } from 'react'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from './EditCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'

const Category = () => {
    const [openUploadCategory, setUploadCategory] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    })
    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    })

    // const allcategory = useSelector(state => state.product.allCategory)

    // useEffect(()=>{
    //     setCategoryData(allcategory)
    // },[allcategory])

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data: responseData } = response

            if (responseData.success) {
                setCategoryData(responseData.data)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const handleDeleteCategory = async() => {
        try {
            const response = await Axios({
                ...SummaryApi.deletecategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError()
        }
    }

    return (
        <section>
            <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                <h2 className='font-semibold'>Category</h2>
                <button onClick={() => setUploadCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded cursor-pointer'>Add Category</button>
            </div>
            {
                !categoryData[0] && !loading && (
                    <NoData />
                )
            }

            <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
                {
                    categoryData.map((Category, index) => {
                        return (
                            <div key={Category._id} className='w-32 h-56 rounded shadow-md'>
                                <img
                                    alt={Category.name}
                                    src={Category.image}
                                    className='w-full object object-scale-down'
                                />

                                <div className='flex items-center h-9 gap-2'>
                                    <button onClick={() => {
                                        setOpenEdit(true)
                                        setEditData(Category)
                                    }} className='flex-1 bg-green-100 text-green-600 hover:bg-green-200 font-medium py-1 rounded'>
                                        Edit
                                    </button>
                                    <button onClick={() => {
                                        setOpenConfirmBoxDelete(true)
                                        setDeleteCategory(Category)
                                    }} className='flex-1 bg-red-100 text-red-600 hover:bg-red-200 font-medium py-1 rounded'>
                                        Delete
                                    </button>
                                </div>

                            </div>
                        )
                    })
                }
            </div>

            {
                loading && (
                    <Loading />
                )
            }

            {
                openUploadCategory && (
                    <UploadcategoryModel fetchData={fetchCategory} close={() => setUploadCategory(false)} />
                )
            }

            {
                openEdit && (
                    <EditCategory data={editData} fetchData={fetchCategory} close={() => setOpenEdit(false)} />
                )
            }

            {
                openConfirmBoxDelete && (
                    <ConfirmBox close={() => setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
                )
            }
        </section>
    )
}

export default Category