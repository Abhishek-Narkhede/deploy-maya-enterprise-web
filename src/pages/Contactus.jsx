import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faDollarSign, faNewspaper, faBug } from '@fortawesome/free-solid-svg-icons';
import scrollToTop from '../utilities/scrollToTop';

const iconMap = {
  phone: faPhone,
  'dollar-sign': faDollarSign,
  newspaper: faNewspaper,
  bug: faBug,
};

const ContactUs = () => {
  useEffect(()=>{
    scrollToTop();

  },[])
  return (
    <div className="container mx-auto p-8">
      <h2 className="text-center text-3xl font-bold mb-8">Contact us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="p-6 rounded-lg shadow-sm">
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 text-white font-semibold py-2 rounded-md shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              SEND
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ContactDetail
              icon="phone"
              title="Technical support"
              email="support@example.com"
              phone="+1 234-567-89"
            />
            <ContactDetail
              icon="dollar-sign"
              title="Sales questions"
              email="sales@example.com"
              phone="+1 234-567-89"
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ContactDetail
              icon="newspaper"
              title="Press"
              email="press@example.com"
              phone="+1 234-567-89"
            />
            <ContactDetail
              icon="bug"
              title="Bug report"
              email="bugs@example.com"
              phone="+1 234-567-89"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactDetail = ({ icon, title, email, phone }) => {
  return (
    <div className="flex items-start space-x-4 p-4 border-gray-200 rounded-lg shadow-sm mt-9">
      <div className="text-teal-500 text-2xl">
        <FontAwesomeIcon icon={iconMap[icon]} />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <p className="text-gray-600">{email}</p>
        <p className="text-gray-600">{phone}</p>
      </div>
    </div>
  );
};

export default ContactUs;
