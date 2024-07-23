import React from "react";

const PaymentSummary = ({ type, item, globalConfig }) => {

    return <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800">Payment Summary</h3>
        <p className="flex justify-between text-gray-600 mt-4">
            <span>Cart Amount</span> <span>{item?.cartAmount}</span>
        </p>
        <p className="flex justify-between text-gray-600 mt-2">
            <span>Packaging Charges</span> <span>+ {globalConfig?.currencyData?.symbol}{globalConfig?.packagingCharges}</span>
        </p>
        <p className="flex justify-between text-gray-600 mt-2">
            <span>Delivery Charges</span> <span>+ {globalConfig?.currencyData?.symbol}{globalConfig?.deliveryCharges}</span>
        </p>
        <p className="flex justify-between text-[#14967F] mt-4 font-bold text-lg">
            <span>Total to pay</span> <span>{globalConfig?.currencyData?.symbol}{item?.totalCartAmount}</span>
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">Delivering to</p>
            <p className="font-semibold text-gray-800">{item?.selectedAddress?.city} {item?.selectedAddress?.zip}</p>
        </div>
    </div>
}
export default PaymentSummary