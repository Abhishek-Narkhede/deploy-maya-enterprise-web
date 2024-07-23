import React from 'react';
import dummyPrescriptionImg from "../../assest/image/prescription/dummyPrescription.png"

const ValidPrescriptionFormat = () => {
  return (
    
      <div className="w-full">
        <label className="block mb-2 text-sm font-medium text-gray-700">
        What is a valid prescription?
        </label>
        <div>
            <div><img src={dummyPrescriptionImg}/></div>
        </div>
      </div>
    
  );
};

export default ValidPrescriptionFormat;