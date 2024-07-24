import React, { useEffect, useState } from "react";
import AttachedPrescription from "../presecription/AttachedPrescription";
import { useDispatch, useSelector } from "react-redux";
import { apiGET, apiPUT } from "../../utilities/apiHelpers";
import { API_URL } from "../../config";
import ButtonWithLoader from "../Button/ButtonWithLoader";
import { toast } from "react-toastify";
import scrollToTop from "../../utilities/scrollToTop";

const ChooseMedicines = ({ setCurrentStep, stepperProgressCartData }) => {
    const [duration, setDuration] = useState(5);
    const [unit, setUnit] = useState('Days');
    const [selectedOption, setSelectedOption] = useState('asPerPrescription');
    const [loading, setLoading] = useState(false);
    const userId = useSelector((state) => state.user?.userData?.id) || ""
    const handleDurationChange = async (e) => {
        setDuration(e.target.value);
        const updateStepperProgressPayload = {
            prescriptionDuration: e.target.value
        }
        try {
            const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, updateStepperProgressPayload);
            console.log("userStepperAddResponse", userStepperAddResponse);
            if (userStepperAddResponse.status) {
                const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`)
            }
        } catch (error) {
            console.log("Error updating seleted prescription", error);
        }
    };

    const handleUnitChange = async (e) => {
        setUnit(e.target.value);
        const updateStepperProgressPayload = {
            prescriptionDurationUnit: unit
        }
        try {
            const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, updateStepperProgressPayload);
            console.log("userStepperAddResponse", userStepperAddResponse);
            if (userStepperAddResponse.status) {
                const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`)
            }
        } catch (error) {
            console.log("Error updating seleted prescription", error);
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };
    const handleNextStep = async () => {
        if (duration <= 0) {
            toast.error('Invalid Duration')
        } else {
            const updatePayload = {
                prescriptionType: selectedOption,
                prescriptionDuration: duration,
                prescriptionDurationUnit: unit,
            }
            try {
                setLoading(true);
                const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, updatePayload);
                console.log("userStepperAddResponse handleNextStep", userStepperAddResponse);
                if (userStepperAddResponse.status) {
                    setLoading(false)
                }
            } catch (error) {
                setLoading(false);
                console.log("Error updating seleted prescription", error);
            }
            setCurrentStep()
        }
    };

    useEffect(() => {
        scrollToTop()
    }, [])
    return <>
        <div className="p-6 mt-4 bg-white shadow-lg rounded-lg mx-auto">
            <h2 className="text-lg font-semibold mb-4">Choose Your Medicines</h2>
            <div className="flex lg:flex-row flex-col justify-between">
                <div>
                    <div className="mb-4">
                        <label className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="orderOption"
                                value="asPerPrescription"
                                checked={selectedOption === 'asPerPrescription'}
                                onChange={() => handleOptionChange('asPerPrescription')}
                                className="mr-2"
                            />
                            Order everything as per prescription
                        </label>
                        {selectedOption === 'asPerPrescription' && (
                            <div className="lg:flex items-center space-x-2">
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={handleDurationChange}
                                    className="w-26 p-2 border rounded-[40px] font-[600]"
                                />
                                <select
                                    value={unit}
                                    onChange={handleUnitChange}
                                    className="p-2 border rounded-[40px] bg-[#095D7E] text-white cursor-pointer"
                                >
                                    <option value="Days" className="cursor-pointer">Days</option>
                                    <option value="Weeks" className="cursor-pointer">Weeks</option>
                                    <option value="Months" className="cursor-pointer">Months</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="orderOption"
                                value="call"
                                checked={selectedOption === 'call'}
                                onChange={() => handleOptionChange('call')}
                                className="mr-2"
                            />
                            Ask Maya to call
                        </label>
                    </div>
                </div>
                <div className="lg:w-2/5 lg:border-l-2">
                    <AttachedPrescription type="uploadPrescription" stepperProgressCartData={stepperProgressCartData} />
                </div>
            </div>
            <ButtonWithLoader loading={loading} buttonText={"Next"} onClick={handleNextStep} width={"w-[100px]"} />
        </div>
    </>
}

export default ChooseMedicines;