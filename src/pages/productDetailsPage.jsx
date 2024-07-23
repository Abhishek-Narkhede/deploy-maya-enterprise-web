import React, { useEffect, useState } from 'react';
import ProductDeyailsCard from '../components/productComponents/productDetailsCard';
import { apiGET } from '../utilities/apiHelpers';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from '../config';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import scrollToTop from '../utilities/scrollToTop';


const ProductDeyailsPage = () => {
    const { id } = useParams();
    const userId = useSelector((state) => state.user?.userData?.id) || '';
    const [productInformations, setProductInformations] = useState('');
    const [productData, setProductData] = useState(null);
    const [error, setError] = useState(null);
    const [stepperProgressCartData, setStepperProgressCartData] = useState([]);
    const params = useParams()


    const getProductInformation = async () => {
        try {
            const response = await apiGET(`${API_URL}/v1/product/get-product-details-information-by-product/${id}`);
            if (response?.data?.status) {
                setProductInformations(response?.data?.data);
                console.log(productInformations)
            } else {
                console.error("Something went wrong");
                setProductInformations(null);
            }
        } catch (error) {
            console.error("Something went wrong", error);
            setProductData(null);
        }
    };


    const getProductData = async () => {
        try {
            const response = await apiGET(`v1/product/get-product/${params.id}`);
            setProductData(response?.data?.data?.data?.product);
            console.log(productData)
            console.log()
        } catch (error) {
            setError(error.message || 'Error fetching data');
        }
    };

    const getUserStepperProgress = async () => {
        try {
            const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`)
            if (stepperResponse?.status) {
                setStepperProgressCartData(stepperResponse.data?.data);
            } else {
                toast.error('Error fetching product details');
            }
        } catch (error) {
            toast.error(error)
        }
    }



    useEffect(() => {
        scrollToTop()
        getProductInformation();
        getProductData();
        getUserStepperProgress();
    }, [id]);

    return (
        <div className="container mx-auto p-4">
            <nav class="text-gray-500 mb-4">
                <ol class="list-reset flex">
                    <li><Link to='/' class="text-[#817F7F] hover:underline">Home</Link></li>
                    <li><span class="mx-2">{">"}</span></li>
                    <li><Link to='/products' class="text-[#817F7F] hover:underline">All Products</Link></li>
                    <li><span class="mx-2">{">"}</span></li>
                    <li class="text-[#101010]">{productData?.name}</li>
                </ol>
            </nav>
            <ProductDeyailsCard productInformations={productInformations} productData={productData} stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />
        </div>

    );
};

export default ProductDeyailsPage;
