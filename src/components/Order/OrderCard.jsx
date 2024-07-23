import { FaShippingFast, FaMoneyBillWave } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import { BsPerson, BsGeoAlt, BsFileEarmarkMedical } from 'react-icons/bs';

const OrderCard = () => {
    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
                <MdPending className="text-yellow-500 mr-2" />
                Order Details
            </h2>
            <div className="mb-2 flex items-center text-gray-700">
                <BsPerson className="mr-2" />
                <strong>User ID:</strong> 66742e29d9277122b4676df9
            </div>
            <div className="mb-2 flex items-center text-gray-700">
                <BsGeoAlt className="mr-2" />
                <strong>Address ID:</strong> 667933f8eec0a31c4049be1a
            </div>
            <div className="mb-2 flex items-center text-gray-700">
                <BsFileEarmarkMedical className="mr-2" />
                <strong>Prescription ID:</strong> 667a4a26d437f50fb4d1d0f0
            </div>
            <div className="mb-2 flex items-center text-gray-700">
                <FaMoneyBillWave className="text-green-500 mr-2" />
                <strong>Total Payment:</strong> $2300
            </div>
            <div className="mb-2 flex items-center text-gray-700">
                <FaShippingFast className="mr-2" />
                <strong>Status:</strong> Pending
            </div>
            <div className="mb-2 flex items-center text-gray-700">
                <strong>Mode:</strong> Cash on Delivery
            </div>
            <div className="mt-4 text-gray-600">
                <p><strong>Created At:</strong> 2024-06-25</p>
                <p><strong>Updated At:</strong> 2024-06-25</p>
            </div>
        </div>
    );
};

export default OrderCard;
