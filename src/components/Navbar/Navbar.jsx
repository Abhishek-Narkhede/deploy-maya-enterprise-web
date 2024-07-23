import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../redux/users/users';
import { toast } from 'react-toastify';
import userIcon from "../../assest/icons/userIcon.png";
import loggedUserIcon from "../../assest/icons/loggedUserIcon.png";
import cartIcon from "../../assest/icons/cartIcon.png";
import { apiGET } from '../../utilities/apiHelpers';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const cartCount = useSelector((state) => state.user.cartCount) || 0;
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setUserInfo(!userInfo);
  };

  const handleLogout = () => {
    dispatch(removeUser());
    localStorage.clear();
    navigate("/login");
    toast.success("Logged out");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setUserInfo(false);
    }
  };

  // const navigateToViewCart = async () => {
  //   try {
  //     if (!userData?.id) {
  //       toast.info('Please login to proceed')
  //     }
  //     // const response = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userData.id}`)
  //     if (!cartCount) {
  //       toast.error('Cart is Empty')
  //     } else {
  //       navigate('/view-cart')
  //     }
  //   } catch (error) {
  //     toast.error('Error Fetching Stepper Info')
  //   }
  // }
  const navigateToViewCart = async () => {
    try {
      if (!userData?.id) {
        toast.info('Please login to proceed');
      } else if (userData?.id && !cartCount) {
        toast.error('Cart is Empty');
      } else {
        navigate('/view-cart');
      }
    } catch (error) {
      toast.error('Error Fetching Stepper Info');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full sticky bg-white shadow-md top-0 z-50">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
              <div className="text-teal-600 text-xl font-bold">MAYA </div>
              <div className="text-teal-600 text-xl font-bold">ENTERPRISE</div>
            </div>
            <div className="md:ml-10 lg:ml-20 hidden w-full  md:flex">
              <div onClick={() => navigate('/')} className="cursor-pointer text-gray-900 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Home</div>
              <div onClick={() => navigate('/products')} className="whitespace-nowrap cursor-pointer text-gray-900 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Kidney Medicines</div>
              <div onClick={() => navigate('/faqs')} className="cursor-pointer text-gray-900 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">FAQs</div>
              <div onClick={() => navigate('/contact-us')} className="whitespace-nowrap cursor-pointer text-gray-900 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Contact Us</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="cursor-pointer text-gray-900 hover:text-teal-600  py-2 rounded-md text-sm font-medium " onClick={() => userData ? navigate('/orders') : toast.info("Please login to proceed")}>Orders</div>
            <div onClick={navigateToViewCart} className="relative cursor-pointer flex items-center space-x-2 text-gray-900 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">
              <img src={cartIcon} alt="Cart Icon" className="h-5 w-5" />
              <div className='font-medium'>Cart</div>
              <div className="absolute top-0 right-1 bg-red-500 text-white px-1 rounded-full text-xs">
                {cartCount ? cartCount : ''}
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
              {userData?.role === 'user' ? (
                <div className="flex items-center">
                  <img
                    src={loggedUserIcon}
                    alt="Logged User Icon"
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onClick={handleToggle}
                  />
                  {userInfo && (
                    <div className="absolute right-0 top-8 z-10 w-56 mt-2 bg-white divide-y divide-gray-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">

                      <div className="px-4 py-3">
                        <p className="text-sm">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          <span className="cursor-pointer" onClick={() => navigate('/updateprofile')}>{userData?.name}</span>
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => navigate('/updateprofile')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Profile
                        </button>
                        {/* <button
                          onClick={() => navigate('/saved-prescription')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Saved Prescription
                        </button> */}
                        {/* <button
                          onClick={() => navigate('/orders')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Orders
                        </button> */}
                        <button
                          onClick={() => navigate('/enquiries')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Enquiries
                        </button>
                        <button
                          onClick={() => navigate('/prescriptions')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Prescription
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#095D7E] text-white flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition duration-300 transform hover:scale-105"
                >
                  <img src={userIcon} alt="User Icon" className="w-5" />
                  <div className="font-medium">Login</div>
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 hover:text-teal-600 focus:outline-none">
              {!isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <li>
            <button onClick={() => navigate('/')} className="text-gray-900 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Home</button>
          </li>
          <li>
            <button onClick={() => navigate('/products')} className="text-gray-900 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Kidney Medicines</button>
          </li>
          <li>
            <button onClick={() => navigate('/faqs')} className="text-gray-900 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">FAQs</button>
          </li>
          <li>
            <button onClick={() => navigate('/contact-us')} className="text-gray-900 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Contact Us</button>
          </li>
          <li>
            <button onClick={() => navigate('/orders')} className="text-gray-900 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Orders</button>
          </li>
          <li className="flex items-center justify-center">
            <button onClick={navigateToViewCart} className="w-full flex items-center justify-center border hover:bg-gray-100 space-x-2 px-3 py-2 rounded-full text-sm font-medium">
              <img src={cartIcon} alt="Cart Icon" className="h-5 w-5" />
              <div>Cart</div>
            </button>

          </li>
          {userData ? (
            <li className="flex items-center justify-center">
              <button onClick={() => handleLogout()} className="bg-[#095D7E] text-white w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-full text-sm font-medium">
                <img src={loggedUserIcon} alt="User Icon" className="h-5 w-5" />
                <div>Logout</div>
              </button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <button onClick={() => navigate('/login')} className="bg-[#095D7E] text-white w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-full text-sm font-medium">
                <img src={userIcon} alt="User Icon" className="h-5 w-5" />
                <div>Login</div>
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
