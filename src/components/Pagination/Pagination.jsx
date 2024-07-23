import React, { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const [threshold, setThreshold] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setThreshold(2);
            } else {
                setThreshold(3);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const renderPageNumbers = () => {
        let pages = [];

        if (totalPages <= 2 * threshold + 1) {
            pages = pageNumbers;
        } else {
            pages = pageNumbers.slice(0, threshold);

            if (currentPage > threshold + 1) {
                pages.push('...');
            }

            if (currentPage > threshold && currentPage <= totalPages - threshold) {
                pages.push(currentPage);
            }

            if (currentPage < totalPages - threshold) {
                pages.push('...');
            }

            pages = pages.concat(pageNumbers.slice(totalPages - threshold));
        }

        return pages;
    };

    return (
        <div className={`flex justify-center bg-[#FFFF] ${totalPages === 0 ? 'hidden' : ''}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center sm:text-[16px] text-sm text-[#817F7F] bg-white rounded ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
            >
                <MdOutlineKeyboardArrowLeft className='sm:mr-2 mr-0' />
                <span>Previous</span>
            </button>
            {renderPageNumbers().map((number, index) => (
                <button
                    key={index}
                    onClick={() => number !== '...' && onPageChange(number)}
                    disabled={number === '...'}
                    className={`sm:px-4 sm:py-2 px-2 m-1 rounded ${currentPage === number ? 'bg-[#14967F] text-white' : 'bg-white border text-gray-700'}`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center sm:text-[16px] text-sm text-[#817F7F] bg-white rounded ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
            >
                <span>Next</span>
                <MdKeyboardArrowRight className='sm:ml-2 ml-0' />
            </button>
        </div>
    );
};

export default Pagination;
