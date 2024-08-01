import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { FiMapPin } from 'react-icons/fi';
import { MdAdd } from "react-icons/md";
import { apiDELETE, apiGET } from '../../utilities/apiHelpers';
import { useSelector } from 'react-redux';
import Popup from '../Address/Popup';
import EditPopup from '../Address/EditPopup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddressCard = () => {
    const usersid = useSelector(state => state?.user.userData.id);
    const [addressData, setAddressData] = useState([]);
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const fetchAddress = async () => {
        try {
            const response = await apiGET(`v1/address/getAddress/${usersid}`);
            if (response?.data?.data) {
                setAddressData(response.data.data);
            } else {
                setAddressData([]);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchAddress();
    }, [usersid]);

    const handleEdit = (address) => {
        setSelectedAddress(address);
        setIsEditPopupOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await apiDELETE(`/v1/address/remove-address/${id}`);
            if (response.status === 200) {
                // Update state to reflect the deleted address
                setAddressData(addressData.filter(address => address._id !== id));
                toast.success('Address deleted successfully');
            } else {
                console.error('Error deleting address:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }

    };


    const handleAdd = () => {
        setIsPopupOpen(true);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-wrap items-center justify-center p-4">
            <div className=" bg-white p-8 rounded-lg shadow-md w-full max-w-[793px]">
                {addressData?.length !== 0 && addressData?.map((address, index) => (
                    <div key={index} className="bg-[#F8F8F8] text-xs p-4 rounded-lg shadow-md relative my-5 ">
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <FiMapPin className="text-xl text-[#095D7E] mb-2 md:mb-0" />
                            <div className="flex-1">
                                <div className="text-sm font-bold">{address?.zip}</div>
                                <div className="text-sm">{address?.addressLine1}</div>
                                <div className="text-sm">{address?.addressLine2}</div>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <button onClick={() => handleEdit(address)} className="text-green-500">
                                <AiOutlineEdit className="text-xl" />
                            </button>
                            <button onClick={() => handleDelete(address?._id)} className="text-red-500">
                                <AiOutlineDelete className="text-xl" />
                            </button>
                        </div>
                    </div>
                ))}
                <div className='flex mt-4 justify-end w-full '>
                    <button
                        onClick={handleAdd}
                        className="flex items-center justify-center text-center bg-[#F1F9FF] text-[#14967F] p-2 w-[182px] rounded-[30px]"
                    >
                        <span className="text-lg"><MdAdd /></span>
                        <span className="text-sm font-semibold ml-1">Add New Address</span>
                    </button>
                </div>
            </div>
            <Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} onUpdate={fetchAddress} />
            <EditPopup isOpen={isEditPopupOpen} setIsOpen={setIsEditPopupOpen} address={selectedAddress} onUpdate={fetchAddress} />
        </div>
    );
};

export default AddressCard;
