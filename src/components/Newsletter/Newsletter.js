// src/Newsletter.js
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiGET, apiPOST, apiPUT } from "../../utilities/apiHelpers";
import { API_URL } from "../../config";
import { useSelector } from "react-redux";

const Newsletter = () => {
  const userId = useSelector((state) => state.user?.userData?.id) || '';
  const [email, setEmail] = useState('')
  // const [subscription, setSubscription] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubscription = async () => {
    if (userId) {
      if (validateEmail(email)) {
        setLoading(true);
        try {
          const addPayload = {
            userId: userId,
            email: email,
            isEmailSubscribed: true,
          };
          const response = await apiPOST(`${API_URL}/v1/email-subscribe/add`, addPayload);
          if (response?.data?.data?.emailSubscribe?.status) {
            toast.success(response?.data?.data?.emailSubscribe?.message);
            setEmail('');
          } else {
            toast.error(response?.data?.data?.emailSubscribe?.message || "Something went wrong");
          }
        } catch (error) {
          toast.error("An error occurred. Please try again.");
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("Please enter a valid email address");
      }
    } else {
      toast.error("User not logged in. Please login to subscribe to the newsletter.");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  // const getSUbscriptions = async () => {
  //   try {
  //     const response = await apiGET(`${API_URL}/v1/email-subscribe/get-by-user/${userId}`)
  //     if (response?.data?.status) {
  //       setSubscription(response?.data?.data?.data)
  //     } else {
  //       console.error("Failed to get subscribe");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   getSUbscriptions()
  // }, [userId])

  return (
    <div className="flex   justify-center items-center">
      <div className="bg-[#F1F9FF] rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
        <h2 className="lg:text-[32px] md:text-[30px] text-[25px] font-bold text-gray-800 mb-4">
          Join our newsletter
        </h2>
        <p className="text-[#095D7E] mb-10 text-[14px] ">
          Join over half a million vitamin lovers and get our latest deals,
          articles, and resources!
        </p>
        <div className="relative w-full max-w-[403px] flex items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email Address"
            className="w-full py-2 pl-3 pr-32 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="absolute right-0 bg-teal-600 text-white py-2 px-4 rounded-full hover:bg-teal-700 transform -translate-y-1/2"
            style={{ top: "50%" }}
            onClick={() => handleSubscription()}
          >
            <div className="flex gap-1 items-center">
              <div>
                {"Subscribe"}
              </div> {loading ? <div className={`w-4 h-4 border-2 border border-white rounded-full border-t-transparent animate-spin`}></div> : ""
              }
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Newsletter;
