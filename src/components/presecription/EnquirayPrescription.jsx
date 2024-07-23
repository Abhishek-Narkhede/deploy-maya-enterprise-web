import React from 'react';

const EnquirayPrescription = ({ prescription }) => {
    return (
        <div className="w-full bg-[#F8F8F8] mt-3 p-4 rounded-[16px]">
            <label className="block mb-2  font-semibold text-gray-700">
                Attached prescription
            </label>
            <div className='flex '>
                <img className="w-full h-auto max-w-xs md:max-w-md lg:max-w-lg rounded-md" src={prescription?prescription[0].prescriptionData.prescriptionImgUrl : ""} />
            </div>
        </div>
    );
};

export default EnquirayPrescription;