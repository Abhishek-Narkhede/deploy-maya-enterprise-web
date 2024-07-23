import React, { useEffect, useRef, useState } from 'react';
import left_arrow from '../../assest/image/left_arrow.svg';
import right_arrow from '../../assest/image/right_arrow.svg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Cardbrand from './cardbrand';
import { apiGET, apiPOST } from '../../utilities/apiHelpers';
import { useNavigate } from 'react-router-dom';
import SimpleLoader from '../Loader/SimpleLoader';

const Brand = ({ brands }) => {
  const sliderRef = useRef(null);

  const navigate = useNavigate();

  const sliderSettings = (numItems) => ({
    dots: false,
    infinite: numItems > 1,
    speed: 500,
    slidesToShow: Math.min(Math.max(numItems, 2), 6),
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 2560,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 2), 8),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 1424,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 2), 7),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 2), 6),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 2), 4),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 2), 2),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 560,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 1), 1),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 1), 1),
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  });

  const handleNextClick = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevClick = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className='mt-10 w-full'>
      <div className=''>
        <div className='my-4 text-2xl font-bold'>Top Brands</div>
        <div className='bg-[#F1F9FF] w-full'>
          <div className='px-10 py-8'>
            <div className='relative flex justify-center items-center'>
              <img
                className='absolute top-1/2 transform -translate-y-1/2 -left-10 z-10 cursor-pointer'
                onClick={handlePrevClick}
                src={left_arrow}
                alt="Previous"
                width="60px"
              />
              <img
                className='absolute top-1/2 transform -translate-y-1/2 -right-10 z-10 cursor-pointer'
                onClick={handleNextClick}
                src={right_arrow}
                alt="Next"
                width="60px"
              />
              <Slider {...sliderSettings(brands?.length)} ref={sliderRef} className='w-full abc'>
                {brands?.length && brands.map((brand) => (
                  <div key={brand?.id} className="px-4">
                    <Cardbrand
                      onClick={() => navigate(`/product/brand/${brand?.id}`)}
                      item={{ src: brand?.brandImgUrl }}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Brand;
