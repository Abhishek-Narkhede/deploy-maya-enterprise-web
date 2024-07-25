import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PaymentSummary from "../PaymentDetails/PaymentSummary";
import AttachedPrescription from "../presecription/AttachedPrescription";
import { apiPOST } from "../../utilities/apiHelpers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import scrollToTop from "../../utilities/scrollToTop";
import ButtonWithLoader from "../Button/ButtonWithLoader";

const PaymentStep = ({ stepperProgressCartData, setStepperProgressCartData, globalConfig }) => {
    const userId = useSelector((state) => state.user?.userData?.id);
    const [selectedOption, setSelectedOption] = useState('online');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const addOrderAndItems = async () => {
        setLoading(true);
        if (selectedOption === 'cod') {
            const addCodOrderPayload = {
                userId,
                addressId: stepperProgressCartData?.selectedAddress?._id,
                prescriptionId: stepperProgressCartData?.selectedPrescription[0]?._id,
                orderType: selectedOption,
                mode: 'order',
                totalPayment: stepperProgressCartData?.totalCartAmount
            }
            try {
                const addCodOrderResponse = await apiPOST(`/v1/order/add`, addCodOrderPayload);
                if (addCodOrderResponse) {
                    if (addCodOrderResponse?.data?.data && stepperProgressCartData?.cartData?.length) {
                        toast.success('Order Placed successfully')
                        stepperProgressCartData?.cartData && stepperProgressCartData?.cartData?.length !== 0 && stepperProgressCartData?.cartData?.map(async (item) => {
                            console.log(addCodOrderResponse?.data);
                            const addOrderItemPayload = {
                                orderId: addCodOrderResponse?.data?.data?.id,
                                productId: item?.productId,
                                quantity: item?.quantity,
                            }
                            try {
                                const orderItemResponse = await apiPOST(`/v1/order-item/add`, addOrderItemPayload);
                                if (orderItemResponse) {
                                    setLoading(false);
                                    navigate(`/cod-success-page/${addCodOrderResponse?.data?.data?.id}`)
                                }
                            } catch (error) {
                                console.log("Error Order Adding Item::", error);
                            }
                        })
                    }
                }
            } catch (error) {
                console.log('Error adding COD order::', error)
                setLoading(false);
            }
        } else {
            try {
                const addOrderPayload = {
                    userId,
                    addressId: stepperProgressCartData?.selectedAddress?._id,
                    prescriptionId: stepperProgressCartData?.selectedPrescription[0]?._id,
                    orderType: selectedOption,
                    mode: 'order',
                    totalPayment: stepperProgressCartData?.totalCartAmount
                }
                let addOrderResponse;
                try {
                    addOrderResponse = await apiPOST(`/v1/order/add`, addOrderPayload);

                } catch (error) {
                    console.log("Error Placing order::", addOrderResponse);
                }
                if (addOrderResponse && addOrderResponse.status) {
                    toast.success('Order added successfully')
                    setLoading(false);
                    if (addOrderResponse?.data?.data && stepperProgressCartData?.cartData?.length) {
                        stepperProgressCartData?.cartData && stepperProgressCartData?.cartData?.length !== 0 && stepperProgressCartData?.cartData?.map(async (item) => {
                            console.log(addOrderResponse?.data);
                            const addOrderItemPayload = {
                                orderId: addOrderResponse?.data?.data?.id,
                                productId: item?.productId,
                                quantity: item?.quantity,
                            }
                            try {
                                const orderItemResponse = await apiPOST(`/v1/order-item/add`, addOrderItemPayload);
                            } catch (error) {
                                console.log("Error Order Adding Item::", error);
                            }
                        })
                        console.log("addOrderResponse::", addOrderResponse?.data?.data);
                        if (addOrderResponse?.data?.data?.id) {
                            setLoading(true)
                            const payload = {
                                mode: 'order',
                                orderType: selectedOption
                            }
                            const checkoutResponse = await apiPOST(`/v1/payment/create-checkout/${addOrderResponse?.data?.data?.id}`, payload);
                            console.log('checkoutResponse', checkoutResponse);
                            if (checkoutResponse.status) {
                                setLoading(false)
                                const checkoutUrl = checkoutResponse?.data?.data?.url;
                                console.log(checkoutUrl);
                                window.location.replace(checkoutUrl)
                            } else {
                                console.error("Failed to create checkout session:", checkoutResponse.data);
                                toast.error('Failed to create checkout session');
                                setLoading(false)
                            }
                        }
                    }
                } else {
                    console.log("Error adding order")
                    setLoading(false)
                }
            } catch (error) {
                toast.error('Error', error)
                setLoading(false)
            }
        }
    };

    useEffect(() => {
        scrollToTop()
    }, [])
    return <div>
        <div className="lg:flex gap-5 my-4">
            <div className="lg:w-1/2 flex flex-col">
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
                <div className={`${stepperProgressCartData?.cartData?.length === 0 ? 'hidden' : 'lg:ml-auto'}`}>
                    <ButtonWithLoader loading={loading} buttonText={`${selectedOption === 'cod' ? "Place order" : "Proceed to payment"}`} onClick={addOrderAndItems} width={"w-[200px]"} />
                </div>
                {/* <button className="bg-[#14967F] font-[600] text-[#FFFFFF] w-[200px] rounded-[30px] p-2 self-end" onClick={addOrderAndItems}>Proceed to Payment</button> */}
            </div>
            <div className="flex flex-col lg:w-1/2">
                <PaymentSummary type="summary" item={stepperProgressCartData ? stepperProgressCartData : []} globalConfig={globalConfig} />
                <AttachedPrescription type="cart" stepperProgressCartData={stepperProgressCartData} />
            </div>
        </div>
    </div>
}

export default PaymentStep;