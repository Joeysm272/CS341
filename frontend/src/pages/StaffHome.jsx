import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'

const StaffHome = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    programName: '',
    type: '',
    instructor: '',
    startDate: '',
    endDate: '',
    location: '',
    capacity: '',
    memberPrice: '',
    nonMemberPrice: '',
    desc: '',
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
      programName: '',
      type: '',
      instructor: '',
      startDate: '',
      endDate: '',
      location: '',
      capacity: '',
      memberPrice: '',
      nonMemberPrice: '',
      desc: '',
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

  const createProgram = async () => {
    fetch('http://localhost:8000/programs', {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Telling the server we’re sending JSON
      },
      body: JSON.stringify({
        programName: formData.programName,
        type: formData.type,
        instructor: formData.instructor,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        capacity: formData.capacity,
        memberPrice: formData.memberPrice,
        nonMemberPrice: formData.nonMemberPrice,
        desc: formData.desc,
        enrolled: 0,
      })
    })
  }

  const deleteProgram = async (id) => {
    fetch(`http://localhost:8000/programs/${id}`, {
      method: "DELETE"
    })
  }


  useEffect(() => {
    const getPrograms = async () => {
      const res = await fetch('http://localhost:8000/programs');
      const data = await res.json();
      setClasses(data);
    }

    getPrograms();
  }, []);

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
              name="programName"
              placeholder="Class Name"
              value={formData.programName}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded" required>
              <option value="">Select Class Type</option>
              <option value="Yoga">Yoga</option>
              <option value="Swimming">Swimming</option>
              <option value="Log Rolling">Log Rolling</option>
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
            <div>
              <label htmlFor="startDate" style={{ marginRight: '8px'}}>Start Date:</label>
              <input
                id="startDate"
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" style={{ marginRight: '15px'}}>End Date:</label>
              <input
                id="endDate"
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                // Set the minimum allowed end date to the chosen start date.
                min={formData.startDate || new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

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
              name="capacity"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="memberPrice"
              placeholder="Memeber Price"
              value={formData.memberPrice}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="nonMemberPrice"
              placeholder="Non-Memeber Price"
              value={formData.nonMemberPrice}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <textarea
              name="desc"
              placeholder="Class Description"
              value={formData.desc}
              onChange={handleChange}
              className="border p-2 rounded"
            ></textarea>
            <button type="submit" onClick={createProgram} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-blue-600">
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
                  <h3 className="text-lg font-semibold">{cls.programName} ({cls.type})</h3>
                  <p className="text-sm text-gray-600">Instructor: {cls.instructor}</p>
                  <p className="text-sm text-gray-600">
                    First Class:{" "}
                    {new Date(cls.startDate).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last Class:{" "}
                    {new Date(cls.endDate).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">Location: {cls.location}</p>
                  <p className="text-sm text-gray-600">Capacity: {cls.capacity}</p>
                  <p className="text-sm text-gray-600">Member Price: ${cls.memberPrice}</p>
                  <p className="text-sm text-gray-600">Non-Member Price: ${cls.nonMemberPrice}</p>
                  <p className="text-sm text-gray-700 mt-2">{cls.desc}</p>

                  {/* Enrollment Counter */}
                  <p className="text-sm font-bold text-green-600">
                    Enrolled: {cls.enrolled} / {cls.capacity}
                  </p>

                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {deleteProgram(classes[index]._id), handleDelete(index)}}
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

