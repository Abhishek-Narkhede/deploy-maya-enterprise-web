import React from 'react';

const Loader = ({width,height,padding}) => {
  return (
    <div className={`flex ${padding} items-center justify-center min-h-screen`}>
      <div className={`${width} ${height} border-2 border-teal-600 border-solid rounded-full border-t-transparent animate-spin`}></div>
    </div>
  );
};

export default Loader;
