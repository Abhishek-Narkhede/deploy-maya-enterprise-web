import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { apiGET, apiPOST, apiPUT } from '../utilities/apiHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { apiDELETE } from '../utilities/apiHelpers';
import { toast } from 'react-toastify';
import { setCartCount } from '../redux/users/users';
import { API_URL } from '../config';


const PaymentCancel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const location = useLocation();
    const hasFetched = useRef(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const userId = useSelector((state) => state.user.userData.id) || ''


    return (
        <div className="flex justify-center items-center p-4 font-poppins bg-gray-50">
            {loading ? (
                <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-red-600"></div>
            ) : (
                <div className="bg-white md:w-1/2  rounded-lg p-6 shadow-md">
                    <div className="md:flex md:items-center md:justify-center md:space-x-6">
                        <div className="">
                            <h2 className="text-2xl font-semibold mb-4 text-center text-red-600">Payment Cancelled!</h2>
                            <p className="text-gray-600 text-lg mb-6">
                                Unfortunately, your payment process was interrupted and has been cancelled. If you intended to complete this transaction, please try again or contact our support team for assistance. We apologize for any inconvenience this may have caused.
                            </p>
                            <p className="text-gray-600 text-lg mb-6">
                                If you have any questions or need further assistance, our support team is here to help. Thank you for your understanding and patience.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg transition"
                            >
                                <BiArrowBack className="mr-2" /> Go back to home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentCancel;
