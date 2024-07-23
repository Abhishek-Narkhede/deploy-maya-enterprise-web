import React from 'react';

function UpdateProfileStepper({ steeperArray, goToAddressStep, goToProfileStep, currentStep }) {

    const handleClick = (item) => {
        if (item === "Profile Details") {
            goToProfileStep();
        } else if (item === "Address Details") {
            goToAddressStep();
        }
    }

    return (
        <div className='flex justify-center w-full'>
        <div className=' flex mt-5 w-[793px] gap-5 items-center  rounded-xl   bg-white '>
            {steeperArray.map((item, index) => (
                <div className='cursor-pointer ' key={index}>
                    <button
                        onClick={() => handleClick(item)}
                        className={`text-[15px]  mx-4 py-2 ${currentStep === index ? 'border-b-2 border-green-500 text-[#14967F] font-semibold' : 'border-b-2 border-transparent'}`}
                    >
                        {item}
                    </button>
                </div>
            ))}
        </div>
        </div>
    );
}

export default UpdateProfileStepper;
