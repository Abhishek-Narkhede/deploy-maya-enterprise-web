// src/ProductCard.js
import React, { useState } from 'react';
import { apiDELETE, apiGET, apiPUT } from '../../utilities/apiHelpers';
import { useDispatch, useSelector } from 'react-redux';
import CustomLoader from '../Loader/CustomLoader';
import { toast } from 'react-toastify';
import { setCartCount } from '../../redux/users/users';

const ProductCardofCart = ({ item, onQuantityChange, onDelete, stepperProgressCartData, setStepperProgressCartData }) => {
    const userId = useSelector((state) => state.user?.userData?.id);
    const [incrementLoader, setIncrementLoader] = useState(false)
    const [decrementLoader, setDecrementLoader] = useState(false)
    const [deleteItemLoader, setDeleteItemLoader] = useState(false)
    const dispatch = useDispatch();
    const handleRemoveCartItem = async (id) => {
        try {
            setDeleteItemLoader(true)
            const response = await apiDELETE(`/v1/cart/delete/${id}`);
            if (response.status) {
                const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`)
                setStepperProgressCartData(stepperResponse.data?.data);
                dispatch(setCartCount(stepperResponse.data?.data?.cartData?.length))
                toast.success('Cart item removed successfully!')
                setDeleteItemLoader(false)
            } else {
                setDeleteItemLoader(false)
            }
        } catch (error) {
            setDeleteItemLoader(false)
        }
    };

    const handleQuantityChange = async (type, id, quantity, productQuantity) => {
        // Increment case: ensure quantity does not exceed productQuantity
        if (type === 'increment' && quantity < productQuantity) {
            const updatedQuantity = quantity + 1;
            const payload = { quantity: updatedQuantity };
            console.log(quantity, productQuantity, type, id);
            try {
                setIncrementLoader(true)
                const response = await apiPUT(`/v1/cart/update/${id}`, payload);
                if (response.status) {
                    const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`);
                    setStepperProgressCartData(stepperResponse.data?.data);
                    setIncrementLoader(false)
                } else {
                    setIncrementLoader(false)
                }
            } catch (error) {
                setIncrementLoader(false)
            }
        } else if (type === 'increment') {
            toast.error('Cannot select quantity greater than remaining product quantity')
        }

        if (type === 'decrement' && quantity > 1) {
            const updatedQuantity = quantity - 1;
            const payload = { quantity: updatedQuantity };
            console.log(quantity, productQuantity, type, id);
            try {
                setDecrementLoader(true)
                const response = await apiPUT(`/v1/cart/update/${id}`, payload);
                if (response.status) {
                    const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`);
                    setStepperProgressCartData(stepperResponse.data?.data);
                    setDecrementLoader(false)
                } else {
                    setDecrementLoader(false)
                }
            } catch (error) {
                setDecrementLoader(false)
            }
        }
    };

    return (
        <div className="sm:flex lg:p-4 p-2 bg-white shadow-md rounded-lg mb-4">
            <img
                className="sm:w-24 sm:h-24 object-cover object-center"
                src={`${item?.productDetails?.bannerImg}`}
                alt="Ace Q10 Capsule"
            />
            <div className="ml-4 flex-grow">
                <h3 className="sm:text-lg text-md font-semibold text-gray-800">{item?.productDetails?.name}</h3>
                <p className="text-sm text-gray-600">
                    <span className="font-bold sm:text-base text-sm">Marketer: </span>{item?.productDetails?.marketer}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-bold sm:text-base text-sm">Salt Composition: </span>
                    {item?.productDetails?.saltComposition}
                </p>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                        {[...Array(4)].map((_, i) => (
                            <svg
                                key={i}
                                className="w-4 h-4 text-yellow-500 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15l-5.878 3.09 1.122-6.545L0 7.27l6.561-.953L10 0l3.439 6.317L20 7.27l-5.244 4.275 1.122 6.545z" />
                            </svg>
                        ))}
                        <svg
                            className="w-4 h-4 text-gray-300 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 15l-5.878 3.09 1.122-6.545L0 7.27l6.561-.953L10 0l3.439 6.317L20 7.27l-5.244 4.275 1.122 6.545z" />
                        </svg>
                    </div>
                    <div>
                        <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">{item?.productDetails?.productQuantity} left</span>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className="flex justify-between w-full items-center mt-4">
                        <div className='flex items-center'>
                            <div className="flex items-center">
                                <span className="sm:text-lg text-sm text-gray-500 line-through mr-2">₹{item?.productDetails?.price}</span>
                                <span className="sm:text-lg text-sm font-bold text-blue-600">₹{item?.productDetails?.discountedPrice}</span>
                            </div>
                            <div className='ml-4 flex items-center'>
                                <button className="px-3 py-1 bg-gray-200 rounded-md" onClick={() => handleQuantityChange('decrement', item?._id, item?.quantity, item?.productDetails?.productQuantity)} disabled={incrementLoader}>{decrementLoader ? <CustomLoader width='w-5' height='h-5' /> : '-'}</button>
                                <span className="px-3 sm:text-lg text-sm">{item?.quantity}</span>
                                <button className="px-3 py-1 bg-gray-200 rounded-md" onClick={() => handleQuantityChange('increment', item?._id, item?.quantity, item?.productDetails?.productQuantity)} disabled={incrementLoader}>{incrementLoader ? <CustomLoader width='w-5' height='h-5' /> : '+'} </button>
                            </div>
                        </div>
                        {
                            deleteItemLoader ? <CustomLoader width='w-5' height='h-5' /> : <button className="lg:p-2 mx-auto sm:mx-0 text-red-500" onClick={() => handleRemoveCartItem(item?._id)}>
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M3 6l3 18h12l3-18H3zm18-4h-5.58L15 0h-6l-.42 2H3v2h18V2z" />
                                </svg>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardofCart;
