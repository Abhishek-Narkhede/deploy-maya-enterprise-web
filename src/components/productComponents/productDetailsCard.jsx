
import React, { useState, useEffect } from 'react';
import presecriptionIcon from "../../assest/icons/prescriptionIcon.png";
import CartIcon from "../../assest/icons/whiteCartIcon.png";
import grayCircleIcon from "../../assest/icons/grayCircle.png";
import renderStars from "../../utilities/renderProductStars";
import { apiDELETE, apiGET, apiPOST, apiPUT } from "../../utilities/apiHelpers";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import { RiDeleteBinLine } from 'react-icons/ri';
import { setCartCount } from '../../redux/users/users';
import { API_URL } from '../../config';
import CustomLoader from '../Loader/CustomLoader';

const menuItems = [
    'Introduction',
    'Uses',
    'Therapeutic Effects',
    'Interaction',
    'More Information About',
    'How To Consume',
    'Safety Advice',
    'Side Effects',
    'Word of Advice'
];

const ProductDetailsCard = ({ productInformations, productData, stepperProgressCartData, setStepperProgressCartData }) => {

    // Initialize with the default active section ID
    const [activeSection, setActiveSection] = useState(null);

    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

    const [count, setCount] = useState(1);
    const [activeItem, setActiveItem] = useState('');
    const dispatch = useDispatch()
    const { id } = useParams()
    console.log(id)
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state) => state.user?.userData?.id) || false
    // const loggedInUserCartData = useSelector((state) => state.cart.cartData) || []
    const [incrementLoader, setIncrementLoader] = useState(false)
    const [decrementLoader, setDecrementLoader] = useState(false)
    const [deleteLoader, setDeleteLoader] = useState(false)
    const [addToCartloading, setAddToCartloading] = useState(false)
    const [selectedImage, setSelectedImage] = useState('');


    const stars = Array(5).fill('').map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill={i < productInformations?.productDetails?.avgRating ? "#F1C320" : "#CCECEE"}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.39 2.454a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.539 1.118l-3.39-2.454a1 1 0 00-1.175 0l-3.39 2.454c-.783.57-1.838-.197-1.539-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.535 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
    ));

    useEffect(() => {
        if (productData?.bannerImg) {
            setSelectedImage(productData.bannerImg);
        }
    }, [productData]);

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isScrollingUp = prevScrollPos > currentScrollPos;

            if (isScrollingUp) {
                setActiveSection(null);
            }

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

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
            toast.error('Cannot select quantity greater than product quantity')
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
            return stepperProgressCartData.cartData?.some((item) => item.productDetails._id === id);
        }
    }

    const fetchCartQuantity = (id) => {
        if (stepperProgressCartData && stepperProgressCartData?.cartData.length != 0) {
            const product = stepperProgressCartData.cartData.find((item) => item.productDetails._id === id);
            return product ? product.quantity : 0;
        }
    };

    const fetchCartId = (id) => {
        if (stepperProgressCartData && stepperProgressCartData?.cartData.length != 0) {
            const product = stepperProgressCartData.cartData.find((item) => item.productDetails._id === id);
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
                setAddToCartloading(true)
                const response = await apiPOST(`${API_URL}/v1/cart/add`, payload);
                if (response.status) {
                    setAddToCartloading(false)
                    const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${isLoggedIn}`)
                    if (stepperResponse?.data?.code == 400 && !stepperResponse?.data?.status) {
                        const stepperProgressAddPayload = {
                            orderMode: 'order'
                        }
                        const userStepperAddResponse = await apiPOST(`${API_URL}/v1/stepper-progress/add-stepper-progress/${isLoggedIn}`, stepperProgressAddPayload);
                        console.log("userStepperAddResponse", userStepperAddResponse);
                        setStepperProgressCartData(userStepperAddResponse.data?.data);
                        dispatch(setCartCount(userStepperAddResponse.data?.data?.cartData?.length))
                    } else {
                        setAddToCartloading(false)
                        setStepperProgressCartData(stepperResponse.data?.data);
                        dispatch(setCartCount(stepperResponse.data?.data?.cartData?.length))
                    }
                    toast.success("Product added to cart")
                }
            } catch (error) {
                console.log(error);
                setAddToCartloading(false)
            }
        } else {
            toast.error("Please Login First");
            setAddToCartloading(false)
        }
    }

    const handleRemoveCartItem = async (productId) => {
        try {
            const id = fetchCartId(productId);
            setDeleteLoader(true)
            const response = await apiDELETE(`/v1/cart/delete/${id}`);
            if (response.status) {
                const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${isLoggedIn}`)
                setStepperProgressCartData(stepperResponse.data?.data);
                setDeleteLoader(false)
                dispatch(setCartCount(stepperResponse.data?.data?.cartData?.length))
            } else {
                setDeleteLoader(false)
            }
        } catch (error) {
            setDeleteLoader(false)
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            let currentSection = '';
            menuItems.forEach(item => {
                const section = document.getElementById(item.replace(/\s+/g, '-').toLowerCase());
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 80 && rect.bottom >= 80) {
                        currentSection = item.replace(/\s+/g, '-').toLowerCase();
                    }
                }
            });
            setActiveItem(currentSection);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full max-h-[350px] lg:w-64 bg-white shadow-md rounded-lg p-4 mb-4 lg:mb-0">
                <ul>
                    {menuItems.map((item, index) => {
                        const id = item.replace(/\s+/g, '-').toLowerCase();
                        return (
                            <li key={index} className="my-2">
                                <a
                                    href={`#${id}`}
                                    className={`text-gray-800 hover:text-black flex justify-between ${activeItem === id ? 'text-gray-500' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(id);
                                    }}
                                >
                                    <span>{item}</span>
                                    <span>›</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className='w-full'>
                <div className="w-full bg-white shadow-lg rounded-lg ">
                    <div className='p-4'>
                        <div className='w-full gap-4 lg:flex'>
                            <div className='w-[100%]'>
                                <div className='border flex justify-center rounded-md'>
                                    <img className=" h-[350px]  w-full object-cover  rounded-md" src={selectedImage} alt="Ace Q10 Capsule" />
                                </div>
                                <div className="flex space-x-4">
                                    {productData?.images?.map((image, index) => (
                                        <div
                                            key={index}
                                            className="w-20 h-20 lg:w-24 lg:h-28 md:w-24 md:h-28 sm:w-24 sm:h-28 mt-4 border cursor-pointer"
                                            onClick={() => setSelectedImage(image)}
                                        >
                                            <img src={image} alt={`Product Image ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full p-1">
                                <div className="flex justify-between items-center mb-2">
                                    {productInformations?.productDetails?.isPrescription &&
                                        <div className="flex items-center">
                                            <img src={presecriptionIcon} alt="Prescription Icon" />
                                            <div className="ml-2 text-gray-700 text-xs">Prescription</div>
                                        </div>
                                    }
                                    <div className="text-gray-700 flex ">{renderStars(productData?.avgRating)}</div>
                                </div>
                                <div className="text-xl font-semibold text-2xl mb-4">{productData?.name}</div>
                                <div className="text-sm text-gray-600 mb-4 flex">
                                    <div className="font-semibold text-xs w-36">Marketer</div>
                                    <div className='text-xs'>: {productData?.marketer}</div>
                                </div>
                                <div className="text-sm text-gray-600 mb-4 flex">
                                    <div className="font-semibold text-xs w-36">Salt Composition</div>
                                    <div className='text-xs'>:{productData?.saltComposition}</div>
                                </div>
                                <div className="text-sm text-gray-600 mb-4 flex">
                                    <div className="font-semibold text-xs w-36">Origin of Medicine</div>
                                    <div className='text-xs'>: {productData?.origin}</div>
                                </div>
                                <hr />
                                <div className='w-full flex justify-between mt-4'>
                                    <div className="flex items-center">
                                        <div className="text-2xl font-bold text-gray-800 mr-2">₹{productData?.price}</div>
                                        <div className="text-lg line-through text-gray-500">₹{productData?.discountedPrice}</div>
                                    </div>
                                    {checkCartDataExists(id) && productData.productQuantity !== 0 && <div className="flex items-center">
                                        <div className="w-full flex items-center justify-between rounded-full">
                                            <button
                                                className="bg-[#F3F3F3] text-[#373435] rounded-[12px] w-[42px] h-full py-2 flex items-center justify-center focus:outline-none"
                                                onClick={() => handleDecrement(id)}
                                                disabled={decrementLoader}
                                            >
                                                {decrementLoader ? <CustomLoader width='w-5' height='h-5' /> : '-'}
                                            </button>
                                            <span className="mx-4 text-lg">{fetchCartQuantity(id)}</span>
                                            <button
                                                className="bg-[#F3F3F3] text-[#373435] rounded-[12px] w-[42px] h-full py-2 flex items-center justify-center focus:outline-none"
                                                onClick={() => handleIncrement(id, productData?.productQuantity)}
                                                disabled={incrementLoader}
                                            >
                                                {incrementLoader ? <CustomLoader width='w-5' height='h-5' /> : '+'}
                                            </button>
                                        </div>
                                    </div>}
                                </div>
                                <div className='lg:flex justify-between'>
                                    <div>{productData?.stripCapsuleQty} Capsule(S) In A Strip</div>
                                    {productData?.productQuantity !== 0 && <div>
                                        <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">{productData?.productQuantity} left</span>
                                    </div>}
                                </div>
                                {productData?.productQuantity ? (
                                    !isLoggedIn ? (
                                        <button button className="flex items-center justify-center w-full py-2 text-white bg-[#14967F] rounded-full hover:bg-teal-700 mt-4 transition duration-300 transform hover:scale-105" onClick={(e) => addToCart(id ? id : '')}>
                                            <img src={CartIcon} className="mr-2" alt="Cart Icon" />
                                            <span className="font-semibold">Add to Cart</span>
                                        </button>
                                    ) : (
                                        checkCartDataExists(id) ? (
                                            <div className="w-full flex gap-3 items-center justify-between mt-4 rounded-full">
                                                <button
                                                    className="bg-[#f0fdfa] text-[#14967F] rounded-full w-[70%] h-full py-2 px-10 flex items-center gap-3 justify-center focus:outline-none hover:bg-[#14967F] hover:shadow-lg hover:text-[#f0fdfa]"
                                                    onClick={() => navigate('/view-cart')}
                                                >
                                                    Go to Cart <GoArrowRight />
                                                </button>
                                                <button
                                                    className="bg-[#fecaca] text-[#dc2626] rounded-full w-[30%] h-full py-2 flex items-center gap-2 justify-center focus:outline-none  hover:shadow-lg"
                                                    onClick={() => handleRemoveCartItem(id)}
                                                    disabled={deleteLoader}
                                                >
                                                    {deleteLoader ? <CustomLoader width='w-5' height='h-5' /> : <><RiDeleteBinLine /> Remove</>}
                                                </button>
                                            </div>
                                        ) : (
                                            <button button className="flex items-center justify-center w-full py-2 text-white bg-[#14967F] gap-2 rounded-full hover:bg-teal-700 mt-4 transition duration-300 transform hover:scale-105" onClick={(e) => addToCart(id ? id : '')}>
                                                {addToCartloading ? <CustomLoader width='w-5' height='h-5' /> : <img src={CartIcon} className="mr-2" alt="Cart Icon" />}
                                                <span className="font-semibold">Add to Cart</span>
                                            </button>
                                        )
                                    )
                                ) : <span class="w-full flex items-center justify-center bg-red-100 text-red-800 text-xs font-medium me-2 px-7 py-4 mt-4 rounded-full dark:bg-yellow-900 dark:text-yellow-300 cursor-not-allowed">Out Of Stock</span>}
                            </div>
                        </div>

                    </div>
                </div>
                <div className='flex flex-col gap-4 mt-4'>
                    <div
                        id="introduction"
                        className={`bg-white shadow-md rounded-lg p-4 transition-margin ${activeSection === 'introduction' ? 'mt-24' : ''}`}
                        onClick={() => scrollToSection('introduction')}
                    >
                        <div className='font-bold mb-2'>Introduction to {productData?.name}</div>
                        <div className='text-[14px] font-medium'>{productInformations?.introduction}</div>
                    </div>
                    <div
                        id="uses"
                        className={`bg-white shadow-md rounded-lg p-4 transition-margin ${activeSection === 'uses' ? 'mt-24' : ''}`}
                    >
                        <div className='font-bold mb-2'>Uses of {productData?.name}</div>
                        <div className='text-[14px] font-medium'>{productInformations?.uses}</div>
                    </div>
                    <div
                        id="therapeutic-effects"
                        className={`bg-white shadow-md rounded-lg p-4 transition-margin ${activeSection === 'therapeutic-effects' ? 'mt-24' : ''}`}
                    >
                        <div className='font-bold mb-2'>Therapeutic Effects of {productData?.name}</div>
                        <div className='text-[14px] font-medium'>{productInformations?.therapeuticEffects}</div>
                    </div>
                    <div
                        id="interaction"
                        className={`bg-white shadow-md rounded-lg p-4 transition-margin ${activeSection === 'interaction' ? 'mt-24' : ''}`}
                    >
                        <div className='font-bold mb-2'>Interaction of {productData?.name}</div>
                        <div className='text-[14px] font-medium'>{productInformations?.interaction}</div>
                    </div>
                    <div
                        id="more-information-about"
                        className={`bg-white shadow-md rounded-lg p-4 transition-margin ${activeSection === 'more-information-about' ? 'mt-24' : ''}`}
                    >
                        <div className='font-bold mb-2'>More Information About {productData?.name}</div>
                        <div className='text-[14px] font-medium'>{productInformations?.moreInformationabout}</div>
                    </div>
                    <div
                        id="how-to-consume"
                        className={`bg-white shadow-md rounded-lg p-4 transition-margin ${activeSection === 'how-to-consume' ? 'mt-24' : ''}`}
                    >
                        <div className='font-bold mb-2'>How to consume {productData?.name}</div>
                        <div className='text-[14px] font-medium'>{productInformations?.howtoconsume}</div>
                    </div>
                    <div
                        id="safety-advice"
                        className={`bg-white shadow-md rounded-lg p-4 transition-margin ${activeSection === 'safety-advice' ? 'mt-24' : ''}`}
                    >
                        <div className='font-bold mb-2'>Safety Advice for {productData?.name}</div>
                        {productInformations?.safetyAdvices && Object.keys(productInformations.safetyAdvices).map((key, index) => (
                            <div key={index} className='flex mt-4 items-center'>
                                <img src={grayCircleIcon} className='h-9 w-9' alt="Icon" />
                                <div className='ml-4'>
                                    <div className='font-semibold text-xs'>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                    <div className="text-xs">{productInformations.safetyAdvices[key]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        id="side-effects"
                        className={`bg-white shadow-md rounded-lg p-4 transition-margin ${activeSection === 'side-effects' ? 'mt-24' : ''}`}
                    >
                        <div className='font-bold mb-2'>Side Effects of {productData?.name}</div>
                        <div className='text-[14px] font-medium'>{productInformations?.sideEffects}</div>
                    </div>
                    <div
                        id="word-of-advice"
                        className={`bg-white shadow-md rounded-lg p-4 transition-margin ${activeSection === 'word-of-advice' ? 'mt-24' : ''}`}
                    >
                        <div className='font-bold mb-2'>Word of Advice</div>
                        <div className='text-[14px] font-medium'>{productInformations?.wordofAdvice}</div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProductDetailsCard;
