import moment from "moment";
import React from "react";
const EnquiryCard = ({ cardItem }) => {
    return (
        <div className={`${cardItem ? "h-[400px]" : ""} overflow-auto scrollbar-custom scroll-smoot px-2`}>
            {
                cardItem?.map((item) => (
                    <div key={item.productId} className="w-full flex flex-col mb-2  lg:flex lg:flex-row bg-white rounded-lg shadow-lg p-2  space-x-10">
                        <img
                            src={item?.productDetails?.bannerImg}
                            alt={item?.productDetails?.name}
                            className=" w-full lg:w-44 lg:h-44 object-cover rounded"
                        />
                        <div className="mt-4">
                            <h2 className="text-xl font-medium mb-2">{item?.productDetails?.name}</h2>
                            <p className="text-gray-600 mb-1">
                                <span className="text-[#817F7F]">Order Id:</span>{item?.orderId}
                            </p>
                            <p className="text-gray-600">
                                <span className="text-[#817F7F]">Order date:</span> {moment(item.createdAt).format('DD/MM/YY')}
                            </p>
                            <div className="flex items-center mt-2">
                                <span className="text-gray-500 line-through mr-2">₹{item?.productDetails?.price}</span>
                                <span className="text-teal-600 font-semibold mr-4">₹{item?.productDetails?.discountedPrice}</span>
                                <div className="flex items-center space-x-2">
                                    <span className="px-2 text-gray-500">Qty: {item?.quantity}</span>
                                </div>
                            </div>
                        </div>
                        {/* <button className="text-teal-600 font-semibold">Order again</button> */}
                    </div>
                ))
            }
        </div>
    );
}
export default EnquiryCard