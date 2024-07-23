import React, { useEffect, useState } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';
import { apiDELETE, apiGET, apiPUT } from '../utilities/apiHelpers';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import { setCartCount } from '../redux/users/users';
import { useDispatch, useSelector } from 'react-redux';


const CodSuccessPage = () => {
  const param = useParams()
  const [orderData, setOrderData] = useState('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.user.userData.id) || ''
  const getOrderData = async () => {
    try {
      const response = await apiGET(`${API_URL}/v1/order/${param?.id}`)
      if (response?.data?.status) {
        setOrderData(response.data.data[0])

        if (response.data.data[0].mode !== 'enquiry') {
          deleteUserStepperProgress()
        }

        const updateCodOrderPayload = {
          mode: "order"
        }
        const updateCodOrderResponse = await apiPUT(`/v1/order/update/${param?.id}`, updateCodOrderPayload);
        if (updateCodOrderResponse?.data?.status) {
          console.log("Order placed successfully")
        } else {
          console.log("Failed to place order")
        }
      } else {
        console.error("Something went wrong")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteUserStepperProgress = async () => {
    try {
      setLoading(true);
      const payload = {
        selectedAddress: null,
        selectedPrescription: null,
        cartData: [],
        currentStep: 0
      }
      const response = await apiPUT(`/v1/stepper-progress/update-stepper-progress/${userId}`, payload);
      if (response.status) {
        try {
          const response = await apiDELETE(`/v1/cart/remove-user-cart`);
          if (response.status) {
            console.log(response.data.data);
            dispatch(setCartCount(0))
          } else {
            console.log(response.data);
          }
        } catch (error) {
          toast.error('Error Removing Cart')
        }
        console.log("Delete response", response.data.data);
      }
    } catch (error) {
      console.error('Error fetching delete response info: ', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrderData()
  }, [])

  return (
    <div className="flex items-center justify-center mt-10 ">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <BiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-700 mb-4">Thank you for your order. Your order details are below:</p>
        <div className="text-left">
          <p><span className="font-semibold">Order ID:</span> {param?.id ? param?.id : "--"}</p>
          <p className='capitalize'><span className="font-semibold ">Customer Name:</span> {orderData ? orderData.userDetails?.name : "--"}</p>
          <p><span className="font-semibold">Total Amount:</span> ${orderData ? orderData?.totalPayment : "--"}</p>
        </div>
        <button className='bg-[#14967F] text-white font-semibold border w-full p-2 rounded-md my-4 transition duration-500 transform hover:scale-105 ' onClick={() => navigate("/orders")} >Go to orders</button>
      </div>
    </div>
  );
};

export default CodSuccessPage;
