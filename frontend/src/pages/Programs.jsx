//This is the programs page of the frontend application
// It displays a list of available programs and allows users to register for them.
// It also fetches the user's registrations and displays them accordingly.
//Authors: Joey Smith, Macy Bindl, Preston Piranio
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Programs = () => {
  // Get current userId from localStorage
  const userId = localStorage.getItem('userId');

  const [programList, setProgramList] = useState([]);
  // State to store the current user's registrations
  const [myRegistrations, setMyRegistrations] = useState([]);

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

  // Helper function to convert "HH:mm" (24-hour) to "h:mm AM/PM"
  const convertTo12Hour = (timeStr) => {
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr; // string format
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

  // Register a user for a program
  const registerForProgram = async (programId) => {
    try {
      // Create a new registration
      const res = await fetch(`http://localhost:8000/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: userId, programId })
      });
      const registrationData = await res.json();
      if (res.ok) {
        // Now update the program's enrollment counter in the DB
        const resEnroll = await fetch(`http://localhost:8000/programs/${programId}/enrollment`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        const updatedProgram = await resEnroll.json();
        if (!resEnroll.ok) {
          console.error("Failed to update enrollment count");
        } else {
          // Update local programList with the new enrolled count
          setProgramList(prevPrograms =>
            prevPrograms.map(program =>
              program._id === programId
                ? { ...program, enrolled: updatedProgram.enrolled }
                : program
            )
          );
        }
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`; // Returns MM/DD/YYYY format
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
              // Check if the current user is registered for this program:
              const isRegistered = myRegistrations.some((reg) => {
                if (typeof reg.programId === 'object' && reg.programId !== null) {
                  return reg.programId._id.toString() === cls._id.toString();
                }
                return reg.programId.toString() === cls._id.toString();
              });
              return (
                <li key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <h3 className="text-lg font-semibold">
                    {cls.programName} ({cls.type})
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
