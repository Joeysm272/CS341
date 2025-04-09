import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const dayMap = {
  SU: 'Sunday',
  MO: 'Monday',
  TU: 'Tuesday',
  WE: 'Wednesday',
  TH: 'Thursday',
  FR: 'Friday',
  SA: 'Saturday'
};

const MembershipDashboard = () => {

  const [user] = useState(() => ({
    userId: localStorage.getItem('userId'),
    firstName: localStorage.getItem('firstName'),
    lastName: localStorage.getItem('lastName'),
    email: localStorage.getItem('email'),
  }));

  // Create a profile object for display
  const [profile] = useState({
    name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'John Doe',
    status: 'Active Member',
    email: user.email || 'johndoe@example.com'
  });

  // State to hold the user's registrations (if needed)
  const [registrations, setRegistrations] = useState([]);

  // State for notifications
  const [notifications, setNotifications] = useState([]);

  // Fetch the registered classes for the current user (if needed)
  useEffect(() => {
    const getMyRegistrations = async () => {
      if (!user.userId) return;
      try {
        const res = await fetch(`http://localhost:8000/registrations/my-registrations/${user.userId}`);
        if (!res.ok) throw new Error('Failed to fetch registrations');
        const data = await res.json();
        setRegistrations(data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      }
    };
    getMyRegistrations();
  }, [user.userId]);

  // Fetch notifications for the current user
  useEffect(() => {
    const getNotifications = async () => {
      if (!user.userId) return;
      try {
        const res = await fetch(`http://localhost:8000/notifications/${user.userId}`);
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    getNotifications();
  }, [user.userId]);

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Membership Dashboard</h1>

        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {profile.name}</h2>
          <p>Membership Status: {profile.status}</p>
          <p>Email: {profile.email}</p>
        </div>

        {/* Registered Classes Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">My Registered Classes</h2>
          {registrations.length === 0 ? (
            <p className="text-gray-500">You are not registered for any classes yet.</p>
          ) : (
            <ul className="space-y-4">
              {registrations.map((reg, idx) => {
                // Each registration contains a reference to the program via reg.programId
                const cls = reg.programId;
                return (
                  <li key={reg._id || idx} className="p-4 border rounded-lg shadow-sm bg-gray-50">
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
                      First Class:{' '}
                      {new Date(cls.startDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Last Class:{' '}
                      {new Date(cls.endDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">Location: {cls.location}</p>
                    {cls.availableDays && cls.availableDays.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Occurs on:{' '}
                        {cls.availableDays
                          .map((dayAbbr) => dayMap[dayAbbr] || dayAbbr)
                          .join(', ')}{' '}
                        ({cls.availableDays.length}{' '}
                        {cls.availableDays.length > 1 ? 'days' : 'day'} per week)
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Notifications Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications at this time.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((note, idx) => (
                <li key={note._id || idx} className="border p-2 rounded">
                  <p>{note.message}</p>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(note.date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipDashboard;
