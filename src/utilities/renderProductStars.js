
import star from '../assest/image/star.svg';
import starblank from '../assest/image/starblue.svg';
import React from 'react';
const renderStars = (rating) => {
  const filledStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

  return (
    <>
      {Array.from({ length: filledStars }).map((_, index) => (
        <img key={`filled-${index}`} src={star} alt='Star Rating' />
      ))}
      {halfStar && <img src={star} alt='Star Rating' />}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <img key={`empty-${index}`} src={starblank} alt='Star Rating' />
      ))}
    </>
  );
};

export default renderStars;