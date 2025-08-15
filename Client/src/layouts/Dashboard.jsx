import React from 'react'
import Usermenu from '../components/Usermenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)
  console.log(user)
  return (
    <section className='bg-white'>
        <div className='container mx-auto p-4 grid lg:grid-cols-[250px_1fr]'>
            {/* left part for menu */}
            <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
                <Usermenu />
            </div>

            {/* right part for content */}
            <div className='bg-white min-h-[76vh]'>
                <Outlet />
            </div>
        </div>
    </section>
  )
}

export default Dashboard