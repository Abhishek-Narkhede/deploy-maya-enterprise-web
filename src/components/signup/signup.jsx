import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPOST } from "../../utilities/apiHelpers";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.name) {
      newErrors.name = "Full name is required";
      // toast.error(newErrors.name);
      isValid = false;
    } else if (!/^[a-zA-Z .'-]+$/.test(formData.name)) {
      newErrors.name = "Full name is invalid";
      // toast.error(newErrors.email);
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email address is required";
      toast.error(newErrors.email);
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
      // toast.error(newErrors.email);
      isValid = false;
    }

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

    if (!formData.password) {
      newErrors.password = "Password is required";
      // toast.error(newErrors.password);
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      // toast.error(newErrors.password);
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
      // toast.error(newErrors.password);
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
      // toast.error(newErrors.password);
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
      // toast.error(newErrors.password);
      isValid = false;
    } else if (!/[\W_]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
      // toast.error(newErrors.password);
      isValid = false;
    }

    return isValid ? {} : newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        let payload = {
          name: formData.name,
          email: formData.email,
          phoneNo: formData.phoneNo,
          password: formData.password,
        };
        setLoading(true);
        const response = await apiPOST("/v1/auth/signup", payload);
        console.log("response::::::::::", response);
        if (response.status === 201) {
          Swal.fire({
            title: "Success!",
            text: "Signup successful! OTP has been sent to your email address to verify your account",
            icon: "success",
          }).then(() => {
            navigate('/VerifyOTP', { state: formData });
          });
        } else {
          Toast.fire({
            title: "Error!",
            text: response.data?.data || "Something went wrong!",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("error", error);
        Toast.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred",
          icon: "error",
        });
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
      <div
        style={{ backgroundColor: "#F1F9FF" }}
        className=" hidden lg:block md:block flex-1 p-10 rounded-xl m-2 items-end"
      >
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
          <h2 className="text-2xl font-bold mb-4">Sign up</h2>
        </div>
        <p className="text-gray-600 text-xs mb-6">
          Get access to your orders, lab tests & doctor consultations
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-4">
            <span className="block text-gray-700 text-xs mb-2">Full name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Full Name"
              className="w-full p-3 rounded-[8px] text-xs bg-[#F8F8F8] outline-none"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </label>
          <label className="mb-4">
            <span className="block text-gray-700 text-xs mb-2">E-mail address</span>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email address"
              className="w-full p-3 rounded-[8px] text-xs bg-[#F8F8F8] outline-none"
             autoComplete="off"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </label>
          <label className="mb-4">
            <span className="block text-gray-700 text-xs mb-2">Phone Number</span>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className="w-full p-3 rounded-[8px] text-xs bg-[#F8F8F8] outline-none"
            />
            {errors.phoneNo && (
              <span className="text-red-500 text-sm">{errors.phoneNo}</span>
            )}
          </label>
          <label className="mb-4">
            <span className="block text-gray-700 text-xs mb-2">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full p-3 rounded-[8px] text-xs bg-[#F8F8F8] outline-none"
                 autoComplete="off"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </label>
          <button
            type="submit"
            className="w-full py-2 text-white font-normal text-sm bg-[#095D7E] rounded-full"
          >
            Submit
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#095D7E]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
