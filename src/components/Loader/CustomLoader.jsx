import React from "react";

const CustomLoader = ({ width, height }) => {
    return (
        <div className="flex justify-center items-center">
            <div className={`${width} ${height} border-4 border-teal-600 border-solid rounded-full border-t-transparent animate-spin`}></div>
        </div>
    )
}

export default CustomLoader;