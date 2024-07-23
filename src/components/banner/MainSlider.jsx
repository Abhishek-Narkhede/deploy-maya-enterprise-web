import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Slider.css'; // You can add custom styles here
import { apiGET } from '../../utilities/apiHelpers';
import { API_URL } from '../../config';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MainSlider = () => {
  const [products, setProducts] = useState([]);
  const [initialSlide, setInitialSlide] = useState(0);
  const [loading, setLoading] = useState(true); // State for loading

  const fetchBanners = async () => {
    try {
      const response = await apiGET(`${API_URL}/v1/sliderImg/get-all-slider-img`);
      const fetchedProducts = response.data.data.data;

      // Sort products by position
      const sortedProducts = fetchedProducts.sort((a, b) => a.position - b.position);
      setProducts(sortedProducts);

      // Find the initial slide based on position
      const initialProduct = sortedProducts.find(product => product.position === 1); // Assuming position 1 should be the initial slide
      const initialIndex = sortedProducts.indexOf(initialProduct);
      setInitialSlide(initialIndex);

      setLoading(false); // Set loading to false after data is fetched
      console.log('Products fetched and sorted:', sortedProducts);
    } catch (error) {
      console.error('Error fetching', error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const settings = {
    customPaging: (i) => <div className="custom-line" />,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialSlide,
    autoplay: true, // Enable automatic sliding
    autoplaySpeed: 2000, // Time in ms
    arrows: false,
  };

  return (
    <div className="">
      {loading ? (
        <Skeleton height={280} width="100%" borderRadius="0.5rem" baseColor='#ccecee'  />
      ) : (
        <Slider {...settings}>
          {products.map((item, index) => (
            <div key={item.id || index} className="flex justify-center items-center">
              <img
                src={item?.sliderImgUrl}
                alt="Slider Image"
                className="rounded-lg object-cover w-full h-[280px]"
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default MainSlider;
