import React from 'react';
import calander from "../../assest/icons/calander.svg";
import { MdRemoveRedEye } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import SimpleLoader from '../Loader/SimpleLoader';

const PrescriptionCard = ({ item, onDelete, isDeleting }) => {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div className='relative'>
        <div className='w-full h-56 bg-gray-100 flex items-center justify-center'>
          <img src={item.prescriptionImgUrl} alt="Prescription" className='w-full h-full object-cover' />
        </div>
        <div className='absolute flex justify-center items-center top-1 right-1 bg-[#CCECEE] w-[35px] h-[35px] rounded-full'>
          <a href={item.prescriptionImgUrl} target='_blank' rel="noopener noreferrer">
            <MdRemoveRedEye className='text-xl font-extrabold text-[#095D7E]' />
          </a>
        </div>
      </div>
      <div className='p-2'>
        <span className="text-gray-700 text-xs mb-4 flex gap-2 items-center mt-2">
          <img src={calander} alt="Calendar" />
          Added on <span className="ml-auto text-green-600">{new Date(item.createdAt).toLocaleDateString()}</span>
        </span>
        <div className="flex justify-center gap-6 items-center w-full py-2">
          {isDeleting ? (
            <SimpleLoader /> // Show loader while deleting
          ) : (
            <span
              className="hover:bg-[#14967F] bg-[#CCECEE] flex gap-1 hover:text-white text-center items-center justify-center w-full font-bold p-2 cursor-pointer rounded-full"
              onClick={() => onDelete(item._id)}
            >
              <RiDeleteBin6Line className='text-[20px] cursor-pointer' />Delete
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
