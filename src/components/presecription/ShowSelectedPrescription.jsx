import React, { useEffect, useState } from 'react';

const ShowSelectedPrescription = ({ selectedUrl }) => {
    const [localSavedPrescription, setLocalSavedPrescription] = useState([]);


    useEffect(() => {
        if (selectedUrl) {
            console.log(selectedUrl);
            setLocalSavedPrescription(selectedUrl);
        }
    }, [selectedUrl]);


    return (
        <div className="w-full">
            {
                localSavedPrescription.length !== 0 && <label className="block mb-2 text-lg font-bold mt-4 text-gray-700">
                    Selected Prescription :
                </label>
            }
            <div className="flex gap-2 flex-wrap">
                {localSavedPrescription?.length > 0 ? (
                    <div className="relative cursor-pointer">
                        <img className="rounded-lg w-56 h-32" src={localSavedPrescription} alt="Saved Prescription" />
                    </div>) : (
                    <p className='mt-5'>No prescriptions selected</p>
                )}
            </div>
        </div>
    );
};

export default ShowSelectedPrescription;