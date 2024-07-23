import React, { useState } from "react";
import SimpleLoader from "../Loader/SimpleLoader";
import titlepre from '../../assest/image/Vector.svg';
import shopping from '../../assest/image/shopping.svg';
import { apiGET, apiPOST, apiPUT } from "../../utilities/apiHelpers";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import renderStars from "../../utilities/renderProductStars";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { setCartCount } from "../../redux/users/users";

const TopUnaniKidneyCareCard = ({ item, stepperProgressCartData, setStepperProgressCartData }) => {

    const [loading, setLoading] = useState(false)
    const [incrementLoader, setIncrementLoader] = useState(false)
    const [decrementLoader, setDecrementLoader] = useState(false)
    const isLoggedIn = useSelector((state) => state.user?.userData?.id) || false
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleIncrement = async (productId, productQuantity) => {
        const currentQuantity = fetchCartQuantity(productId);
        const id = fetchCartId(productId);
        console.log("handleIncrement cartId", id);
        if (currentQuantity < productQuantity) {
            const updatedQuantity = currentQuantity + 1;
            const payload = { quantity: updatedQuantity };

            try {
                setIncrementLoader(true)
                const response = await apiPUT(`/v1/cart/update/${id}`, payload);
                if (response.status) {
                    const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${isLoggedIn}`)
                    setStepperProgressCartData(stepperResponse.data?.data);
                    setIncrementLoader(false)
                } else {
                    setIncrementLoader(false)
                }
            } catch (error) {
                setIncrementLoader(false)
            }
        } else {
            toast.error('Cannot select quantity greater than remaining product quantity')
        }
    };

    const handleDecrement = async (productId) => {
        const currentQuantity = fetchCartQuantity(productId);
        const id = fetchCartId(productId);
        console.log("handleDecrement cartId", id);
        if (currentQuantity > 1) {
            const updatedQuantity = currentQuantity - 1;
            const payload = { quantity: updatedQuantity };

            try {
                setDecrementLoader(true)
                const response = await apiPUT(`/v1/cart/update/${id}`, payload);
                if (response.status) {
                    const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${isLoggedIn}`)
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

    const checkCartDataExists = (id) => {
        if (stepperProgressCartData && stepperProgressCartData?.cartData?.length != 0) {
            return stepperProgressCartData?.cartData?.some((item) => item.productDetails._id === id);
        }
    }

    const fetchCartQuantity = (id) => {
        if (stepperProgressCartData && stepperProgressCartData?.cartData?.length != 0) {
            const product = stepperProgressCartData?.cartData?.find((item) => item.productDetails._id === id);
            return product ? product.quantity : 0;
        }
    };

    const fetchCartId = (id) => {
        if (stepperProgressCartData && stepperProgressCartData?.cartData?.length != 0) {
            const product = stepperProgressCartData?.cartData?.find((item) => item.productDetails._id === id);
            return product ? product._id : 0;
        }
    };

    const addToCart = async (id) => {
        if (isLoggedIn) {
            console.log(id);
            try {
                const payload = {
                    productId: id,
                    userId: isLoggedIn,
                    quantity: 1
                }
                setLoading(true)
                const response = await apiPOST(`/v1/cart/add`, payload);
                if (response.status) {
                    const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${isLoggedIn}`)
                    if (stepperResponse?.data?.code == 400 && !stepperResponse?.data?.status) {
                        const stepperProgressAddPayload = {
                            orderMode: 'order'
                        }
                        const userStepperAddResponse = await apiPOST(`${API_URL}/v1/stepper-progress/add-stepper-progress/${isLoggedIn}`, stepperProgressAddPayload);
                        console.log("userStepperAddResponse", userStepperAddResponse);
                        setStepperProgressCartData(userStepperAddResponse.data?.data);
                        dispatch(setCartCount(userStepperAddResponse.data?.data?.cartData?.length))
                    } else {
                        setStepperProgressCartData(stepperResponse.data?.data);
                        dispatch(setCartCount(stepperResponse.data?.data?.cartData?.length))
                    }
                    toast.success("Product added to cart")
                    setLoading(false)
                }
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        } else {
            toast.error("Please Login First");
        }
    }


    return <div className={`border p-4 rounded-[16px] h-[350px] flex flex-col justify-between bg-[#FFFFFF] hover:shadow-xl group ${!item?.productQuantity ? 'opacity-65' : ''}`}>
        {/* Prescription badge */}
        <div className="flex items-center mb-2">
            {item?.isPrescription && <img src={titlepre} alt="Prescription Required" className=" mr-2" />}
            <span className="text-sm">{item?.isPrescription ? "Prescription Required" : ''}</span>
        </div>
        {/* Product image */}
        <div className={`flex justify-center ${!item.isPrescription ? "mt-3" : ''}`}>
            <img src={item?.bannerImg} alt={item.name} className="w-full h-32 object-cover rounded-md" />
        </div>
        {/* Product name */}
        <div className="">
            <label className="font-extrabold text-sm hover:cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>{item.name || "Product Name"}</label>
        </div>
        {/* Rating stars */}
        <div className="flex gap-2">
            {renderStars(item?.avgRating)}
        </div>
        {/* Price */}
        <div className="flex justify-between items-center mt-2">
            <div className='flex gap-2'>
                <span className="line-through text-gray-500">₹{item?.price ? item?.price : 0}</span>
                <span className="text-[#095D7E] font-semibold">₹{item?.discountedPrice ? item?.discountedPrice : 0}</span>
            </div>
            {item?.productQuantity !== 0 && <div>
                <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">{item?.productQuantity} left</span>
            </div>}
        </div>
        {/* Add to cart button */}
        {
            item?.productQuantity ? (!isLoggedIn ? <button className="w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 px-7 py-2 rounded-full group-hover:bg-[#14967F] group-hover:text-[#FFFFFF]" onClick={addToCart}>
                <img src={shopping} alt="Add to Cart" className="h-5 mr-2" />
                <span className="text-[#14967F] font-semibold text-xs group-hover:text-[#FFFFFF]">Add to cart</span>
            </button> : <>
                {
                    checkCartDataExists(item?._id) ? (
                        <div className="w-full flex items-center justify-between bg-gray-200 rounded-full">
                            {decrementLoader ? <SimpleLoader /> : <button
                                className="bg-[#14967F] text-white rounded-full w-[58px] h-full py-2 flex items-center justify-center focus:outline-none"
                                disabled={decrementLoader}
                                onClick={() => handleDecrement(item?._id)}
                            >
                                -
                            </button>}
                            <span className="mx-4 text-lg">{fetchCartQuantity(item?._id)}</span>
                            {incrementLoader ? <SimpleLoader /> : <button
                                className="bg-[#14967F] text-white rounded-full w-[58px] h-full py-2 flex items-center justify-center focus:outline-none"
                                disabled={incrementLoader}
                                onClick={() => handleIncrement(item?._id, item?.productQuantity)}
                            >
                                +
                            </button>}
                        </div>
                    ) : (loading ? <SimpleLoader /> : <button
                        className="w-full flex items-center justify-center bg-gray-200 px-7 py-2 rounded-full group-hover:bg-[#14967F] group-hover:text-[#FFFFFF]"
                        onClick={(e) => addToCart(item?._id)}
                    >
                        <img src={shopping} alt="Add to Cart" className="h-5 mr-2 group-hover:text-white group-hover:hidden" />
                        <span className="text-[#14967F] font-semibold text-xs group-hover:text-[#FFFFFF]">Add to cart</span>
                    </button>)
                }
            </>
            ) : <span class="w-full flex items-center justify-center bg-red-100 text-red-800 text-xs font-medium me-2 px-7 py-2 rounded-full dark:bg-yellow-900 dark:text-yellow-300 cursor-not-allowed">Out Of Stock</span>}
    </div>
}

export default TopUnaniKidneyCareCard;