import React, { useState } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { LuEyeOff } from "react-icons/lu";

function CreatePassword() {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    alert(JSON.stringify(formData));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex max-w-4xl md:mx-auto mt-10 border rounded-lg overflow-hidden shadow-lg mx-5">
      <div style={{backgroundColor:'#F1F9FF'}} className=" hidden sm:hidden lg:block md:block flex-1 p-10 flex flex-col rounded-xl m-2 justify-end">
        <div className='mt-[70%]'>
       <h2 className="text-2xl font-bold mb-4">Medicines, Home Delivered</h2>
        <p className="text-xs text-gray-400">
          Order any medicine or health product and we'll deliver it for free.
          Enjoy discounts on everything.
        </p>
      </div>
      </div>
      <div className="flex-1 p-10 bg-white">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">Create Password</h2>
          <button className="text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Create password for your device
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-4">
            <span className="block text-gray-700 text-sm mb-2">New password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full p-2 text-sm rounded border bg-[#F8F8F8] outline-none"
              /> 
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoEyeOutline/> :  <LuEyeOff />}
              </span>
            </div>
          </label>
          <label className="mb-4">
            <span className="block text-gray-700 text-sm mb-2">Confirm new password</span>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full p-2 text-sm rounded border bg-[#F8F8F8] outline-none"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <IoEyeOutline/> :  <LuEyeOff />}
              </span>
            </div>
          </label>
          <div className='mt-[20%]'>
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold bg-[#095D7E] rounded-full"
          >
            Submit
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePassword;
