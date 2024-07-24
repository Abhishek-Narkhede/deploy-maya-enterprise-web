import React, { useEffect, useState } from "react";
import ProductCardofCart from "../productComponents/ProductCardofCart";
import PaymentDetails from "../PaymentDetails/PaymentDetails";

const MyCartStep = ({ stepperProgressCartData, setStepperProgressCartData, globalConfig }) => {

    return (
        <>
            <div className="text-2xl font-bold my-4">{stepperProgressCartData?.cartData?.length} items added in Cart</div>
            <div className="lg:flex gap-5">
                <div className="lg:w-1/2 min-w-[300px] max-h-[380px] overflow-y-auto scrollbar-custom scroll-smooth">
                    {stepperProgressCartData.cartData && stepperProgressCartData?.cartData?.length !== 0 && stepperProgressCartData?.cartData.map((item) => (
                        <ProductCardofCart
                            key={item._id}
                            item={item}
                            globalConfig={globalConfig}
                            stepperProgressCartData={setStepperProgressCartData}
                            setStepperProgressCartData={setStepperProgressCartData}
                        />
                    ))}
                </div>
                <PaymentDetails item={stepperProgressCartData ? stepperProgressCartData : []} setStepperProgressCartData={setStepperProgressCartData} globalConfig={globalConfig} />
            </div>
        </>
    );
}

export default MyCartStep;