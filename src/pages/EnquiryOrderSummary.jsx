import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { apiDELETE, apiGET, apiPOST, apiPUT } from "../utilities/apiHelpers";
import { API_URL } from "../config";
import scrollToTop from "../utilities/scrollToTop";
import ButtonWithLoader from "../components/Button/ButtonWithLoader";
import { useNavigate, useParams } from "react-router-dom";
import EnquiryCard from "../components/productComponents/EnquiryCard";
import EnquiryPaymentSummary from "../components/PaymentDetails/EnquirayPaymentSummary";
import EnquirayPrescription from "../components/presecription/EnquirayPrescription";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const EnquiryOrderSummary = () => {
    const param = useParams()
    const navigate = useNavigate();
    const userId = useSelector((state) => state.user?.userData?.id);
    const [loading, setLoading] = useState(false)
    const [enquirySummaryDetails, setEnquirySummaryDetails] = useState()
    const [selectedOption, setSelectedOption] = useState('online');
    const [globalConfig, setGlobalConfig] = useState([]);
    console.log("enquirySummaryDetails::>", enquirySummaryDetails)
    const getEnquiryData = async () => {
        try {
            const response = await apiGET(`${API_URL}/v1/order/${param?.id}`)
            setEnquirySummaryDetails(response?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleCheckout = async () => {
        setLoading(true)
        if (selectedOption === 'cod') {
            const updateCodOrderPayload = {
                orderType: selectedOption,
            }
            try {
                const updateCodOrderResponse = await apiPUT(`/v1/order/update/${param?.id}`, updateCodOrderPayload);
                if (updateCodOrderResponse?.data?.status) {
                    toast.success('Order Placed successfully')
                    setLoading(false);
                    navigate(`/cod-success-page/${updateCodOrderResponse?.data?.data?.id}`)
                } else {
                    toast.error('Something went wrong')
                }
            } catch (error) {
                console.log('Error adding COD order::', error)
                setLoading(false);
            }
        } else {
            try {
                const payload = {
                    mode: 'order',
                    orderType: selectedOption
                }
                const checkoutResponse = await apiPOST(`${API_URL}/v1/payment/create-checkout/${param?.id}`, payload);
                if (checkoutResponse.status) {
                    const checkoutUrl = checkoutResponse?.data?.data?.url;
                    console.log(checkoutUrl);
                    setLoading(false);
                    window.location.replace(checkoutUrl)
                } else {
                    console.error("Failed to create checkout session:", checkoutResponse.data);
                    setLoading(false);
                }

            } catch (error) {
                console.log("Error Placing order::", error);
                setLoading(false);
            }
        }
    }

    const fetchGlobalConfig = async () => {
        try {
            const response = await apiGET(`/v1/global-config/get-config`);
            if (response.status) {
                console.log(response?.data?.data?.data[0]);
                setGlobalConfig(response?.data?.data?.data[0]);
            } else {
                toast.error('Error fetching global config')
            }
        } catch (error) {
            toast.error('Error', error)
        }
    }

    useEffect(() => {
        getEnquiryData()
        fetchGlobalConfig()
    }, [])

    useEffect(() => {
        scrollToTop()
    }, [])
    return <div className="container mx-auto p-4 bg-white">
        {/* <div className="text-2xl font-bold my-4">Order List {enquirySummaryDetails[0]?.orderItemData?.length?enquirySummaryDetails[0]?.orderItemData?.length:"0"} items</div> */}
        <div className="flex gap-5">
            <div className="">
                {enquirySummaryDetails?.length ?
                    <EnquiryCard cardItem={enquirySummaryDetails[0]?.orderItemData} />
                    : ""
                }
                <div className="">
                    <h2 className="text-2xl font-bold text-[18px]">Select Your Payment Method</h2>
                    <div className="space-y-4 p-4">
                        <div className={`flex items-center p-4 border rounded-lg bg-[#FFFFFF] ${selectedOption === 'online' ? 'border-green-500' : 'border-gray-300'}`}>
                            <input
                                type="radio"
                                id="payOnline"
                                name="paymentOption"
                                value="online"
                                checked={selectedOption === 'online'}
                                onChange={handleOptionChange}
                                className="form-radio h-5 w-5 text-green-500 cursor-pointer"
                            />
                            <label htmlFor="payOnline" className="ml-3 text-lg cursor-pointer font-medium">
                                Pay Online
                            </label>
                        </div>
                        <div className={`flex items-center p-4 border rounded-lg bg-[#FFFFFF] ${selectedOption === 'cod' ? 'border-green-500' : 'border-gray-300'}`}>
                            <input
                                type="radio"
                                id="cashOnDelivery"
                                name="paymentOption"
                                value="cod"
                                checked={selectedOption === 'cod'}
                                onChange={handleOptionChange}
                                className="form-radio h-5 w-5 text-green-500 cursor-pointer"
                            />
                            <label htmlFor="cashOnDelivery" className="ml-3 text-lg cursor-pointer font-medium">
                                Cash on Delivery
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end w-full">
                    <ButtonWithLoader loading={loading} buttonText={`${selectedOption === 'cod' ? "Place order" : "Proceed to payment"}`} width={"w-[200px]"} onClick={handleCheckout} />
                </div>

            </div>
            <div className="flex flex-col lg:w-1/2">
                <EnquiryPaymentSummary enquirySummaryDetails={enquirySummaryDetails} globalConfig={globalConfig} />
                <EnquirayPrescription prescription={enquirySummaryDetails} />
            </div>
        </div>
    </div>
}

export default EnquiryOrderSummary;