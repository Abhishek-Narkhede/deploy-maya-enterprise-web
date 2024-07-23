// src/Footer.js
import React from 'react';
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import Newsletter from '../Newsletter/Newsletter';
import App from '../Apps/DownloadApp';

const Footer = () => {
  return (
    <div className='w-full'>
      <div className='relative top-20'>
      <div className='flex flex-col mx-4 sm:flex-row gap-4 justify-center item-center md:mx-4'>
        <Newsletter/>
        <App/>
      </div>
      </div>
      <div className='w-full bg-[#095D7E] text-white pt-12'>
      <div className='container mx-auto'>
        <footer className=" flex justify-center ">
        <div className=''>
        <div className="flex flex-col lg:flex-row justify-between px-4 pt-20 pb-10">
        {/* Logo and Social Media Icons */}
        <div className="">
          <h2 className="text-xl font-bold mb-2 text-[40px]">MAYA </h2>
          <h2 className="text-xl font-bold mb-2  text-[40px]"> ENTERPRISE</h2>
          <div className="flex space-x-4 text-2xl pt-4">
            <FaFacebookF className="cursor-pointer hover:text-gray-300 text-[15px]"  />
            <FaYoutube className="cursor-pointer hover:text-gray-300 text-[15px]"  />
            <FaLinkedinIn className="cursor-pointer hover:text-gray-300 text-[15px]" />
            <FaTwitter className="cursor-pointer hover:text-gray-300 text-[15px]"  />
          </div>
        </div>
        <div className="mb-6 lg:mb-0 lg:w-1/3 lg:px-12 text-center lg:text-left">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
               tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className='pt-2'>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
               ea commodo consequat.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-around lg:justify-end flex-1">
          <div className="flex-1 flex-col mb-6 lg:mb-0 text-center lg:text-left">  
            <h3 className="font-semibold mb-2 text-[16px]">Home</h3>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
          </div>
          <div className="flex-1 flex-col mb-6 lg:mb-0 text-center lg:text-left">
            <h3 className="font-semibold mb-2 text-[16px]">Kidney Medicines</h3>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
          </div>
          <div className="flex-1 flex-col mb-6 lg:mb-0 text-center lg:text-left"> 
            <h3 className="font-semibold mb-2 text-[16px]">FAQs</h3>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
          </div>
          <div className="flex-1 flex-col mb-6 lg:mb-0 text-center lg:text-left">
            <h3 className="font-semibold mb-2 text-[16px]">Contact Us</h3>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
            <a href="#" className="block mb-1 hover:underline">Lorem ipsum</a>
          </div>
        </div>
        </div>
      <div className="text-center border-t border-[#F1F9FF]
 py-4">
        <p>Copyright @sdlcCorp 2024</p>
      </div>
        </div>
    </footer>
      </div>
    </div> 

    </div>
  );
};

export default Footer;
