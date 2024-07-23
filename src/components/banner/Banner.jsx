import React, { useEffect, useState } from 'react';
import Rectangle from '../../assest/image/Rectangle.svg';
const Banner = ({ bannerImages }) => {

  return (
    <div className="w-full flex justify-center items-center mt-8">
      {bannerImages?.map((image, index) => (
        <div key={index} className="relative w-full max-w-screen-xl h-auto mb-8">
          <img
            src={image.bannerImgUrl || Rectangle}
            alt={image.title || "keep healthy kidneys"}
            className="w-full md:h-[280px] lg:h-[280px] object-cover object-fit rounded-lg"
          />
          <div className="absolute inset-0 p-4 sm:p-8 lg:p-12 flex flex-col justify-center">
            <h1 className="text-[#101010] text-xs font-bold text-left sm:text-2xl md:text-3xl lg:text-4xl mt-2">
              {image.title || "Keeping Your Kidneys Healthy"}
            </h1>
            <div className="flex flex-wrap">
              <button className="mt-4 text-[10px] sm:mt-6 bg-[#095D7E] text-[#FFFFFF] rounded-full px-4 sm:py-2 md:py-2 py-1 md:text-base lg:text-lg">
                Shop medicines
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Rectangle from '../../assest/image/Rectangle.svg';

// const Banner = () => {
//   const [bannerImages, setBannerImages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBannerImages = async () => {
//       try {
//         const response = await axios.get('v1/bannerImg/get-all-banner-img');
//         setBannerImages(response.data.data.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBannerImages();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="w-full flex justify-center items-center mt-8">
//       {bannerImages.map((image, index) => (
//         <div key={index} className="relative w-full max-w-screen-xl h-auto mb-8">
//           <img
//             src={image.bannerImgUrl || Rectangle}
//             alt={image.title || "keep healthy kidneys"}
//             className="w-full h-auto rounded-lg"
//           />
//           <div className="absolute inset-0 p-4 sm:p-8 lg:p-12 flex flex-col justify-center">
//             <h1 className="text-[#101010] text-xs font-bold text-left sm:text-2xl md:text-3xl lg:text-4xl mt-2">
//               {image.title || "Keeping Your Kidneys Healthy"}
//             </h1>
//             <div className="flex flex-wrap">
//               <button className="mt-4 text-[10px] sm:mt-6 bg-[#095D7E] text-[#FFFFFF] rounded-full px-4 sm:py-2 md:py-2 py-1 md:text-base lg:text-lg">
//                 Shop medicines
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Banner;
