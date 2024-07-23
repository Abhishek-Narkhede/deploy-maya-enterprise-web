import React, { useEffect, useState } from 'react';
import locationIcon from "../../assest/icons/locationIcon.png";
import magelocationIcon from "../../assest/icons/magelocationIcon.png";
import uploadIcon from "../../assest/icons/uploadIcon.png";
import searchIcon from "../../assest/icons/searchIcon.png";
import { apiGET, apiPOST } from '../../utilities/apiHelpers';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import './ChildNavbar.css';  // Import custom CSS for animations
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ChildNavbar = () => {
    const navigate = useNavigate()
    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [globalSearchLoading, setGlobalSearchLoading] = useState(false);
    const { userData } = useSelector((state) => state.user);
    const location = useLocation();
    const handleInputChange = (e) => {
        setGlobalSearchLoading(true);
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            const results = allProducts.filter(result =>
                result?.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredResults(results);
            setShowDropdown(true);
            setGlobalSearchLoading(false);
        } else {
            setShowDropdown(false);
            setGlobalSearchLoading(false);
        }
    };

    const handleResultClick = (item) => {
        setSearchTerm(item?.name);
        setShowDropdown(false);
        navigate(`/product/${item?._id}`)
    };

    const handleLocationSet = async () => {
        try {
            setLocationLoading(true);
            const response = await apiGET(`${API_URL}/v1/users/getUserIpDetails`);
            if (response?.data?.status) {
                setLocationData(response?.data?.data);
                setLocationLoading(false);
                toast.success("Location set successfully");
            } else {
                setLocationLoading(false);
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error("Error getting location details:", error);
            setLocationLoading(false);
        }
    };

    const getAllProduct = async () => {
        try {
            const payload = { "keyword": "" };
            const response = await apiPOST(`${API_URL}/v1/product/globalSearchProducts`, payload);
            if (response?.data?.status) {
                setAllProducts(response?.data?.data);
            } else {
                console.error("Something went wrong");
            }
        } catch (error) {
            console.error("Something went wrong", error);
        }
    };

    useEffect(() => {
        setSearchTerm('');
        setShowDropdown(false);
    }, [location]);

    useEffect(() => {
        getAllProduct();
    }, []);

    return (
        <div className='bg-[#F1F9FF]'>
            <nav className="container mx-auto p-4">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="lg:flex lg:items-center">
                        <div className="flex items-center bg-[#CCECEE] rounded-full lg:rounded-l-full h-10 px-3 text-blue-700">
                            <img src={locationIcon} alt="Location Icon" />
                            <div className='ml-2 whitespace-nowrap'>
                                {locationData ? `${locationData.city} ${locationData.postalCode}` : "Delhi 110010"}
                            </div>
                            {
                                locationLoading ? (
                                    <Loader width="w-4" height="h-4" padding="px-8" />
                                ) : (
                                    <img
                                        className='ml-10 mr-8 cursor-pointer transition duration-300 transform hover:scale-110'
                                        onClick={handleLocationSet}
                                        src={magelocationIcon}
                                        alt="Magelocation Icon"
                                    />
                                )
                            }
                        </div>
                        <div className="flex w-full lg:w-[630px] items-center relative lg:ml-[-35px] lg:my-0 my-3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleInputChange}
                                placeholder="Search Kidney Medicines"
                                className="w-full h-10 px-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
                            />
                            <div className="absolute right-2 p-2 rounded-md">
                                {globalSearchLoading ? (
                                    <Loader width="w-6" height="h-6" />
                                ) : (
                                    <img src={searchIcon} alt="Search Icon" />
                                )}
                            </div>
                            {showDropdown && (
                                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 dropdown-animation max-h-[320px] overflow-y-auto scrollbar-custom scroll-smooth">
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map((item, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => handleResultClick(item)}
                                            >
                                                {item?.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center py-4 text-gray-500">
                                            Not found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={() => userData ? navigate('/upload-prescription') : toast.info("Please login to proceed")} className="bg-[#14967F] w-full lg:w-52 h-10 text-white text-center flex justify-center items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition duration-300 transform hover:scale-105">
                        <img src={uploadIcon} alt="Upload Icon" />
                        <div className='text-center' >Upload Prescription</div>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default ChildNavbar;