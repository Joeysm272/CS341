import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ClassCalendar from '../components/ClassCalendar';

const MembershipDashboard = () => {
  // Dummy profile data for now
  const [profile, setProfile] = useState({
    name: 'John Doe',
    status: 'Active Member',
    email: 'johndoe@example.com',
  });
  // State to store class data fetched from the backend
  const [classes, setClasses] = useState([]);
  // Dummy notifications for now
  const [notifications, setNotifications] = useState([
    {
      message: 'Your class "Yoga for Beginners" starts in 1 hour.',
      date: new Date().toISOString(),
    },
    {
      message: 'Class "Advanced Swimming" has been cancelled.',
      date: new Date().toISOString(),
    },
  ]);

  // State to toggle calendar modal popup
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch class data from the backend on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('http://localhost:8000/programs');
        if (!res.ok) throw new Error('Failed to fetch classes');
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Membership Dashboard</h1>

        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {profile.name}</h2>
          <p>Membership Status: {profile.status}</p>
          <p>Email: {profile.email}</p>
        </div>

        {/* Calendar Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowCalendar(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Show Your Class Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Classes Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Available Classes</h2>
            {classes.length > 0 ? (
              <ul className="space-y-4">
                {classes.map((cls, idx) => (
                  <li key={cls._id || idx} className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold">
                      {cls.programName} ({cls.type})
                    </h3>
                    <p className="text-sm text-gray-600">
                      First Class:{' '}
                      {new Date(cls.startDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Last Class:{' '}
                      {new Date(cls.endDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">Location: {cls.location}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No classes available.</p>
            )}
          </div>

          {/* Notifications Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.map((note, idx) => (
                  <li key={idx} className="border p-2 rounded">
                    {note.message}
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(note.date).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications at this time.</p>
            )}
          </div>
        </div>

        {/* Calendar Modal */}
        {showCalendar && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative">
              <button
                onClick={() => setShowCalendar(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
              <ClassCalendar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipDashboard;
