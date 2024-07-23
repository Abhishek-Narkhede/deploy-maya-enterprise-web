import React, { useState } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { LuEyeOff } from "react-icons/lu";
import { useSelector } from 'react-redux';
import { apiPOST } from '../../utilities/apiHelpers';
import ButtonWithLoader from '../../components/Button/ButtonWithLoader';
import { toast } from 'react-toastify';

function ChangePassword() {
    const [formData, setFormData] = useState({
        oldpassword: '',
        newpassword: '',
        cpassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const userEmail = useSelector((state) => state.user?.userData?.email) || '';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);
        if (formData.newpassword !== formData.cpassword) {
            toast.error('New passwords do not match');
            return;
        } else {
            try {
                const payload = {
                    email: userEmail,
                    ...formData
                }
                setLoading(true)
                const response = await apiPOST(`/v1/auth/new-password`, payload);
                console.log(response);
                if (response?.data?.status) {
                    toast.success('Password updated successfully');
                    setLoading(false)
                } else {
                    setLoading(false)
                    toast.error(response?.data?.data);
                }
            } catch (error) {
                setLoading(false)
                toast.error('Error updating password');
            }
        }
    };

    const toggleOldPasswordVisibility = () => {
        setShowOldPassword(!showOldPassword);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex max-w-4xl md:mx-auto mt-10 border rounded-lg overflow-hidden shadow-lg mx-5">
            {/* <div style={{ backgroundColor: '#F1F9FF' }} className=" hidden sm:hidden lg:block md:block flex-1 p-10 flex flex-col rounded-xl m-2 justify-end">
                <div className='mt-[70%]'>
                    <h2 className="text-2xl font-bold mb-4">Medicines, Home Delivered</h2>
                    <p className="text-xs text-gray-400">
                        Order any medicine or health product and we'll deliver it for free.
                        Enjoy discounts on everything.
                    </p>
                </div>
            </div> */}
            <div className="flex-1 p-10 bg-white">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold mb-4">Change Password</h2>
                    {/* <button className="text-gray-600 text-2xl font-bold">&times;</button> */}
                </div>
                <p className="text-gray-600 text-sm mb-6">
                    Change password for your account
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label className="mb-4">
                        <span className="block text-gray-700 text-sm mb-2">Old password</span>
                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                name="oldpassword"
                                value={formData.oldpassword}
                                onChange={handleChange}
                                placeholder="Old Password"
                                className="w-full p-2 text-sm rounded border bg-[#F8F8F8] outline-none"
                            />
                            <span
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                                onClick={toggleOldPasswordVisibility}
                            >
                                {showOldPassword ? <IoEyeOutline /> : <LuEyeOff />}
                            </span>
                        </div>
                    </label>
                    <label className="mb-4">
                        <span className="block text-gray-700 text-sm mb-2">New password</span>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newpassword"
                                value={formData.newpassword}
                                onChange={handleChange}
                                placeholder="New Password"
                                className="w-full p-2 text-sm rounded border bg-[#F8F8F8] outline-none"
                            />
                            <span
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <IoEyeOutline /> : <LuEyeOff />}
                            </span>
                        </div>
                    </label>
                    <label className="mb-4">
                        <span className="block text-gray-700 text-sm mb-2">Confirm new password</span>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="cpassword"
                                value={formData.cpassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                className="w-full p-2 text-sm rounded border bg-[#F8F8F8] outline-none"
                            />
                            <span
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <IoEyeOutline /> : <LuEyeOff />}
                            </span>
                        </div>
                    </label>
                    <div className='mt-[5%]'>
                        <ButtonWithLoader type={'submit'} loading={loading} buttonText={"Submit"} width={"w-full"} />
                        {/* <button
                            type="submit"
                            className="w-full py-2 text-white font-semibold bg-[#095D7E] rounded-full"
                        >
                            Submit
                        </button> */}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
