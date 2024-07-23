import React, { useState } from 'react';

const SortByAlphabet = ({ onLetterClick }) => {
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    const [selectedLetter, setSelectedLetter] = useState('');

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        onLetterClick(letter);
    };

    return (
        <>
            <div className='flex items-center gap-3'>
                <h2 className='text-26 text-[#101010] font-[500]'>Kidney Medicines</h2>
                <p className='text-[#303030] text-16'>Medicine Index starting with - {selectedLetter}</p>
            </div>
            <div className="flex overflow-x-auto my-4">
                {letters.map(letter => (
                    <button
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        className={`w-36 m-2 p-2 rounded transition-colors duration-200
                            ${letter === selectedLetter ? 'bg-[#14967F] text-white' : 'bg-[#F8F8F8] text-[#303030]'}
                            hover:bg-[#14967F] hover:text-white`}
                        aria-label={`Sort by letter ${letter}`}
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </>
    );
};

export default SortByAlphabet;
