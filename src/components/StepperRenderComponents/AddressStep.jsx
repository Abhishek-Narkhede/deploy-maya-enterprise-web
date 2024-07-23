import React, { useEffect, useState } from 'react';
import { MdOutlineLocationOn } from "react-icons/md";
import { apiGET, apiPUT } from '../../utilities/apiHelpers';
import { useSelector } from 'react-redux';
import Popup from '../Address/Popup';
import { toast } from 'react-toastify';
import AttachedPrescription from '../presecription/AttachedPrescription';
import scrollToTop from '../../utilities/scrollToTop';
import { API_URL } from '../../config';
import ButtonWithLoader from '../Button/ButtonWithLoader';

const AddressStep = ({ stepperProgressCartData, setStepperProgressCartData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const userId = useSelector((state) => state.user?.userData?.id) || "";
    const [addresses, setAddress] = useState([]);
    const [loading, setLoading] = useState(false)

    const getUserAddresses = async () => {
        const response = await apiGET(`/v1/address/getAddress/${userId}`)
        if (response.status) {
            console.log(response.data?.data);
            setAddress(response.data?.data)
        } else {
            console.error("Failed to fetch cart data", response);
        }
    }
    const handleSelect = async (address) => {
        console.log("Selected Address:", address);
        setSelectedAddress(address);
    }

    const setSelectedAddressFunc = async () => {
        if (selectedAddress) {
            setLoading(true)
            const updateStepperProgressPayload = {
                selectedAddress: selectedAddress,
                currentStep: 3
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
        } else {
            toast.error("Please select address")
            setLoading(false)
        }
    }

    useEffect(() => {
        scrollToTop()
        if (isOpen === false) {
            getUserAddresses()
        }
    }, [isOpen])

    return (
        <div className="flex flex-col lg:flex-row justify-between my-5 rounded-lg mx-auto p-5 shadow-lg bg-[#FFFFFF]">
            <div className="flex-1 mb-6 lg:mb-0 lg:mr-5">
                <h2 className="text-xl font-semibold mb-2">Address Details</h2>
                <p className="mb-4">Select from saved address</p>
                <div className='max-h-[500px] overflow-y-auto scrollbar-custom scroll-smooth p-2'>
                    {addresses?.map((address) => (
                        <div key={address._id} className={`flex items-center bg-[#F8F8F8] p-4 mb-4 rounded-lg shadow-md cursor-pointer ${selectedAddress?._id === address._id ? 'border-2 border-blue-500 ' : ''
                            }`}
                            onClick={() => handleSelect(address)}>
                            <div className="text-2xl mr-3"><MdOutlineLocationOn /></div>
                            <div>
                                <p className="font-bold">{address.zip}</p>
                                <p>{address.addressLine1}</p>
                                <p>{address.addressLine2}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex gap-2'>
                    <button onClick={() => setIsOpen(!isOpen)} className="mt-4 py-2 sm:px-4 px-2 bg-[#F1F9FF] text-[#14967F] text-sm sm:text-base rounded-[30px]">
                        + Add New Address
                    </button>
                    <ButtonWithLoader loading={loading} buttonText={"Submit"} onClick={setSelectedAddressFunc} width={"w-[100px]"} />

                    {/* <button onClick={setSelectedAddressFunc} className="mt-6 py-2 px-6 bg-[#14967F] text-white rounded-[30px] self-center lg:self-start">
                    Submit
                </button> */}
                </div>
            </div>
            <div className='lg:w-2/5 lg:border-l-2'>
                <AttachedPrescription type="cart" stepperProgressCartData={stepperProgressCartData} />
            </div>
            {isOpen && <Popup isOpen={isOpen} setIsOpen={setIsOpen} />}
        </div>
    );
};

export default AddressStep;
