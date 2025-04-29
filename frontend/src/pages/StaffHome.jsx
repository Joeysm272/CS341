import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const StaffHome = () => {
  const [classes, setClasses] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]); // For displaying participants
  const [formData, setFormData] = useState({
    programName: '',
    type: '',
    instructor: '',
    startDate: '',
    endDate: '',
    startTime: '',       // e.g., "08:00"
    endTime: '',         // e.g., "09:30"
    availableDays: [],   // e.g., ['MO', 'WE', 'FR']
    location: '',
    capacity: '',
    memberPrice: '',
    nonMemberPrice: '',
    desc: '',
    enrolled: 0,
    cancelled: false     // Field to track cancellation
  });
  const [editIndex, setEditIndex] = useState(null);

  // Mapping for full day names
  const dayMap = {
    SU: 'Sunday',
    MO: 'Monday',
    TU: 'Tuesday',
    WE: 'Wednesday',
    TH: 'Thursday',
    FR: 'Friday',
    SA: 'Saturday'
  };

  // Helper function to compute duration between two "HH:mm" strings
  const computeDuration = (start, end) => {
    if (!start || !end) return '';
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let startDateObj = new Date(0, 0, 0, startH, startM);
    let endDateObj = new Date(0, 0, 0, endH, endM);
    let diff = endDateObj - startDateObj;
    if (diff < 0) diff += 24 * 60 * 60 * 1000;
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  // Helper function to convert "HH:mm" (24-hour) to "h:mm AM/PM"
  const convertTo12Hour = (timeStr) => {
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    let period = 'AM';
    if (hour === 0) {
      hour = 12;
    } else if (hour === 12) {
      period = 'PM';
    } else if (hour > 12) {
      hour = hour - 12;
      period = 'PM';
    }
    return `${hour}:${minute} ${period}`;
  };

  // Transform stored date and time fields for editing
  const handleEdit = (index) => {
    const classToEdit = classes[index];
    let startDateFormatted = '';
    let endDateFormatted = '';
    if (classToEdit.startDate) {
      startDateFormatted = new Date(classToEdit.startDate).toISOString().split('T')[0];
    }
    if (classToEdit.endDate) {
      endDateFormatted = new Date(classToEdit.endDate).toISOString().split('T')[0];
    }
    const startTime = classToEdit.startTime || '';
    const endTime = classToEdit.endTime || '';
    setFormData({
      ...classToEdit,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      startTime,
      endTime,
    });
    setEditIndex(index);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle availableDays checkboxes
  const handleAvailableDaysChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        availableDays: [...prev.availableDays, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        availableDays: prev.availableDays.filter(day => day !== value)
      }));
    }
  };

  // Updated handleSubmit for Create vs. Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res, postedData;
      if (editIndex !== null) {
        // Editing an existing class: use the PUT endpoint
        const programId = classes[editIndex]._id;
        res = await fetch(`http://localhost:8000/programs/${programId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update class');
        postedData = await res.json();
        const updatedClasses = [...classes];
        updatedClasses[editIndex] = postedData;
        setClasses(updatedClasses);
        setEditIndex(null);
      } else {
        // Creating a new class: use POST
        res = await fetch('http://localhost:8000/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create class');
        postedData = await res.json();
        setClasses(prev => [...prev, postedData]);
      }
    } catch (error) {
      console.error('Error posting/updating class:', error);
    }
    // Reset the form
    setFormData({
      programName: '',
      type: '',
      instructor: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      availableDays: [],
      location: '',
      capacity: '',
      memberPrice: '',
      nonMemberPrice: '',
      desc: '',
      enrolled: 0,
      cancelled: false,
    });
  };

  // Fetch existing programs from the backend
  useEffect(() => {
    const getPrograms = async () => {
      try {
        const res = await fetch('http://localhost:8000/programs');
        if (!res.ok) throw new Error('Failed to fetch classes');
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    getPrograms();
  }, []);

  // Fetch all registrations (for displaying participants)
  useEffect(() => {
    const fetchAllRegistrations = async () => {
      try {
        const res = await fetch("http://localhost:8000/registrations");
        if (!res.ok) throw new Error("Failed to fetch registrations");
        const data = await res.json();
        setAllRegistrations(data);
      } catch (err) {
        console.error("Error fetching all registrations:", err);
      }
    };
    fetchAllRegistrations();
  }, []);

  // Re-fetch programs whenever registrations change (to update enrollment count)
  useEffect(() => {
    const refetchPrograms = async () => {
      try {
        const res = await fetch('http://localhost:8000/programs');
        if (!res.ok) throw new Error('Failed to re-fetch programs');
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error('Error re-fetching programs:', error);
      }
    };
    refetchPrograms();
  }, [allRegistrations]);

  // Cancel class functionality
  const cancelClass = async (classId) => {
    try {
      const res = await fetch(`http://localhost:8000/programs/${classId}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClasses(prevPrograms =>
        prevPrograms.map(program =>
          program._id === classId ? { ...program, cancelled: true } : program
        )
      );
      alert("Class has been cancelled and notifications sent.");
    } catch (error) {
      console.error("Error cancelling class:", error);
      alert(error.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`; // Returns MM/DD/YYYY format
  };

  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  const handleMemberSearch = () => {
    // Convert search query to lower case for case-insensitive matching
    const query = memberSearchQuery.toLowerCase();
    const results = allRegistrations.filter((reg) => {
      if (reg.memberId && reg.memberId.firstName && reg.memberId.lastName) {
        const fullName = `${reg.memberId.firstName} ${reg.memberId.lastName}`.toLowerCase();
        return fullName.includes(query);
      }
      return false;
    });
    setSearchResults(results);
    setShowSearchPopup(true);
  };
  

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <header className="bg-teal-600 text-white p-4 text-center text-2xl font-bold">
          YMCA Staff Portal
        </header>
        {/* Member Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search member by name"
            value={memberSearchQuery}
            onChange={(e) => setMemberSearchQuery(e.target.value)}
            className="border p-2 rounded mr-2 w-2/3"
          />
          <button
            onClick={handleMemberSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search Member
          </button>
        </div>

        {/* Member Search Popup */}
        {showSearchPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              {searchResults.length === 0 ? (
                <p>No registrations found for "{memberSearchQuery}".</p>
              ) : (
                <ul className="space-y-2">
                  {searchResults.map((reg) => (
                    <li key={reg._id} className="border p-2 rounded">
                      <p className="font-semibold">
                        {reg.memberId.firstName} {reg.memberId.lastName}
                      </p>
                      <p>
                        {reg.programId.programName} ({reg.programId.type})
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setShowSearchPopup(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Form for Creating / Editing Classes */}
        <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editIndex !== null ? 'Edit Class' : 'Create a New Class'}
          </h2>
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
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
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
            {/* Date Fields (Side-by-Side) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date:
                </label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date:
                </label>
                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().slice(0, 10)}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>
            {/* Time Fields (Side-by-Side) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Start Time:
                </label>
                <input
                  id="startTime"
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  End Time:
                </label>
                <input
                  id="endTime"
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>
            {/* Duration Display */}
            {formData.startTime && formData.endTime && (
              <p className="text-sm text-gray-600">
                Duration: {convertTo12Hour(formData.startTime)} - {convertTo12Hour(formData.endTime)} (
                {computeDuration(formData.startTime, formData.endTime)})
              </p>
            )}
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
              placeholder="Member Price"
              value={formData.memberPrice}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="nonMemberPrice"
              placeholder="Non-Member Price"
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
            {/* Inline Available Days Selection */}
            <div className="border p-4 rounded">
              <label className="block font-medium mb-2">
                Select the Days the Class Occurs:
              </label>
              <div className="flex gap-2">
                {[
                  { label: 'Mon', value: 'MO' },
                  { label: 'Tue', value: 'TU' },
                  { label: 'Wed', value: 'WE' },
                  { label: 'Thu', value: 'TH' },
                  { label: 'Fri', value: 'FR' },
                  { label: 'Sat', value: 'SA' },
                  { label: 'Sun', value: 'SU' },
                ].map((day) => (
                  <label key={day.value} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={day.value}
                      onChange={handleAvailableDaysChange}
                      checked={formData.availableDays.includes(day.value)}
                      className="border"
                    />
                    <span>{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
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
              {classes.map((cls, index) => {
                // Filter registrations to get enrolled participants
                const participants = allRegistrations.filter(
                  (reg) => reg.programId && reg.programId._id.toString() === cls._id.toString()
                );
                return (
                  <li
                    key={index}
                    className="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {cls.programName} ({cls.type})
                        {cls.cancelled && (
                          <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            Cancelled
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">Instructor: {cls.instructor}</p>
                      <p className="text-sm text-gray-600">
                        First Class: {formatDate(cls.startDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last Class: {formatDate(cls.endDate)}
                      </p>
                      <p className="text-sm text-gray-600">Location: {cls.location}</p>
                      <p className="text-sm text-gray-600">Capacity: {cls.capacity}</p>
                      <p className="text-sm text-gray-600">Member Price: ${cls.memberPrice}</p>
                      <p className="text-sm text-gray-600">Non-Member Price: ${cls.nonMemberPrice}</p>
                      <p className="text-sm text-gray-700 mt-2">{cls.desc}</p>
                      {cls.startTime && cls.endTime && (
                        <p className="text-sm text-gray-600">
                          Duration: {convertTo12Hour(cls.startTime)} - {convertTo12Hour(cls.endTime)} (
                          {(() => {
                            const computeDuration = (start, end) => {
                              const [sH, sM] = start.split(':').map(Number);
                              const [eH, eM] = end.split(':').map(Number);
                              let sDate = new Date(0, 0, 0, sH, sM);
                              let eDate = new Date(0, 0, 0, eH, eM);
                              let diff = eDate - sDate;
                              if (diff < 0) diff += 24 * 60 * 60 * 1000;
                              const totalMins = Math.floor(diff / 60000);
                              const hours = Math.floor(totalMins / 60);
                              const minutes = totalMins % 60;
                              return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
                            };
                            return computeDuration(cls.startTime, cls.endTime);
                          })()}
                          )
                        </p>
                      )}
                      {cls.availableDays && cls.availableDays.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Occurs on:{" "}
                          {cls.availableDays
                            .map((dayAbbr) => dayMap[dayAbbr] || dayAbbr)
                            .join(", ")}{" "}
                          ({cls.availableDays.length} {cls.availableDays.length > 1 ? 'days' : 'day'} per week)
                        </p>
                      )}
                      <p className={`text-sm font-bold ${
                        cls.enrolled >= cls.capacity
                          ? 'text-red-600'
                          : (cls.enrolled / cls.capacity >= 0.75 ? 'text-yellow-600' : 'text-green-600')
                      }`}>
                        Enrolled: {cls.enrolled}/{cls.capacity}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col items-end">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 mb-2"
                      >
                        Edit
                      </button>
                      {/* Cancel Class Button */}
                      {!cls.cancelled ? (
                        <button
                          onClick={() => cancelClass(cls._id)}
                          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          Cancel Class
                        </button>
                      ) : (
                        <span className="bg-gray-700 text-white px-3 py-2 rounded">
                          Cancelled
                        </span>
                      )}
                      {/* Participant Search and List */}
                      <div className="mt-4 w-full">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Enrolled Participants
                        </h4>
                        <input
                          type="text"
                          placeholder="Search participants..."
                          className="w-full p-2 border border-gray-300 rounded mb-3"
                        />
                        <ul className="space-y-1 max-h-32 overflow-y-auto">
                          {allRegistrations
                            .filter(
                              (reg) =>
                                reg.programId &&
                                reg.programId._id.toString() === cls._id.toString()
                            )
                            .map((reg) => (
                              <li key={reg._id} className="text-sm">
                                {reg.memberId.firstName} {reg.memberId.lastName}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffHome;
