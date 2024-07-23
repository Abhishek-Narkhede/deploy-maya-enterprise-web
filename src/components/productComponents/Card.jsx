import React, { useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import left_arrow from '../../assest/image/left_arrow.svg';
import right_arrow from '../../assest/image/right_arrow.svg';
import titlepre from '../../assest/image/Vector.svg';
import kideny1 from '../../assest/image/kideny1.svg';
import kideny2 from '../../assest/image/Kidney2.svg';
import kideny3 from '../../assest/image/Kidney3.svg';
import kideny4 from '../../assest/image/Kidney4.svg';
import kideny5 from '../../assest/image/Kidney5.svg';
import star from '../../assest/image/star.svg';
import shopping from '../../assest/image/shopping.svg';

const products = [
  {
    id: 1,
    image: kideny1,
    name: 'Ace Q10 Capsule',
    originalPrice: 525,
    discountedPrice: 410,
    prescription: true,
  },
 
  {
    id: 3,
    image: kideny3,
    name: 'RenalGuard Supplement',
    originalPrice: 750,
    discountedPrice: 600,
    prescription: true,
  },
  {
    id: 4,
    image: kideny3,
    name: 'RenalGuard Supplement',
    originalPrice: 750,
    discountedPrice: 600,
    prescription: true,
  },
  // {
  //   id: 4,
  //   image: kideny4,
  //   name: 'NephroAid Tablets',
  //   originalPrice: 300,
  //   discountedPrice: 250,
  //   prescription: false,
  // },
  {
    id: 5,
    image: kideny5,
    name: 'UroShield Pills',
    originalPrice: 500,
    discountedPrice: 400,
    prescription: true,
  },
];

function Card() {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1424,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  const handleNextClick = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevClick = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div>
      <div className='mx-4 mb-2 text-lg font-semibold'>Top Brands</div>
      <div className='relative p-5'>
        <img 
          className='absolute top-[52%] -translate-y-[50%] left-0 z-10 cursor-pointer' 
          onClick={handlePrevClick} 
          src={left_arrow} 
          width="" 
          height="" 
          alt="Previous"
        />
        <img 
          className='absolute top-[52%] -translate-y-[50%] right-0 z-10 cursor-pointer' 
          onClick={handleNextClick} 
          src={right_arrow} 
          width="" 
          height="" 
          alt="Next"
        />
        <Slider {...settings} ref={sliderRef} className='w-full flex space-x-4'>
          {products.map((product) => (
            <div key={product.id} className='mt-4 !w-[220px] h-[357px] border p-4 rounded-lg'>
              {product.prescription && (
                <div className='flex'>
                  <span><img src={titlepre} alt='Prescription Required' /></span>
                  <span className='mx-2'>Prescription</span>
                </div>
              )}
              <div className=''>
                <img src={product.image} alt={product.name} />
              </div>
              <div className=''>
                <label className='font-extrabold text-sm'>{product.name}</label>
              </div>
              <div className='flex gap-2 mt-2'>
                <img src={star} alt='Star Rating' />
                <img src={star} alt='Star Rating' />
                <img src={star} alt='Star Rating' />
                <img src={star} alt='Star Rating' />
              </div>
              <div className='mt-4'>
                <label className='line-through'>₹{product.originalPrice}</label>{' '}
                <label className='text-[#095D7E]'>₹{product.discountedPrice}</label>
              </div>
              <button className='!w-full flex gap-2 justify-center mt-3 bg-[#F8F8F8] px-7 py-2 border-none rounded-[40px]'>
                <img src={shopping} alt='Add to Cart' />
                <span className='text-[#14967F] font-semibold text-xs'>Add to cart</span>
              </button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Card;
