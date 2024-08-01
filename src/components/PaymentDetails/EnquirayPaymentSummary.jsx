import React from "react";
import homeIcon from "../../assest/icons/homeicon.png"
const EnquiryPaymentSummary = ({ enquirySummaryDetails, globalConfig }) => {

    return (
        <div className="bg-[#F8F8F8] shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800">Enquiry Payment Summary</h3>
            <p className="flex justify-between text-gray-600 mt-4">
                <span>Cart Amount</span><span>{globalConfig?.currencyData?.symbol}{enquirySummaryDetails ? enquirySummaryDetails[0]?.cartAmount : "0"}</span>
            </p>
            <p className="flex justify-between text-gray-600 mt-2">
                <span>Packaging Charges</span> <span>+ {globalConfig?.currencyData?.symbol}{globalConfig?.packagingCharges}</span>
            </p>
            <p className="flex justify-between text-gray-600 mt-2">
                <span>Delivery Charges</span> <span>+ {globalConfig?.currencyData?.symbol}{globalConfig?.deliveryCharges}</span>
            </p>
            <hr className="mt-4" />
            <p className="flex justify-between text-[#14967F] mt-4 font-bold text-lg">
                <span>Total to pay</span> <span>{globalConfig?.currencyData?.symbol}{enquirySummaryDetails ? enquirySummaryDetails[0]?.totalCartAmount : "0"}</span>
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg">
                <div className="flex gap-4">
                    <img src={homeIcon} className="w-6 h-6" />
                    <div className="w-full">
                        <div className="font-medium text-xl">Delivering to</div>
                        <div className="flex justify-between items-center w-full">
                            <div className=" text-gray-500 text-xs ">{enquirySummaryDetails ? enquirySummaryDetails[0]?.addressDetails?.city : "NA"} {enquirySummaryDetails ? enquirySummaryDetails[0]?.addressDetails?.zip : "0001"}</div>
                            {/* <div className="text-[#14967F]">Add Addresss</div> */}
                        </div>
                    </div>
                </div>
                {/* <button className="text-blue-600">Add Address</button> */}
            </div>
        </div>
    )
}

export default EnquiryPaymentSummary;