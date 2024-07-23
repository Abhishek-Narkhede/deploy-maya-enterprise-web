import React, { useRef, useState } from 'react';
function Cardbrand({ item, index, onClick }) {
  return (
    <div key={index} className='rounded-[16px] cursor-pointer relative'>
      <img onClick={onClick}
        src={item.src}
        className='w-full h-[150px] object-fill'
        alt={`brand-${index + 1}`} />

    </div>
  );

}

export default Cardbrand;
