import React, { useEffect, useState } from 'react';

const ShowSavedPrescription = ({ selectedImageIndexes, savedPrescription, setSelectedImageIndexes, setSelectedImageUrl }) => {
  const [localSavedPrescription, setLocalSavedPrescription] = useState([]);

  const handleImageClick = (item, index) => {
    setSelectedImageUrl((prevSelectedUrl) => {
      if (prevSelectedUrl.includes(item)) {
        return prevSelectedUrl.filter((url) => url !== item);
      } else {
        return [item];
      }
    });
    setSelectedImageIndexes((prevSelectedIndexes) => {
      if (prevSelectedIndexes.includes(index)) {
        return prevSelectedIndexes.filter((i) => i !== index);
      } else {
        return [index];
      }
    });
  };

  useEffect(() => {
    setLocalSavedPrescription(savedPrescription);
  }, [savedPrescription]);


  return (
    <div className="w-full">
      <label className="block mb-2 text-lg font-bold mt-4 text-gray-700">
        Or Select from saved prescription
      </label>
      <div className="flex gap-2 max-h-[300px] overflow-y-auto scrollbar-custom scroll-smooth flex-wrap">
        {localSavedPrescription?.length > 0 ? (
          localSavedPrescription?.map((item, index) => (
            <div key={index} className="relative cursor-pointer" onClick={() => handleImageClick(item, index)}>
              <img className="rounded-lg w-56 h-32" src={item?.prescriptionImgUrl} alt="Saved Prescription" />
              {selectedImageIndexes.includes(index) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No saved prescriptions available</p>
        )}
      </div>
    </div>
  );
};

export default ShowSavedPrescription;