import React, { useState, useEffect } from 'react';
import SortByAlphabet from '../components/SortByAlphabet/SortByAlphabet';
import Pagination from '../components/Pagination/Pagination';
import { apiGET, apiPOST } from '../utilities/apiHelpers';
import { toast } from 'react-toastify';
import 'tailwindcss/tailwind.css';
import KidneyMedicinesCard from '../components/kidneyMedicines/KidneyMedicinesCard';
import { useParams } from 'react-router-dom';
import scrollToTop from '../utilities/scrollToTop';
import { useDispatch, useSelector } from 'react-redux';
import { setCartCount } from '../redux/users/users';

const BrandProducts = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [stepperProgressCartData, setStepperProgressCartData] = useState([]);
    const userId = useSelector((state) => state.user?.userData?.id) || '';
    const dispatch = useDispatch()

    const [pagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
    });
    const [selectedLetter, setSelectedLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    console.log(id)


    const getUserStepperProgress = async () => {
        if (userId) {
            try {
                const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`)
                setStepperProgressCartData(stepperResponse.data?.data);
                dispatch(setCartCount(stepperResponse.data?.data?.cartData.length));
            } catch (error) {
                console.log("Error fetching cart details", error);
            }
        }
    }

    const getBrandData = async (sortIndex = '', page = 1) => {
        try {
            const payload = {
                sortIndex,
                limit: 10,
                page,
            };

            const response = await apiPOST(`/v1/product/getProductsByBrandId/${id}`, payload);
            setProducts(response.data.data.product);
            setPagination({
                totalProducts: response?.data?.data?.pagination?.totalProducts,
                totalPages: response?.data?.data?.pagination?.totalPages,
                currentPage: response?.data?.data?.pagination?.currentPage,
                pageSize: response?.data?.data?.pagination?.pageSize,
            });
            console.log("Response:", response);
            console.log(products)
        } catch (error) {
            setError(error.message || 'Error fetching data');
        }
    };

    useEffect(() => {
        scrollToTop();
        getBrandData();
        getUserStepperProgress();
    }, []);



    useEffect(() => {
        getBrandData(selectedLetter);
    }, [selectedLetter]);

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        getBrandData(letter, 1);
    };

    const handlePageChange = (page) => {
        getBrandData(selectedLetter, page);
    };

    useEffect(() => {
        getBrandData("");
    }, []);


    return (
        <div className="container mx-auto p-4">
            <SortByAlphabet onLetterClick={handleLetterClick} />
            <h2 className={`${pagination?.totalProducts === 0 ? 'hidden' : ''}`}>Showing {pagination?.pageSize * (pagination?.currentPage - 1) + 1}-{Math.min(pagination?.pageSize * pagination?.currentPage, pagination?.totalProducts)} of {pagination.totalProducts} results</h2>


            {/* {JSON.stringify(pagination)} */}
            {loading ?
                <div className="flex justify-center items-center">
                    <div className="loader">Loading...</div>
                </div>
                :
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-1'>
                    {products?.length ? (
                        products.map((item) => (
                            <KidneyMedicinesCard key={item.id} item={item} stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />
                        ))
                    ) : (
                        <div className='col-span-full flex justify-center items-center'>
                            <div className='border  border-[#095D7E] py-5 px-20 rounded-lg shadow-md text-center'>
                                Not Found
                            </div>
                        </div>
                    )}
                </div>

            }
            <Pagination
                currentPage={pagination?.currentPage}
                totalPages={pagination?.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default BrandProducts;
