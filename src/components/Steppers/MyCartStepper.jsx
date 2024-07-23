// Stepper.js
import React from 'react';

const MyCartStepper = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center justify-between px-2 sm:px-4 py-4 sm:py-8 mx-auto bg-white rounded-[16px] shadow-lg space-x-2 sm:space-x-4 overflow-x-auto">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    {index !== 0 && (
                        <div className={`flex-1 h-0.5 ${index <= currentStep ? 'bg-[#14967F]' : 'bg-gray-300'}`}></div>
                    )}
                    <div className="flex flex-col items-center min-w-[60px]">
                        {/* Step Circle */}
                        <div className={`relative flex items-center justify-center w-4 h-4 sm:w-6 sm:h-6 rounded-full ${index <= currentStep ? 'bg-[#14967F]' : 'bg-gray-300'}`}>
                            {index === currentStep && (
                                <div className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            )}
                        </div>
                        <div className="text-[10px] sm:text-[16px] mt-1 sm:mt-2 font-[500] text-center">{step}</div>
                        <div className="text-xs sm:text-sm mt-1 sm:mt-2 text-[#14967F] font-[500] text-center">Step {index + 1}</div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default MyCartStepper;
