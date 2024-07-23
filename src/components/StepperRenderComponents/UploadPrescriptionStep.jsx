import React, { useState, useEffect } from "react";
import ShowSavedPrescription from "../presecription/ShowSavedPrescription";
import ValidPrescriptionFormat from "../presecription/ValidPrescriptionFormat";
import { apiGET, apiPOST, apiPUT } from '../../utilities/apiHelpers';
import { API_URL } from '../../config';
import { useDispatch, useSelector } from "react-redux";
import FileUploadInput from "../Input/FileUploadInput";
import { toast } from "react-toastify";
import scrollToTop from "../../utilities/scrollToTop";
import ButtonWithLoader from "../Button/ButtonWithLoader";

const UploadPrescriptionStep = ({ type, setCurrentStep, stepperProgressCartData, setStepperProgressCartData }) => {
    const dispatch = useDispatch()
    const [savedPrescription, setSavedPrescription] = useState([]);
    const [selectedImageIndexes, setSelectedImageIndexes] = useState([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState([]);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const userId = useSelector((state) => state.user?.userData?.id) || ""
    const [loading, setLoading] = useState(false);
    const checkIsPriscriptionMandatory = () => {
        return stepperProgressCartData?.cartData?.some((item) => item.productDetails?.isPrescription === true);
    }

    const getAllSavedPrescription = async () => {
        try {
            const response = await apiGET(`${API_URL}/v1/prescription/get-prescription-by-user/${userId}`);
            if (response?.data?.status) {
                setSavedPrescription(response?.data?.data?.data);
            } else {
                console.error("Something went wrong");
                setSavedPrescription([]);
            }
        } catch (error) {
            console.error("Something went wrong", error);
            setSavedPrescription([]);
        }
    };

    const selectedPrescription = async () => {
        if (checkIsPriscriptionMandatory()) {
            setLoading(true)
            if (selectedImageUrl.length) {
                const updateStepperProgressPayload = {
                    selectedPrescription: selectedImageUrl,
                    currentStep: 2
                }
                console.log("selectedImageUrl", selectedImageUrl);
                try {
                    const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, updateStepperProgressPayload);
                    console.log("userStepperAddResponse", userStepperAddResponse);
                    if (userStepperAddResponse.status) {
                        const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`)
                        setStepperProgressCartData(stepperResponse.data?.data);
                        setLoading(false)
                    }
                } catch (error) {
                    console.log("Error updating seleted prescription", error);
                    setLoading(false)
                }
                if (type == 'uploadPrescription') {
                    setCurrentStep();
                }
            }
            else {
                toast.error("Upload or Select Prescription to proceed")
                setLoading(false)
            }
        }
        else {
            console.log("Inside else", selectedImageUrl);
            const updateStepperProgressPayload = {
                currentStep: 2,
                selectedPrescription: selectedImageUrl
            }
            try {
                const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, updateStepperProgressPayload);
                console.log("userStepperAddResponse", userStepperAddResponse);
                if (userStepperAddResponse.status) {
                    const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`)
                    setStepperProgressCartData(stepperResponse.data?.data);
                    setLoading(false)
                }
            } catch (error) {
                console.log("Error updating seleted prescription", error);
                setLoading(false)
            }
        }
    }

    const uploadPrescription = async () => {
        try {
            const prescriptionPayload = {
                userId: userId,
                prescriptionImgUrl: uploadedFileUrl,
                title: "Test 1"
            }
            const prescriptionResponse = await apiPOST(`${API_URL}/v1/prescription/add-prescription-img`, prescriptionPayload);
            if (prescriptionResponse) {
                toast.success("Prescription Uploaded successfully!");
                setUploadStatus('File uploaded successfully!');
                console.log("prescriptionResponse", prescriptionResponse.data.data.data);
                getAllSavedPrescription()
            } else {
                setUploadStatus('Failed to upload file.');
            }
        } catch (error) {
            console.log("Error", error);
        }
    }

    useEffect(() => {
        scrollToTop()
        getAllSavedPrescription();
    }, [uploadStatus]); // Trigger fetch on initial render and whenever uploadStatus changes

    useEffect(() => {
        if (uploadedFileUrl) {
            uploadPrescription();
        }
    }, [uploadedFileUrl]); // Trigger fetch on initial render and whenever uploadStatus changes
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg mt-4 w-full">
            <label className="block mb-2 text-lg font-bold text-gray-700">
                Upload Prescription
            </label>
            <div className="md:flex justify-between w-full">
                <div className="flex flex-col w-full">
                    <FileUploadInput setUploadedFileUrl={setUploadedFileUrl} />
                    {
                        <ShowSavedPrescription
                            selectedImageIndexes={selectedImageIndexes}
                            savedPrescription={savedPrescription}
                            setSelectedImageIndexes={setSelectedImageIndexes}
                            setSelectedImageUrl={setSelectedImageUrl} />
                    }
                    <div className="flex justify-end">
                        <ButtonWithLoader loading={loading} buttonText={"Submit"} onClick={selectedPrescription} width={"w-[100px]"} />
                    </div>
                </div>
                <div className="border-l border-gray-300 ml-4 mr-8"></div>
                <div>
                    <ValidPrescriptionFormat />
                </div>
            </div>
        </div>
    );
}
export default UploadPrescriptionStep;
