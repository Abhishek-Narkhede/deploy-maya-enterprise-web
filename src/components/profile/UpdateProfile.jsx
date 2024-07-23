import React, { useState } from 'react';
import UpdateProfileStepper from '../Steppers/UpdateProfileStepper';
import EditProfile from './EditProfile';
import EditAddress from './EditAddress';
import { useEffect } from 'react';
import scrollToTop from '../../utilities/scrollToTop';


function UpdateProfile() {
    const [currentStep, setCurrentStep] = useState(0);
    const steeperArray = ["Profile Details","Address Details"];

    useEffect(()=>{
        scrollToTop();
    },[])

    const goToProfileStep = () => {
        setCurrentStep(0);

    };

    const goToAddressStep = () => {
       
        setCurrentStep(1);

    };
    const renderStepComponent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return <EditProfile />;
            case 1:
                return <EditAddress />;
            default:
                return null;
        }
    };
    
    return (
        <div className='lg:min-h-[500px]'>
            <UpdateProfileStepper currentStep={currentStep} steeperArray={steeperArray} setCurrentStep={currentStep} goToProfileStep={goToProfileStep} goToAddressStep={goToAddressStep}  />
            {renderStepComponent(currentStep)}
        </div>
    );
}

export default UpdateProfile;
