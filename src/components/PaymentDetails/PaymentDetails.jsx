import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiGET, apiPUT } from "../../utilities/apiHelpers";
import { API_URL } from "../../config";
import ButtonWithLoader from "../Button/ButtonWithLoader";
import { toast } from "react-toastify";
const PaymentDetails = ({ item, setStepperProgressCartData, globalConfig }) => {
    const userId = useSelector((state) => state.user?.userData?.id);
    const [loading, setLoading] = useState(false)

    const isDataValid = () => {
        if (item && item?.cartData?.length !== 0) {
            return item?.cartData?.some((ele) => ele?.quantity > ele?.productDetails?.productQuantity);
        }
        return false;
    };

    const goToNextStep = async () => {
        if (item?.currentStep == 0) {
            if (!isDataValid()) {
                setLoading(true)
                const updatePayload = {
                    currentStep: 1
                }
                try {
                    const response = await apiPUT(`/v1/stepper-progress/update-stepper-progress/${userId}`, updatePayload);
                    if (response.status) {
                        const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`)
                        setStepperProgressCartData(stepperResponse.data?.data);
                        setLoading(false);
                    }
                } catch (error) {
                    console.log("Error Updating Stepper Response", error);
                    setLoading(false);
                }
            } else {
                toast.error('Order Quantity Is Invalid')
            }
        }
    };

    return <div className={`lg:w-1/2 h-full bg-white shadow-md rounded-lg p-6 ${item?.cartData?.length === 0 ? 'hidden' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
        <p className="flex justify-between text-gray-600 mt-4">
            <span>Cart Amount</span> <span>{globalConfig?.currencyData?.symbol}{item?.cartAmount}</span>
        </p>
        <p className="flex justify-between text-gray-600 mt-2">
            <span>Packaging Charges</span> <span>+ {globalConfig?.currencyData?.symbol}{globalConfig?.packagingCharges}</span>
        </p>
        <p className="flex justify-between text-gray-600 mt-2">
            <span>Delivery Charges</span> <span>+ {globalConfig?.currencyData?.symbol}{globalConfig?.deliveryCharges}</span>
        </p>
        <p className="flex justify-between text-[#14967F] mt-4 font-bold text-lg">
            <span>Total to pay</span> <span>{globalConfig?.currencyData?.symbol}{item?.totalCartAmount}</span>
        </p>
        <ButtonWithLoader loading={loading} buttonText={"Place Order"} onClick={goToNextStep} width={"w-full"} />
    </div>
}
export default PaymentDetails