import React from 'react'
import Usermenu from '../components/Usermenu'
import { IoClose } from "react-icons/io5";

const userMenuMobile = () => {
  return (
    <section className='bg-white h-full w-full p-2'>
        <button onClick={()=> window.history.back()} className='text-neutral-800 block w-fit ml-auto'>
            <IoClose size={30}/>
        </button>
        <div className='container mx-auto px-3 pb-8'>
            <Usermenu/>
        </div>
    </section>
  )
}

export default userMenuMobile