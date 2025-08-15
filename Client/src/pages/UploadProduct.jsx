import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa"
import UploadImage from '../utils/UploadImage'
import Loading from '../components/Loading'
import ViewImage from '../components/ViewImage'
import { MdDelete } from "react-icons/md"
import { useSelector } from 'react-redux'
import { IoClose } from 'react-icons/io5'
import AddFieldComponent from '../components/AddFieldComponent'
import Axios from '../utils/axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import successAlert from '../utils/SuccessAlert'

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  })

  const [loading, setLoading] = useState(false)
  const [viewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")

  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddFields, setOpenAddFields] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    setLoading(true)

    const response = await UploadImage(file)

    const { data: ImageResponse } = response

    const imageUrl = ImageResponse.data.url

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })

    setLoading(false)
  }

  const handleImageDelete = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddFields(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("data", data)
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      })

      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Upload Product</h2>
      </div>
      <div className='grid p-4'>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='name' className='font-medium'>Name</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter product name'
              value={data.name}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='description' className='font-medium' >Description</label>
            <textarea
              type='text'
              id='description'
              name='description'
              placeholder='Enter product description'
              value={data.description}
              onChange={handleChange}
              required
              rows={3}
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
            />
          </div>
          <div>
            <p className='font-medium'>Image</p>
            <div>
              <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                <div className='text-center flex justify-center items-center flex-col'>
                  {
                    loading ? (
                      <Loading />
                    ) : (
                      <>
                        <FaCloudUploadAlt size={35} />
                        <p>Upload Image</p>
                      </>
                    )
                  }
                </div>
                <input id='productImage' type='file' accept='image/*' className='hidden'
                  onChange={handleUploadImage}
                />
              </label>
              {/* upload image */}
              <div className='flex flex-wrap gap-2'>
                {
                  data.image.map((img, index) => {
                    return (
                      <div key={img + index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                        <img
                          src={img}
                          alt={img}
                          className='w-full h-full object-scale-down cursor-pointer'
                          onClick={() => setViewImageURL(img)}
                        />
                        <div onClick={() => handleImageDelete(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                          <MdDelete />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className='grid gap-1'>
            <label htmlFor='category' className='font-medium'>Category</label>
            <select
              className='bg-blue-50 border w-full p-2 rounded focus-within:border-primary-200'
              id='category'
              value={selectCategory}
              onChange={(e) => {
                const value = e.target.value
                const category = allCategory.find(el => el._id === value)

                setData((preve) => {
                  return {
                    ...preve,
                    category: [...preve.category, category]
                  }
                })
                setSelectCategory("")
              }}
            >
              <option value={""}>Select Category</option>
              {
                allCategory.map((c, index) => {
                  return (
                    <option key={c._id} value={c?._id}>{c.name}</option>
                  )
                })
              }
            </select>
            <div className='flex flex-wrap gap-3'>
              {
                data.category.map((c, index) => {
                  return (
                    <div key={c._id + index + "product section"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                      <p>{c.name}</p>
                      <div className='hover:text-red-600 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                        <IoClose size={20} />
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className='grid gap-1'>
            <label htmlFor='subcategory' className='font-medium'>Sub Category</label>
            <select
              className='bg-blue-50 border w-full p-2 rounded focus-within:border-primary-200'
              id='subcategory'
              value={selectSubCategory}
              onChange={(e) => {
                const value = e.target.value
                const subCategory = allSubCategory.find(el => el._id === value)

                setData((preve) => {
                  return {
                    ...preve,
                    subCategory: [...preve.subCategory, subCategory]
                  }
                })
                setSelectSubCategory("")
              }}
            >
              <option value={""} className='text-neutral-600'>Select Sub Category</option>
              {
                allSubCategory.map((c, index) => {
                  return (
                    <option key={c?._id} value={c?._id}>{c.name}</option>
                  )
                })
              }
            </select>
            <div className='flex flex-wrap gap-3'>
              {
                data.subCategory.map((c, index) => {
                  return (
                    <div key={c._id + index + "product section"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                      <p>{c.name}</p>
                      <div className='hover:text-red-600 cursor-pointer' onClick={() => handleRemoveSubCategory(index)}>
                        <IoClose size={20} />
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className='grid gap-1'>
            <label htmlFor='unit' className='font-medium'>Unit</label>
            <input
              id='unit'
              type='text'
              placeholder='Enter product unit'
              name='unit'
              value={data.unit}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='stock' className='font-medium'>Number of Stock</label>
            <input
              id='stock'
              type='number'
              placeholder='Enter product stock'
              name='stock'
              value={data.stock}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='price' className='font-medium'>Price</label>
            <input
              id='price'
              type='number'
              placeholder='Enter product price'
              name='price'
              value={data.price}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='discount' className='font-medium'>Discount</label>
            <input
              id='discount'
              type='number'
              placeholder='Enter product discount'
              name='discount'
              value={data.discount}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          {Object.keys(data.more_details)?.map((k, index) => (
            <div key={index} className='grid gap-1'>
              <label htmlFor={k} className='font-medium'>{k}</label>
              <input
                type='text'
                id={k}
                value={data.more_details[k]}
                onChange={(e) => {
                  const value = e.target.value;
                  setData((prev) => ({
                    ...prev,
                    more_details: {
                      ...prev.more_details,
                      [k]: value
                    }
                  }));
                }}
                required
                className='bg-blue-50 p-2 outline-none border focus:border-primary-200 rounded'
              />
            </div>
          ))}

          <div onClick={() => setOpenAddFields(true)} className='inline-block hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
            Add Fields
          </div>

          <button type='submit' className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'>
            Submit
          </button>
        </form>
      </div>

      {
        viewImageURL && (
          <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
        )
      }

      {
        openAddFields && (
          <AddFieldComponent value={fieldName} onChange={(e) => setFieldName(e.target.value)} submit={handleAddField} close={() => setOpenAddFields(false)} />
        )
      }
    </section>
  )
}

export default UploadProduct