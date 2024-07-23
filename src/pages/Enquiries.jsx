import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiPOST } from "../utilities/apiHelpers";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import EnquiryItemCard from "../components/Order/EnquiryItemCard";
import Pagination from "../components/Pagination/Pagination";
import scrollToTop from "../utilities/scrollToTop";

const Enquiries = () => {
  const userId = useSelector((state) => state.user?.userData?.id) || '';
  const [orderData, setOrderData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  //   const handleSearch = (e) => {
  //     setSearchQuery(e.target.value);
  //   };

  const getUserOrder = async () => {
    const payload = {
      "page": page,
      "limit": 4,
      "searchQuery": searchQuery
    };
    const response = await apiPOST(`${API_URL}/v1/order/user-enquiries/${userId}`, payload);
    if (response?.data?.status) {
      setOrderData(response?.data?.data?.enquiries);
      setTotalPages(response?.data?.data?.totalPages || 1);
    } else {
      console.log(response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    scrollToTop()
    getUserOrder();
  }, [page]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="font-medium text-2xl">My Enquiries</div>
        {/* <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search enquiries..."
          className="p-2 border border-gray-300 rounded-lg"
        /> */}
      </div>
      <div className="w-full">
        {orderData?.length ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 xl:grid-cols-2 2xl:grid-cols-3 mt-4">
            {orderData.map((item) => (
              <EnquiryItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center my-4">
            <div className="border py-2 px-32 border-[#14967F] text-[#14967F] rounded-lg shadow-md">No enquiries found</div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center bg-white mt-4">
        <div className="w-full">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default Enquiries;
