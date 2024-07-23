import React, { useEffect, useState } from 'react';
import { apiGET, apiPUT } from '../utilities/apiHelpers';
import { useSelector } from 'react-redux';
import PrescriptionCard from '../components/presecription/PrescriptionCard';
import scrollToTop from '../utilities/scrollToTop';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimpleLoader from '../components/Loader/SimpleLoader';

function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track which prescription is being deleted
  const usersid = useSelector(state => state?.user?.userData?.id) || "";

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await apiGET(`v1/prescription/get-prescription-by-user/${usersid}`);
        setPrescriptions(response?.data?.data?.data || []);
      } catch (error) {
        setError('There was an error fetching the prescription data!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [usersid]);

  useEffect(() => {
    scrollToTop();
  }, []);

  const handleDelete = async (prescriptionId) => {
    setDeletingId(prescriptionId); // Start loading for the specific item
    try {
      await apiPUT(`v1/prescription/delete-prescription-img/${prescriptionId}`);
      setPrescriptions(prescriptions.filter(item => item._id !== prescriptionId));
      toast.success('Prescription deleted successfully');
    } catch (error) {
      console.error('Error!', error);
      toast.error('Failed to delete prescription image');
    } finally {
      setDeletingId(null); // Stop loading
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
        {loading ? (
          <div className='w-full flex justify-center'>
            <SimpleLoader />
          </div>
        ) : (
          prescriptions?.map((item, index) => (
            <PrescriptionCard
              key={index}
              item={item}
              onDelete={handleDelete}
              isDeleting={deletingId === item._id} // Pass deleting state to child
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Prescription;
