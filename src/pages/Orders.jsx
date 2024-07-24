import React, { useEffect, useState } from "react";
import OrderItemCard from "../components/Order/OrderItemCard";
import { apiDELETE, apiGET, apiPOST } from "../utilities/apiHelpers";
import { API_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { FiEye } from "react-icons/fi";
import { MdKeyboardBackspace } from "react-icons/md";
import moment from "moment";
import scrollToTop from "../utilities/scrollToTop";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setCartCount } from "../redux/users/users";
import Pagination from "../components/Pagination/Pagination";

const Orders = () => {
    const userId = useSelector((state) => state.user?.userData?.id) || '';
    const [orderData, setOrderData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [globalConfig, setGlobalConfig] = useState([]);

    const getUserOrder = async () => {
        setLoading(true);
        try {
            const payload = {
                "page": page,
                "limit": 10,
                "searchQuery": ""
            }
            const response = await apiPOST(`${API_URL}/v1/order/get-user-orders/${userId}`, payload);
            console.log("ppppp", response)
            if (response?.data?.status) {
                setOrderData(response?.data?.data?.orders);
                setTotalPages(response?.data?.data?.totalPages)
            }
        } catch (error) {
            console.log("Error fetching user orders", error);
        }
        setLoading(false);
    };

    const fetchGlobalConfig = async () => {
        try {
            const response = await apiGET(`/v1/global-config/get-config`);
            if (response.status) {
                console.log(response?.data?.data?.data[0]);
                setGlobalConfig(response?.data?.data?.data[0]);
            } else {
                toast.error('Error fetching global config')
            }
        } catch (error) {
            toast.error('Error', error)
        }
    }




    useEffect(() => {
        getUserOrder();
        fetchGlobalConfig()
    }, [userId, page]);
    useEffect(() => {
        scrollToTop();
    })


    return (
        <div className="container mx-auto p-4">
            <div className="font-medium text-2xl">My Orders</div>
            {selectedOrder ? (
                <div>
                    <button
                        onClick={() => setSelectedOrder(null)}
                        className="my-4 flex items-center px-4 py-2 bg-[#14967F] text-white rounded"
                    >
                        <MdKeyboardBackspace />
                    </button>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 xl:grid-cols-2 2xl:grid-cols-3 mt-4">
                        {selectedOrder?.orderItems?.map((orderItem) => (
                            <OrderItemCard orderItem={orderItem} globalConfig={globalConfig} />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto mt-4 rounded-lg">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead>
                                <tr>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order ID</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order Mode</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order Type</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Status</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order Date</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order Items</th>
                                    <th className="py-2 px-2 bg-[#14967F] text-white border-b">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center">
                                            <div className="flex justify-center items-center">
                                                <div className="w-8 h-8 border-4 border-teal-600 border-solid rounded-full border-t-transparent animate-spin"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : orderData.length ? (
                                    orderData.map((item) => (
                                        <tr key={item.id} className="hover:bg-[#ccecee]">
                                            <td className="py-2 px-2 border-b">{item?._id || "--"}</td>
                                            <td className="py-2 px-2 border-b">{item?.mode || "--"}</td>
                                            <td className="py-2 px-2 border-b">{item?.orderType ? item?.orderType : "--"}</td>
                                            <td className="py-2 px-2 border-b">{item?.status ? item?.status : "--"}</td>
                                            <td className="py-2 px-2 border-b">
                                                {moment(item?.createdAt || "09/07/24").format("DD/MM/YY")}
                                            </td>
                                            <td className="py-2 px-2 border-b">
                                                {item?.orderItems?.length || "0"}
                                            </td>
                                            <td className="py-2 px-2 border-b">
                                                <div className="flex justify-center items-center">
                                                    <button className="flex gap-2 items-center hover:underline" onClick={() => setSelectedOrder(item)}>
                                                        <FiEye /> View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center">No Orders Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>

                </>
            )}
        </div>
    );
};

export default Orders;
