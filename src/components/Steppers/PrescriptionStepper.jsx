// Stepper.js
import React from 'react';



const PrescriptionStepper = ({ currentStep, steps, setCurrentStep, stepperNavigation }) => {
    return (
        <div className="w-full lg:w-64 p-4 bg-[#FFFFFF] shadow-lg rounded-[16px]">
            {steps.map((step, index) => (
                <div key={step.id} className="relative flex mb-6 cursor-pointer" onClick={() => stepperNavigation(step.id)}>
                    <div className="relative flex-shrink-0 w-4 h-4 mt-2">
                        <div className={`w-full h-full rounded-full border-2 ${currentStep >= step.id ? 'border-[#14967F] bg-[#14967F]' : 'border-gray-300 bg-white'}`} />
                        {currentStep >= step.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        )}
                        {index !== steps.length - 1 && (
                            <div className={`absolute left-1/2 transform -translate-x-1/2 w-px ${currentStep > step.id ? 'bg-[#14967F]' : 'bg-gray-300'}`} style={{ top: '100%', height: 'calc(100% + 40px)' }}></div>
                        )}
                    </div>
                    <div className="ml-4">
                        <p className={`text-[14px] ${currentStep >= step.id ? 'text-[#14967F]' : 'text-[#373435]'}`}>{`Step ${step.id + 1}`}</p>
                        <p className={`text-[16px] ${currentStep >= step.id ? 'text-[#14967F]' : 'text-[#373435]'}`}>{step.name}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PrescriptionStepper;
