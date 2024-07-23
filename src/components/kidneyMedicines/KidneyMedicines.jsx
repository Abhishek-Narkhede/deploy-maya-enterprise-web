import React, { useEffect, useState } from 'react';
import KidneyMedicinesCard from "./KidneyMedicinesCard"; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { apiPOST } from '../../utilities/apiHelpers';
import SimpleLoader from '../Loader/SimpleLoader';



const KidneyMedicines = ({ products, stepperProgressCartData, setStepperProgressCartData }) => {
  const navigate = useNavigate()

  return (
    <div className='my-8 w-full'>
      <div className=' font-bold text-2xl'>Kidney Medicines</div>
      <div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-1'>
          {
            products?.map((item) => (
              <KidneyMedicinesCard item={item} stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />
            )
            )
          }
        </div>
        <div className='flex w-full items-center justify-center'>
          <button onClick={() => navigate("/products")} className="mt-4 bg-[#14967F] hover:text-white px-7 py-2 rounded-full transition duration-300 transform hover:scale-105">
            <span className=" font-semibold text-xs">Load more</span>
          </button>
        </div>
      </div>
    </div>
  )
};

export default KidneyMedicines;
