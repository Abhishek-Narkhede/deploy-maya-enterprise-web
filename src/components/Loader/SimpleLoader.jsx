import React from "react";

const SimpleLoader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-teal-600 border-solid rounded-full border-t-transparent animate-spin"></div>
    </div>
  )
}

export default SimpleLoader;