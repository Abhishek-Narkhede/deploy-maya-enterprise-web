import React, { useState, useEffect, useRef } from "react";
import { apiPUT } from "../../utilities/apiHelpers";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Country, State, City } from 'country-state-city';
export default function EditPopup({ isOpen, setIsOpen, address, onUpdate }) {
  const popupRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState({ isoCode: '', name: '' });
  const [selectedState, setSelectedState] = useState({ isoCode: '', name: '' });
  const [selectedCity, setSelectedCity] = useState('');
  const [addressFormData, setAddressFormData] = useState({
    Name: '',
    addressLine1: '',
    addressLine2: '',
    zip: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (address) {
      setAddressFormData({
        Name: address.Name,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        zip: address.zip
      });

      const country = Country.getAllCountries().find(c => c.name === address?.country);
      const state = State.getStatesOfCountry(country.isoCode).find(s => s.name === address?.state);
      const city = address?.city;

      setSelectedCountry({ isoCode: country.isoCode, name: country.name });
      setSelectedState({ isoCode: state.isoCode, name: state.name });
      setSelectedCity(city);
    }
  }, [address]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry.isoCode) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
      if (!address) {
        setSelectedState({ isoCode: '', name: '' });
        setCities([]);
        setSelectedCity('');
      }
    }
  }, [selectedCountry, address]);

  useEffect(() => {
    if (selectedState.isoCode) {
      const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
      setCities(stateCities);
      if (!address) {
        setSelectedCity('');
      }
    }
  }, [selectedState, selectedCountry, address]);

  const handleCountryChange = (e) => {
    const selectedOption = countries.find(country => country.isoCode === e.target.value);
    setSelectedCountry({ isoCode: selectedOption.isoCode, name: selectedOption.name });
  };

  const handleStateChange = (e) => {
    const selectedOption = states.find(state => state.isoCode === e.target.value);
    setSelectedState({ isoCode: selectedOption.isoCode, name: selectedOption.name });
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const alphaNumRegex = /^[A-Za-z\s]+$/;
    const zipRegex = /^\d{6}$/;

    if (!addressFormData.Name.trim()) {
      newErrors.Name = "Name is required";
    } else if (!alphaNumRegex.test(addressFormData.Name)) {
      newErrors.Name = "Enter only alphabets";
    }
    if (!addressFormData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address 1 is required";
    } else if (addressFormData.addressLine1.length > 40) {
      newErrors.addressLine1 = "Address 1 should not be more than 40 characters";
    }

    if (!addressFormData.addressLine2.trim()) {
      newErrors.addressLine2 = "Address 2 is required";
    } else if (addressFormData.addressLine2.length > 40) {
      newErrors.addressLine2 = "Address 2 should not be more than 40 characters";
    }

    if (!addressFormData.zip.trim()) {
      newErrors.zip = "Pincode is required";
    } else if (!zipRegex.test(addressFormData.zip)) {
      newErrors.zip = "Pincode should be exactly 6 digits";
    }

    if (!selectedCountry.name.trim()) {
      newErrors.country = "Country is required";
    } else if (!alphaNumRegex.test(addressFormData.country)) {
      newErrors.country = "Country should contain only alphabets";
    }

    if (!selectedCity.trim()) {
      newErrors.city = "City is required";
    } else if (!alphaNumRegex.test(addressFormData.city)) {
      newErrors.city = "City should contain only alphabets";
    }

    if (!selectedState.name.trim()) {
      newErrors.state = "State is required";
    } else if (!alphaNumRegex.test(addressFormData.state)) {
      newErrors.state = "State should contain only alphabets";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const editAddressPayload = {
      ...addressFormData,
      country: selectedCountry.name,
      city: selectedCity,
      state: selectedState.name
    }

    try {
      const response = await apiPUT(`/v1/address/update-address/${address._id}`, editAddressPayload);
      if (response.status) {
        setAddressFormData(response?.data?.data);
        togglePopup();
        onUpdate(); // Call the onUpdate callback to refresh the address list
        toast.success('Address updated successfully');
      } else {
        console.error('Error updating address:', response.data.message);
        toast.error('Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    }
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={popupRef} className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[732px] max-h-[90vh] overflow-y-auto scrollbar-custom scroll-smooth relative">
            <button
              onClick={togglePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h1 className="text-xl font-bold mb-4">Edit Address</h1>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="Name"
                    value={addressFormData.Name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {errors.Name && <span className="text-xs text-red-500">{errors.Name}</span>}
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Address 1</label>
                <textarea
                  name="addressLine1"
                  value={addressFormData.addressLine1}
                  onChange={handleChange}
                  placeholder="Address 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                {errors.addressLine1 && <span className="text-xs text-red-500">{errors.addressLine1}</span>}
              </div>
              <div>
                <label className="block text-gray-700">Address 2</label>
                <textarea
                  name="addressLine2"
                  value={addressFormData.addressLine2}
                  onChange={handleChange}
                  placeholder="Address 2 (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                {errors.addressLine2 && <span className="text-xs text-red-500">{errors.addressLine2}</span>}
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="zip"
                    value={addressFormData.zip}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {errors.zip && <span className="text-xs text-red-500">{errors.zip}</span>}
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700">Country</label>
                  <select value={selectedCountry.isoCode} onChange={handleCountryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && <span className="text-xs text-red-500">{errors.country}</span>}
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700">State</label>
                  <select value={selectedState.isoCode} onChange={handleStateChange} disabled={!selectedCountry.isoCode}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700">City</label>
                  <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState.isoCode}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
                </div>
              </div>
              <button type="submit" className='rounded-full bg-[#14967F] text-sm text-[#FFFFFF] p-3'>Save & Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
