import React, { useState } from 'react';
import Navbar from '../components/navbar'

const StaffHome = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    instructor: '',
    time: '',
    location: '',
    maxParticipants: '',
    description: '',
    enrolled: 0, // Track enrollments
  });

  const [editIndex, setEditIndex] = useState(null);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editIndex !== null) {
      // Edit existing class
      const updatedClasses = [...classes];
      updatedClasses[editIndex] = formData;
      setClasses(updatedClasses);
      setEditIndex(null);
    } else {
      // Add new class
      setClasses([...classes, formData]);
    }

    // Reset form
    setFormData({
      name: '',
      type: '',
      instructor: '',
      time: '',
      location: '',
      maxParticipants: '',
      description: '',
      enrolled: 0,
    });
  };

  // Handle deleting a class
  const handleDelete = (index) => {
    const updatedClasses = classes.filter((_, i) => i !== index);
    setClasses(updatedClasses);
  };

  // Handle editing a class
  const handleEdit = (index) => {
    setFormData(classes[index]);
    setEditIndex(index);
  };

  // Handle class enrollment (mock)
  const handleEnroll = (index) => {
    const updatedClasses = [...classes];
    if (updatedClasses[index].enrolled < updatedClasses[index].maxParticipants) {
      updatedClasses[index].enrolled += 1;
      setClasses(updatedClasses);
    }
  };

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div>
        <header className="bg-teal-600 text-white p-4 text-center text-2xl font-bold">
          YMCA Staff Portal
        </header>

        <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? 'Edit Class' : 'Create a New Class'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Class Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded" required>
              <option value="">Select Class Type</option>
              <option value="Yoga">Yoga</option>
              <option value="Swimming">Swimming</option>
              <option value="HIIT">HIIT</option>
              <option value="Strength Training">Strength Training</option>
              <option value="Zumba">Zumba</option>
            </select>
            <input
              type="text"
              name="instructor"
              placeholder="Instructor Name"
              value={formData.instructor}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="datetime-local"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location (e.g., Studio A, Pool, Gym)"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="maxParticipants"
              placeholder="Max Participants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Class Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded"
            ></textarea>
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-blue-600">
              {editIndex !== null ? 'Update Class' : 'Create Class'}
            </button>
          </form>
        </div>

        {/* Display the Created Classes */}
        <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Classes</h2>
          {classes.length === 0 ? (
            <p className="text-gray-500">No classes created yet.</p>
          ) : (
            <ul className="space-y-4">
              {classes.map((cls, index) => (
                <li key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <h3 className="text-lg font-semibold">{cls.name} ({cls.type})</h3>
                  <p className="text-sm text-gray-600">Instructor: {cls.instructor}</p>
                  <p className="text-sm text-gray-600">Time: {new Date(cls.time).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Location: {cls.location}</p>
                  <p className="text-sm text-gray-600">Max Participants: {cls.maxParticipants}</p>
                  <p className="text-sm text-gray-700 mt-2">{cls.description}</p>

                  {/* Enrollment Counter */}
                  <p className="text-sm font-bold text-green-600">
                    Enrolled: {cls.enrolled} / {cls.maxParticipants}
                  </p>

                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffHome;

