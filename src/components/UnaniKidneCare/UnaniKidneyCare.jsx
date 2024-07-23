import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import left_arrow from '../../assest/image/left_arrow.svg';
import right_arrow from '../../assest/image/right_arrow.svg';
import titlepre from '../../assest/image/Vector.svg';
import star from '../../assest/image/star.svg';
import starblank from '../../assest/image/starblue.svg';
import shopping from '../../assest/image/shopping.svg';
import renderStars from '../../utilities/renderProductStars';
import { apiGET } from '../../utilities/apiHelpers';
import { API_URL } from '../../config';

const Topratecomponet = () => {
  const [categories, setCategories] = useState([]);
  const sliderRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGET(`${API_URL}/v1/product/getProductsBasedOnCategories`);
        if (response.data.status) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getSliderSettings = (productCount) => ({
    dots: false,
    infinite: productCount > 1,
    speed: 500,
    slidesToShow: Math.min(1, productCount),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1424,
        settings: {
          slidesToShow: Math.min(6, productCount),
          slidesToScroll: 1,
          infinite: productCount > 1,
          dots: false,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(6, productCount),
          slidesToScroll: 1,
          infinite: productCount > 1,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, productCount),
          slidesToScroll: 1,
          infinite: productCount > 1,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(4, productCount),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(1, productCount),
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  });


  const handleNextClick = (category) => {
    sliderRefs.current[category]?.slickNext();
  };

  const handlePrevClick = (category) => {
    sliderRefs.current[category]?.slickPrev();
  };

  return (
    <div>
      {categories.map((category, index) => (
        <div key={index} className='mb-8 overflow-x-hidden'>
          <div className='mx-4 mb-2 overflow-x-hidden text-lg font-semibold'>{category.category}</div>
          <div className='relative overflow-x-hidden p-5'>
            {category.products.length > 1 && (
              <>
                {/* <img 
                  className='absolute top-[52%] overflow-x-hidden -translate-y-[50%] left-0 z-10 cursor-pointer' 
                  onClick={() => handlePrevClick(category.category)} 
                  src={left_arrow} 
                  width="" 
                  height="" 
                  alt="Previous"
                /> */}
                {/* <img 
                  className='absolute top-[52%] overflow-x-hidden -translate-y-[50%] right-0 z-10 cursor-pointer' 
                  onClick={() => handleNextClick(category.category)} 
                  src={right_arrow} 
                  width="" 
                  height="" 
                  alt="Next"
                /> */}
              </>
            )}
            <Slider {...getSliderSettings(category.products.length)} ref={ref => (sliderRefs.current[category.category] = ref)} className='space-x-4'>
              {category.products.map((product) => (
                <div key={product._id} className='mt-4 mx-[30px] min-w-[220px] border p-4 rounded-lg'>
                  <div className='flex'>
                    <span><img src={titlepre} alt='Prescription Required' /></span>
                    {product.isPrescription && <span className='mx-2'>Prescription</span>}
                  </div>
                  <div className='image-container mt-[20px]'>
                    <img src={product.bannerImg} alt={product.name} className='w-[163px] h-[131px]' />
                  </div>
                  <div className='min-h-[24px] mt-4'>
                    <label className='font-extrabold text-sm'>{product.name || " "}</label>
                  </div>
                  <div className='flex gap-2 mt-2'>
                    {renderStars(item.avgRating)}
                  </div>
                  <div className='mt-4'>
                    <label className='line-through'>₹{product.price}</label>{' '}
                    <label className='text-[#095D7E]'>₹{product.discountedPrice}</label>
                  </div>
                  <button className='w-full flex items-center gap-2 justify-center mt-[30px] bg-[#F8F8F8] px-7 py-2 border-none rounded-[40px]'>
                    <img src={shopping} alt='Add to Cart' />
                    <span className='text-[#14967F] font-semibold text-xs'>Add to cart</span>
                  </button>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Topratecomponet;
