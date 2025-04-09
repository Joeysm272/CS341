import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Programs = () => {
  // Get current userId from localStorage
  const userId = localStorage.getItem('userId');

  const [programList, setProgramList] = useState([]);
  // New state to store the current user's registrations
  const [myRegistrations, setMyRegistrations] = useState([]);

  // Fetch all programs
  useEffect(() => {
    const getPrograms = async () => {
      try {
        const res = await fetch('http://localhost:8000/programs');
        if (!res.ok) throw new Error('Failed to fetch programs');
        const data = await res.json();
        setProgramList(data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    getPrograms();
  }, []);

  // Fetch registrations for the current user
  useEffect(() => {
    const getMyRegistrations = async () => {
      if (!userId) return;
      try {
        // We'll assume your backend exposes an endpoint to get registrations for a specific user.
        const res = await fetch(`http://localhost:8000/registrations/my-registrations/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch registrations');
        const data = await res.json();
        setMyRegistrations(data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      }
    };

    getMyRegistrations();
  }, [userId]);

  // Register a user for a program. 
  // (Make sure your backend registration endpoint accepts the memberId and programId.)
  const registerForProgram = async (programId) => {
    try {
      const res = await fetch(`http://localhost:8000/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: userId, programId })
      });
      const registrationData = await res.json();
      if (res.ok) {
        // Update local program list (for the enrollment counter), if applicable:
        setProgramList(prevPrograms =>
          prevPrograms.map(program =>
            program._id === programId
              ? { ...program, enrolled: program.enrolled + 1 }
              : program
          )
        );

        // Update local registrations state to reflect the new registration.
        setMyRegistrations(prev => [...prev, registrationData]);
      } else {
        console.error('Registration failed:', registrationData.error);
        alert(registrationData.error);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Classes</h2>
        {programList.length === 0 ? (
          <p className="text-gray-500">No classes created yet.</p>
        ) : (
          <ul className="space-y-4">
            {programList.map((cls, index) => {
              // Check if the user is registered for this program
              const isRegistered = myRegistrations.some(
                (reg) => reg.programId.toString() === cls._id.toString()
              );
              return (
                <li key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <h3 className="text-lg font-semibold">
                    {cls.programName} ({cls.type})
                  </h3>
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
                  <p className={`text-sm font-bold ${
                    cls.enrolled >= cls.capacity
                      ? 'text-red-600'
                      : cls.enrolled / cls.capacity >= 0.75
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    Enrolled: {cls.enrolled}/{cls.capacity}
                  </p>
                  {/* Show register button if not already registered, otherwise show "Registered" label */}
                  {isRegistered ? (
                    <span className="bg-gray-500 text-white px-3 py-2 rounded">
                      Registered
                    </span>
                  ) : (
                    <span title={cls.enrolled >= cls.capacity ? 'Class is full' : ''}>
                      <button
                        onClick={() => registerForProgram(cls._id)}
                        className={`border rounded px-3 py-2 ${
                          cls.enrolled >= cls.capacity
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none'
                            : 'bg-teal-500 text-white hover:bg-teal-600 pointer-events-auto'
                        }`}
                        disabled={cls.enrolled >= cls.capacity}
                      >
                        Register
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Programs;
