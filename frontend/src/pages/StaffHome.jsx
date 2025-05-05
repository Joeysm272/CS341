import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ReportFilters from '../components/ReportFilters';
import RegistrationReportTable from '../components/RegistrationReportTable';

const StaffHome = () => {
  // — Programs & registrations —
  const [classes, setClasses] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);

  // — Create/Edit form state —
  const [formData, setFormData] = useState({
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
  const [editIndex, setEditIndex] = useState(null);

  // — Member lookup & deactivation —
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  // — Class Search —
  const [classSearchQuery, setClassSearchQuery] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [showClassSearchPopup, setShowClassSearchPopup] = useState(false);

  // — Report (Jan–Jun 2025) —
  const [reportRange, setReportRange] = useState({
    startDate: '2025-01-01',
    endDate:   '2025-06-30'
  });
  const [reportData, setReportData] = useState([]);  
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError]     = useState('');

  // Day‐name mapping
  const dayMap = {
    SU: 'Sunday', MO: 'Monday', TU: 'Tuesday', WE: 'Wednesday',
    TH: 'Thursday', FR: 'Friday', SA: 'Saturday'
  };

  // Helpers
  const computeDuration = (start, end) => {
    if (!start || !end) return '';
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    let diff = new Date(0,0,0,eH,eM) - new Date(0,0,0,sH,sM);
    if (diff < 0) diff += 24*60*60*1000;
    const mins = Math.floor(diff/60000), h = Math.floor(mins/60), m = mins%60;
    return `${h} hour${h!==1?'s':''} ${m} minute${m!==1?'s':''}`;
  };
  const convertTo12Hour = t => {
    if (!t) return '';
    let [h,m] = t.split(':').map(Number), period = 'AM';
    if (h === 0) h = 12;
    else if (h === 12) period = 'PM';
    else if (h > 12) { h -= 12; period = 'PM'; }
    return `${h}:${m.toString().padStart(2,'0')} ${period}`;
  };
  const formatDate = iso => {
    if (!iso) return '';
    const [y,mo,da] = iso.split('T')[0].split('-');
    return `${mo}/${da}/${y}`;
  };

  // Fetch programs
  useEffect(() => {
    fetch('http://localhost:8000/programs')
      .then(r => r.json())
      .then(setClasses)
      .catch(console.error);
  }, []);

  // Fetch registrations
  useEffect(() => {
    fetch('http://localhost:8000/registrations')
      .then(r => r.json())
      .then(setAllRegistrations)
      .catch(console.error);
  }, []);

  // Re-fetch programs when registrations change
  useEffect(() => {
    fetch('http://localhost:8000/programs')
      .then(r => r.json())
      .then(setClasses)
      .catch(console.error);
  }, [allRegistrations]);

  // Fetch registrations report when range changes
  useEffect(() => {
    const fetchReport = async () => {
      setReportLoading(true);
      setReportError('');
      try {
        const { startDate, endDate } = reportRange;
        const res = await fetch(
          `http://localhost:8000/reports/registrations?start=${startDate}&end=${endDate}`
        );
        if (!res.ok) throw new Error(res.statusText);
        setReportData(await res.json());
      } catch (err) {
        console.error(err);
        setReportError('Failed to load report.');
      } finally {
        setReportLoading(false);
      }
    };
    fetchReport();
  }, [reportRange]);

  // Create or Update program
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let res, data;
      if (editIndex !== null) {
        const id = classes[editIndex]._id;
        res = await fetch(`http://localhost:8000/programs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error();
        data = await res.json();
        setClasses(cs => {
          const arr = [...cs];
          arr[editIndex] = data;
          return arr;
        });
        setEditIndex(null);
      } else {
        res = await fetch('http://localhost:8000/programs', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error();
        data = await res.json();
        setClasses(cs => [...cs, data]);
      }
      // reset form
      setFormData({
        programName:'', type:'', instructor:'',
        startDate:'', endDate:'',
        startTime:'', endTime:'',
        availableDays:[], location:'',
        capacity:'', memberPrice:'',
        nonMemberPrice:'', desc:'',
        enrolled:0, cancelled:false
      });
    } catch (err) {
      console.error(err);
      alert('Error saving program');
    }
  };

  // Prefill form for editing
  const handleEdit = idx => {
    const c = classes[idx];
    setFormData({
      ...c,
      startDate: c.startDate.split('T')[0],
      endDate:   c.endDate.split('T')[0],
      startTime: c.startTime || '',
      endTime:   c.endTime   || ''
    });
    setEditIndex(idx);
  };

  // Cancel a class
  const cancelClass = async id => {
    const res = await fetch(`http://localhost:8000/programs/${id}/cancel`, {
      method:'PUT', headers:{'Content-Type':'application/json'}
    });
    if (!res.ok) {
      const err = await res.json();
      return alert(err.error || 'Cancel failed');
    }
    setClasses(cs => cs.map(c => c._id===id ? { ...c, cancelled: true } : c));
    alert('Class cancelled and notifications sent.');
  };

  // Form field handlers
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };
  const handleAvailableDaysChange = e => {
    const { value, checked } = e.target;
    setFormData(f => ({
      ...f,
      availableDays: checked
        ? [...f.availableDays, value]
        : f.availableDays.filter(d => d!==value)
    }));
  };

  // Member lookup
  const handleMemberSearch = () => {
    const q = memberSearchQuery.toLowerCase().trim();
    const results = allRegistrations.filter(reg => {
      const full = `${reg.memberId.firstName} ${reg.memberId.lastName}`.toLowerCase();
      return full.includes(q);
    });
    setSearchResults(results);
    setShowSearchPopup(true);
  };

  // Deactivate member
  const deactivateMember = async () => {
    if (!searchResults.length) return;
    const userId = searchResults[0].memberId._id;
    if (!window.confirm('Deactivate this member and cancel their registrations?')) return;
    const res = await fetch(`http://localhost:8000/users/${userId}`, { method:'DELETE' });
    if (!res.ok) return alert('Failed to deactivate');
    alert('Member deactivated and registrations cancelled.');
    setShowSearchPopup(false);
  };

  // Class search
  const handleClassSearch = () => {
    const q = classSearchQuery.toLowerCase().trim();
    const matches = classes.filter(c =>
      c.programName.toLowerCase().includes(q)
    );
    setFilteredClasses(matches);
    setShowClassSearchPopup(true);
  };

  return (
    <div className="bg-gray-100">
      <Navbar/>
      <div className="max-w-4xl mx-auto p-6">
        <header className="bg-teal-600 text-white p-4 text-center text-2xl font-bold">
          YMCA Staff Portal
        </header>

        {/* 🔍 Unified Member Search & Deactivate */}
        <div className="my-6 flex gap-2">
          <input
            type="text"
            placeholder="Search member by name…"
            value={memberSearchQuery}
            onChange={e => setMemberSearchQuery(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleMemberSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* Member Popup */}
        {showSearchPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">
                {searchResults.length
                  ? `Member: ${searchResults[0].memberId.firstName} ${searchResults[0].memberId.lastName}`
                  : `No member found for “${memberSearchQuery}”`}
              </h2>
              {searchResults.length > 0 && (
                <>
                  <ul className="space-y-2 max-h-64 overflow-y-auto mb-4">
                    {searchResults.map(reg => (
                      <li key={reg._id} className="border p-2 rounded">
                        <p className="font-semibold">{reg.programId.programName}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(reg.programId.startDate)} – {formatDate(reg.programId.endDate)}<br/>
                          {convertTo12Hour(reg.programId.startTime)} – {convertTo12Hour(reg.programId.endTime)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={deactivateMember}
                    className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Deactivate Member
                  </button>
                </>
              )}
              <button
                onClick={() => setShowSearchPopup(false)}
                className="block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* 📊 Jan–Jun 2025 Registrations Report */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Registrations Report</h2>
          <ReportFilters
            startDate={reportRange.startDate}
            endDate={reportRange.endDate}
            onChange={setReportRange}
          />
          {reportLoading && <p>Loading report…</p>}
          {reportError && <p className="text-red-600">{reportError}</p>}
          {!reportLoading && !reportError && (
            <RegistrationReportTable data={reportData} />
          )}
        </div>

        {/* ➕ Create / Edit Class */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editIndex !== null ? 'Edit Class' : 'Create a New Class'}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
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
              <option>Yoga</option>
              <option>Swimming</option>
              <option>Log Rolling</option>
              <option>Strength Training</option>
              <option>Zumba</option>
            </select>
            <input
              name="instructor"
              placeholder="Instructor Name"
              value={formData.instructor}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.startDate}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label>End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  value={formData.endDate}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label>End Time:</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>

            {formData.startTime && formData.endTime && (
              <p className="text-gray-600">
                Duration: {convertTo12Hour(formData.startTime)} – {convertTo12Hour(formData.endTime)} (
                {computeDuration(formData.startTime, formData.endTime)})
              </p>
            )}

            <input
              name="location"
              placeholder="Location"
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
              placeholder="Description"
              value={formData.desc}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            {/* Days of Week */}
            <div className="border p-3 rounded">
              <p className="font-medium mb-1">Days of Week:</p>
              <div className="flex flex-wrap gap-2">
                {['MO','TU','WE','TH','FR','SA','SU'].map(d => (
                  <label key={d} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={d}
                      checked={formData.availableDays.includes(d)}
                      onChange={handleAvailableDaysChange}
                    />
                    {dayMap[d]}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
            >
              {editIndex !== null ? 'Update Class' : 'Create Class'}
            </button>
          </form>
        </div>

        {/* 🔍 Class Search */}
        <div className="my-6 flex gap-2">
          <input
            type="text"
            placeholder="Search classes by name…"
            value={classSearchQuery}
            onChange={e => setClassSearchQuery(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleClassSearch}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Search Classes
          </button>
        </div>

        {/* Class Search Popup */}
        {showClassSearchPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">
                {filteredClasses.length
                  ? `Classes matching “${classSearchQuery}”`
                  : `No classes found for “${classSearchQuery}”`}
              </h2>
              {filteredClasses.length > 0 && (
                <ul className="space-y-2 max-h-64 overflow-y-auto mb-4">
                  {filteredClasses.map(c => (
                    <li key={c._id} className="border p-2 rounded">
                      <p className="font-semibold">{c.programName} ({c.type})</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(c.startDate)} – {formatDate(c.endDate)}<br/>
                        {convertTo12Hour(c.startTime)} – {convertTo12Hour(c.endTime)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setShowClassSearchPopup(false)}
                className="block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* 📋 Current Classes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Classes</h2>
          {classes.length === 0 ? (
            <p className="text-gray-500">No classes created yet.</p>
          ) : (
            <ul className="space-y-4">
              {classes.map((cls, i) => {
                const participants = allRegistrations.filter(
                  reg => reg.programId && reg.programId._id === cls._id
                );
                return (
                  <li
                    key={i}
                    className="border rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row justify-between gap-4"
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
                      <p className="text-gray-600">Instructor: {cls.instructor}</p>
                      <p className="text-gray-600">
                        {formatDate(cls.startDate)} – {formatDate(cls.endDate)}
                      </p>
                      <p className="text-gray-600">Location: {cls.location}</p>
                      {cls.startTime && cls.endTime && (
                        <p className="text-gray-600">
                          {convertTo12Hour(cls.startTime)} – {convertTo12Hour(cls.endTime)} (
                          {computeDuration(cls.startTime, cls.endTime)})
                        </p>
                      )}
                      <p className="text-gray-600">
                        Days: {cls.availableDays.map(d => dayMap[d]).join(', ')}
                      </p>
                      <p className={`font-bold ${
                        cls.enrolled >= cls.capacity
                          ? 'text-red-600'
                          : (cls.enrolled / cls.capacity >= 0.75 ? 'text-yellow-600' : 'text-green-600')
                      }`}>
                        Enrolled: {cls.enrolled}/{cls.capacity}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => handleEdit(i)}
                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      {!cls.cancelled ? (
                        <button
                          onClick={() => cancelClass(cls._id)}
                          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          Cancel Class
                        </button>
                      ) : (
                        <span className="px-3 py-2 bg-gray-700 text-white rounded">Cancelled</span>
                      )}
                      {/* Participant List */}
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
                          {participants.map(reg => (
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
