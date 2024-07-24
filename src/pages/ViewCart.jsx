import React, { useEffect, useRef, useState } from "react";
import MyCartStepper from "../components/Steppers/MyCartStepper";
import MyCartStep from "../components/StepperRenderComponents/MyCartStep";
import UploadPrescriptionStep from "../components/StepperRenderComponents/UploadPrescriptionStep";
import AddressStep from "../components/StepperRenderComponents/AddressStep";
import OrderSummaryStep from "../components/StepperRenderComponents/OrderSummaryStep";
import PaymentStep from "../components/StepperRenderComponents/PaymentStep";
import { useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import { apiGET, apiPOST, apiPUT } from "../utilities/apiHelpers";
import { API_URL } from "../config";
import scrollToTop from "../utilities/scrollToTop";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ViewCart = () => {
    const location = useLocation();
    const prevLocationRef = useRef(location.pathname);
    const userId = useSelector((state) => state.user?.userData.id) || '';
    const [stepperProgressCartData, setStepperProgressCartData] = useState([]);
    const [globalConfig, setGlobalConfig] = useState([]);
    const steps = [
        'My Cart',
        'Upload Prescription',
        'Add Address',
        'Order Summary',
        'Payment'
    ];


    const goToPrevStep = async () => {
        if (stepperProgressCartData?.currentStep > 0) {
            const payload = {
                currentStep: stepperProgressCartData?.currentStep - 1
            }
            const response = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, payload);
            console.log(response.data.data);
            setStepperProgressCartData(response?.data?.data);
        }
    };

    const renderStepComponent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return <MyCartStep stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} globalConfig={globalConfig} />;
            case 1:
                return <UploadPrescriptionStep type="cart" stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} globalConfig={globalConfig} />;
            case 2:
                return <AddressStep stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} globalConfig={globalConfig} />;
            case 3:
                return <OrderSummaryStep stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} globalConfig={globalConfig} />;
            case 4:
                return <PaymentStep stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} globalConfig={globalConfig} />;
            default:
                return null;
        }
    };

    const getUserStepperProgress = async () => {
        try {
            const userStepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`);
            if (userStepperResponse?.data?.code == 400 && !userStepperResponse?.data?.status) {
                const stepperProgressAddPayload = {
                    orderMode: 'order'
                }
                const userStepperAddResponse = await apiPOST(`${API_URL}/v1/stepper-progress/add-stepper-progress/${userId}`, stepperProgressAddPayload);
                console.log("userStepperAddResponse", userStepperAddResponse);
                setStepperProgressCartData(userStepperAddResponse.data?.data);
            }
            else {
                setStepperProgressCartData(userStepperResponse.data?.data);
            }
            console.log("response", userStepperResponse);
        } catch (error) {
            console.error("Error fetching or creating stepper progress:", error);
        }
    }

    const resetCurrentStep = async () => {
        const payload = {
            currentStep: 0
        }
        const response = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, payload);
        if (response.status) {
            console.log('resetCurrentStep', response.data.data);
            setStepperProgressCartData(response?.data?.data);
        } else {
            toast.error("Error Updating the user stepper");
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
        scrollToTop();
        fetchGlobalConfig();
        getUserStepperProgress();
        console.log(stepperProgressCartData?.currentStep);
    }, [])

    useEffect(() => {
        if (prevLocationRef.current !== location.pathname) {
            resetCurrentStep();
            prevLocationRef.current = location.pathname;
        }
    }, [location.pathname]);

    return <div className="container mx-auto lg:p-4 p-2">
        <MyCartStepper steps={steps} currentStep={stepperProgressCartData?.currentStep} />
        {
            stepperProgressCartData?.currentStep > 0 && <button
                onClick={goToPrevStep}
                className="flex items-center justify-start gap-2 mt-2">
                <FaArrowLeftLong />Back to {steps[stepperProgressCartData?.currentStep - 1]}
            </button>
        }
        {renderStepComponent(stepperProgressCartData?.currentStep)}
    </div >
}

export default ViewCart;