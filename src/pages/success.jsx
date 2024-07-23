import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { apiGET, apiPOST, apiPUT } from '../utilities/apiHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { apiDELETE } from '../utilities/apiHelpers';
import { toast } from 'react-toastify';
import { setCartCount } from '../redux/users/users';
import { API_URL } from '../config';


const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const userId = useSelector((state) => state.user.userData.id) || ''

  const getSessionInfo = async (sessionId) => {

    try {
      setLoading(true);
      const response = await apiGET(`/v1/payment/get-session-info/${sessionId}`);
      if (response.status) {
        setData(response?.data?.data?.paymentIntent);
        if (response?.data?.data?.metadata?.orderId) {
          fetchOrderToRemoveCart(response?.data?.data?.metadata?.orderId)
          const updatePayload = {
            mode: response?.data?.data?.metadata?.orderMode,
            orderType: response?.data?.data?.metadata?.orderType,
            status: 'paid'
          }
          try {
            const orderUpdateResponse = await apiPUT(`${API_URL}/v1/order/update/${response?.data?.data?.metadata?.orderId}`, updatePayload)
            if (orderUpdateResponse?.status) {
            }
          } catch (error) {
            toast.error('Failed to update order')
          }
        }
        console.log("session data", response?.data?.data);
        handlePaymentHistory(response?.data?.data?.paymentIntent)
      }
    } catch (error) {
      console.error('Error fetching session info: ', error);
      toast.error('Error fetching session info');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderToRemoveCart = async (id) => {
    try {
      const orderResponse = await apiGET(`${API_URL}/v1/order/${id}`)
      console.log('fetchOrderToRemoveCart', orderResponse?.data);
      if (orderResponse?.status) {
        if (orderResponse?.data.data[0].mode !== 'enquiry' && orderResponse?.data.data[0].status !== 'paid') {
          console.log("Inside orderResponse?.data.data[0].mode !== 'enquiry'");
          deleteUserStepperProgress()
        }
      }
    } catch (error) {
      toast.error('Failed to fetch order')
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
      toast.error('Error fetching session info');
    } finally {
      setLoading(false);
    }
  }

  const handlePaymentHistory = async (data) => {
    console.log('Payment History???', data);
    try {
      const params = new URLSearchParams(location.search);
      const session_id = params.get('session_id');
      console.log("History required", userId, session_id);
      const paymentHistoryPayload = {
        "userId": userId,
        "amount": 233,
        "status": data?.status,
        "currency": data?.currency,
        "paymentId": data?.id,
        "session_id": session_id,
        "receipt_email": data?.receipt_email,
        "payment_method_types": data?.payment_method_types[0]
      }
      const historyResponse = await apiPOST(`${API_URL}/v1/payment-history/add`, paymentHistoryPayload)
      if (historyResponse?.data?.status) {
        console.log("payment history add success")
      } else {
        console.log("payment history add error")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      getSessionInfo(sessionId);
    }
  }, [location]);

  const formatCurrency = (amount, currency) => {
    let symbol = '';
    switch (currency) {
      case 'usd':
        symbol = '$';
        break;
      case 'inr':
        symbol = '₹';
        break;
      default:
        symbol = currency?.toUpperCase();
    }
    return `${symbol}${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="flex justify-center items-center p-4 font-poppins">
      {loading ? (
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-green-600"></div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="md:flex md:items-center md:space-x-6">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold mb-4">Payment confirmed successfully!</h2>
              <p className="text-gray-600 text-lg mb-6">
                Thank you for your payment! Your transaction is confirmed. If there's anything you need to know, please don't hesitate to reach out to us!
              </p>
              <button
                onClick={() => navigate('/')}
                className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                <BiArrowBack className="mr-2" /> Go back to home
              </button>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0 bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {data && formatCurrency(data.amount, data.currency)}
              </h2>
              <p className="text-green-600 text-lg mb-6 text-center">Payment success!</p>
              <div className="text-left">
                <h4 className="text-lg font-semibold mb-2">Payment details</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Date: <span className="font-semibold">{data && new Date(data.created * 1000).toLocaleString()}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Reference number: <span className="font-semibold">{data && data.id}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Amount: <span className="font-semibold">{data && formatCurrency(data.amount, data.currency)}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Payment status: <span className="font-semibold text-green-600">{data && 'Success'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
