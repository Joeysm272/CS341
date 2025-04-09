import React, { useState } from 'react';

const allowedDays = [
  { label: 'Mon', value: 'MO' },
  { label: 'Tue', value: 'TU' },
  { label: 'Wed', value: 'WE' },
  { label: 'Thu', value: 'TH' },
  { label: 'Fri', value: 'FR' },
  { label: 'Sat', value: 'SA' },
  { label: 'Sun', value: 'SU' },
];

const RecurrenceDaysForm = ({ onDaysSubmit }) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [error, setError] = useState('');

  const handleCheckboxChange = (e) => {
    const day = e.target.value;
    // Only allow values defined in allowedDays.
    if (!allowedDays.some(d => d.value === day)) return;

    if (e.target.checked) {
      setSelectedDays(prev => [...prev, day]);
    } else {
      setSelectedDays(prev => prev.filter(d => d !== day));
    }
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      setError('Please select at least one day.');
      return;
    }
    onDaysSubmit(selectedDays);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded my-4">
      <label className="block font-medium mb-2">Select the Days the Class Occurs</label>
      <div className="flex gap-2">
        {allowedDays.map(dayObj => (
          <label key={dayObj.value} className="flex items-center gap-1">
            <input
              type="checkbox"
              value={dayObj.value}
              onChange={handleCheckboxChange}
              className="border"
            />
            <span>{dayObj.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
      >
        Save Days
      </button>
    </form>
  );
};

export default RecurrenceDaysForm;
