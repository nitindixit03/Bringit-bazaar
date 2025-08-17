import React from 'react'
import { FaGithubSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='border-t'>
      <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2 max-w-[89rem]'>
        <p>
          © 2025 Bringit Bazaar. All rights reserved.
        </p>

        <div className='flex items-center gap-4 justify-center text-2xl'>
          <a 
            href='https://github.com/nitindixit03' 
            target='_blank' 
            rel='noopener noreferrer' 
            className='hover:text-primary-100 transition-colors duration-200'
          >
            <FaGithubSquare/>
          </a>
          <a 
            href='https://www.instagram.com/im.nitindixit/' 
            target='_blank' 
            rel='noopener noreferrer' 
            className='hover:text-primary-100 transition-colors duration-200'
          >
            <FaInstagram/>
          </a>
          <a 
            href='https://www.linkedin.com/in/nitin-dixit-b1bb37289/' 
            target='_blank' 
            rel='noopener noreferrer' 
            className='hover:text-primary-100 transition-colors duration-200'
          >
            <FaLinkedin />
          </a>
        </div>

      </div>
    </footer>
  )
}

export default Footer
