import React from 'react';

const ButtonWithLoader = ({ loading, buttonText, onClick, width, type }) => {
  return (
    <button
      className={`bg-[#14967F] font-[600] text-[#FFFFFF] text-sm sm:text-base ${width} mt-2 rounded-[30px] p-2 self-end flex items-center justify-center ${loading ? 'cursor-not-allowed opacity-50' : ''
        }`}
      disabled={loading}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div>{buttonText}</div>
          <div className={`w-4 h-4 border-2 border border-solid rounded-full border-t-transparent animate-spin`}></div>
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default ButtonWithLoader;
