import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoEyeOutline } from "react-icons/io5";
import { LuEyeOff } from "react-icons/lu";
import { apiGET, apiPOST } from '../../utilities/apiHelpers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonWithLoader from '../Button/ButtonWithLoader';
import { Link } from 'react-router-dom';

function EditProfile() {
    const users = useSelector(state => state?.user.userData.id);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserData] = useState({
        name: '',
        email: '',
        phoneNo: '',
        password: ''
    });

    const fetchUserData = async () => {
        try {
            const response = await apiGET(`v1/users/${users}`);
            const { name, email, phoneNo, password } = response?.data?.data?.data
            setUserData({ name, phoneNo, email });
            console.log(response?.data?.data?.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userDetails,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await apiPOST(`v1/users/update-user`, userDetails);
            console.log(response);
            console.log("Updated user details:", userDetails);
            if (response.status === 200) {
                setLoading(false);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[793px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-wrap -mx-4">
                        <div className="flex-1 px-4">
                            <label className="block text-gray-700 text-xs">Full name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter full name"
                                value={userDetails.name}
                                onChange={handleChange}
                                className="mt-1 block w-full p-3 border text-xs outline-none border-gray-300 bg-[#F8F8F8] rounded"
                            />
                        </div>
                        <div className="flex-1 px-4">
                            <label className="block text-gray-700 text-xs">E-mail address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                value={userDetails.email}
                                onChange={handleChange}
                                className="mt-1 block w-full p-3 text-xs border outline-none border-gray-300 bg-[#F8F8F8] rounded"
                            />
                        </div>
                    </div>
                    <div className="w-full ">
                        <label className="block text-gray-700 text-xs">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNo"
                            placeholder="Enter mobile number"
                            value={userDetails.phoneNo}
                            onChange={handleChange}
                            className="mt-1 block w-[48%] p-3 text-xs border outline-none border-gray-300 bg-[#F8F8F8] rounded"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t-2 border-t-gray-200 space-x-4 px-4">
                        <Link to={'/change-password'} className="block text-gray-700 text-xs">Change Password</Link>
                        <div className='flex items-center gap-4 mx-auto'>
                            {/* <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={userDetails.password}
                                onChange={handleChange}
                                className="outline-none text-xs border-none h-[20px] w-[95px] bg-none! border-gray-300 rounded"
                            />
                            <button
                                type="button"
                                onClick={handlePasswordToggle}
                                className="text-gray-700 pr-10 focus:outline-none"
                            >
                                {showPassword ? <IoEyeOutline /> : <LuEyeOff />}
                            </button> */}
                            {/* <button type="submit" className="text-xs text-[#14967F]">
                                Update
                            </button> */}
                            <ButtonWithLoader loading={loading} type={'submit'} buttonText={"Update"} width={"w-[100px]"} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
