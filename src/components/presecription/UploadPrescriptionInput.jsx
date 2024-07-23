import React, { useState } from 'react';
import icon from "../../assest/icons/uploadFileIcon.png"
import { apiPOST } from '../../utilities/apiHelpers';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';

const UploadPrescriptionInput = ({ setUploadStatus }) => {
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setUploadStatus('Please select a file before uploading.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Content = reader.result.split(',')[1]; // Remove the "data:" prefix
      
      const payload = {
        thumbnailData: base64Content,
      };

      try {
        const response = await apiPOST(`${API_URL}/v1/upload-thumbnail`, payload);
        if (response?.data?.status===200) {
          const prescriptionPayload = {
            "userId": "66750bc81976775f38ed6e23",
            "prescriptionImgUrl": response?.data?.data?.thumbnailUrl,
            "title": selectedFile.name
          }
          const prescriptionResponse = await apiPOST(`${API_URL}/v1/prescription/add-prescription-img`, prescriptionPayload);
          if (prescriptionResponse) {
            toast.success("File uploaded successfully!");
            setUploadStatus('File uploaded successfully!');
          } else {
            setUploadStatus('Failed to upload file.');
          }
        } else {
          setUploadStatus('Failed to upload file.');
        }
      } catch (error) {
        setUploadStatus('Error uploading file.');
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center items-center w-[492px] h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
        <input 
          type="file" 
          className="hidden" 
          id="file-input" 
          onChange={handleFileChange} 
          accept=".jpg, .jpeg, .png, .pdf"
        />
        <label htmlFor="file-input" className="flex flex-col items-center justify-center w-full h-full text-gray-400 cursor-pointer">
          <img src={icon} alt="Upload icon" className="mb-2"/>
          <div className="text-center">
            <div>Browse files to upload your prescription</div> 
            <div>(JPG, JPEG, PNG, PDF)</div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default UploadPrescriptionInput;
