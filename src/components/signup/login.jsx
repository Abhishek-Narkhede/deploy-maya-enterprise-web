import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPOST } from '../../utilities/apiHelpers';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/users/users';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { IoEyeOutline } from "react-icons/io5";
import { LuEyeOff } from "react-icons/lu";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [Onclickphone, setOnclickphone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNo: ''
  });
  const [errors, setErrors] = useState({});

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.password) {
      newErrors.password = "Password is required";
      // toast.error(newErrors.password);
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      // toast.error(newErrors.password);
      isValid = false;
    }

    if (Onclickphone) {
      if (!formData.phoneNo) {
        newErrors.phoneNo = "Phone number is required";
        // toast.error(newErrors.phoneNo);
        isValid = false;
      } else if (!/^\d+$/.test(formData.phoneNo)) {
        newErrors.phoneNo = "Phone number must contain only numeric values";
        // toast.error(newErrors.phoneNo);
        isValid = false;
      } else if (formData.phoneNo.length !== 10) {
        newErrors.phoneNo = "Phone number must be exactly 10 digits";
        // toast.error(newErrors.phoneNo);
        isValid = false;
      }
    } else {
      if (!formData.email) {
        newErrors.email = "Email address is required";
        // toast.error(newErrors.email);
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email address is invalid";
        // toast.error(newErrors.email);
        isValid = false;
      }
    }

    return isValid ? {} : newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const payload = Onclickphone
          ? { phoneNo: formData.phoneNo, password: formData.password }
          : { email: formData.email, password: formData.password };
        setLoading(true);
        const response = await apiPOST("v1/auth/login", payload);
        if (response.status === 200) {
          dispatch(setUser(response?.data?.data?.user));
          toast.success("User Login Successfully");
          localStorage.setItem("accessToken", response?.data?.data?.tokens?.access?.token);
          localStorage.setItem("refreshToken", response?.data?.data?.tokens?.refresh?.token);
          navigate("/");
        } else if (response.status === 401) {
          toast.error(response?.data?.data?.msg || response?.data?.data || "Invalid credentials");
        } else if (response.status === 404) {
          toast.error(response?.data?.data?.msg || response?.data?.data || "Email Or Phone No Not Found");
        }
        else {
          console.log("else response", response);
          console.log("response?.data?.data", response?.data?.data);
          toast.error(response?.data?.data?.msg || response?.data?.data || "Invalid credentials");
          navigate("/VerifyOTP", { state: formData });
        }
      } catch (error) {
        console.log("error", error?.data?.msg);
        toast.error(error?.data?.msg || error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex max-w-4xl md:mx-auto mt-10 border rounded-lg overflow-hidden shadow-lg mx-5">
      <div style={{ backgroundColor: '#F1F9FF' }} className="hidden sm:hidden flex-1 p-10 flex flex-col flex-wrap md:block lg:block rounded-xl m-2 justify-end">
        <div className='mt-[100%]'>
          <h2 className="text-2xl font-bold mb-4">Medicines, Home Delivered</h2>
          <p className="text-xs text-gray-400">
            Order any medicine or health product and we'll deliver it for free.
            Enjoy discounts on everything.
          </p>
        </div>
      </div>
      <div className="flex-1 p-10 bg-white">
        <div className="flex justify-between">
          <h4 className='text-xl font-extrabold mb-2'>Log in</h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col mt-4">
          {Onclickphone ? (
            <label className="mb-4">
              <span className="block text-gray-700 mb-2">Enter phone number</span>
              <div className="relative">
                <input
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full p-3 rounded-[8px] text-xs bg-[#F8F8F8] outline-none"
                />
              </div>
              {errors.phoneNo && (
                <span className="text-red-500 text-sm">{errors.phoneNo}</span>
              )}
            </label>
          ) : (
            <label className="mb-4">
              <span className="block text-gray-700 text-sm mb-2">Enter Email address</span>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full p-3 rounded-[8px] text-xs bg-[#F8F8F8] outline-none"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </label>
          )}
          <label className="mb-4 mt-3">
            <span className="block text-gray-700 text-sm mb-2">Enter password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 rounded-[8px] text-xs bg-[#F8F8F8] outline-none"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoEyeOutline /> : <LuEyeOff />}
              </span>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </label>
          <div className='mt-[20%] mb-5 text-center'>
            <button
              type="submit"
              className="w-full py-2 text-white font-semibold bg-[#095D7E] rounded-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
        {Onclickphone ? (
          <>Or login with <button onClick={() => setOnclickphone(false)} className="text-[#095D7E]">Email</button></>
        ) : (
          <>Or login with <button onClick={() => setOnclickphone(true)} className="text-[#095D7E]">Phone Number</button></>
        )}
        <p className="mt-4 text-xs text-gray-600">
          New on MAYA ENTERPRISE? <Link to="/signup" className="text-[#095D7E]">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
