import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../index.css';

const Memberships = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newFamilyMember, setNewFamilyMember] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamilyMember({ ...newFamilyMember, [name]: value });
  };

  const addFamilyMember = () => {
    if (newFamilyMember.firstName && newFamilyMember.lastName && newFamilyMember.relationship) {
      setFamilyMembers([...familyMembers, newFamilyMember]);
      setNewFamilyMember({ firstName: '', lastName: '', relationship: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-left text-3xl font-serif">Account Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Family Members</label>
          <ul className="mt-2 bg-gray-100 p-2 rounded-md shadow-sm">
            {familyMembers.map((member, index) => (
              <li key={index} className="p-1 border-b">{`${member.firstName} ${member.lastName} (${member.relationship})`}</li>
            ))}
          </ul>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
          >
            + Add Family Member
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">Add Family Member</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                name="firstName"
                value={newFamilyMember.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                name="lastName"
                value={newFamilyMember.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Relationship</label>
              <select
                name="relationship"
                value={newFamilyMember.relationship}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={addFamilyMember}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memberships;
