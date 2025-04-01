import React, {useState, useEffect} from 'react'
import Navbar from '../components/Navbar';

const Programs = () => {

  const [programList, setProgramList] = useState([]);

  useEffect(() => {
    const getPrograms = async () => {
      const res = await fetch('http://localhost:8000/programs');
      const data = await res.json();
      setProgramList(data);
    }

    getPrograms();
  }, []);

  const registerForProgram = async (id) => {
    const res = await fetch(`http://localhost:8000/programs/${id}/enrollment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json" // Telling the server we’re sending JSON
      },
      body: JSON.stringify({
        id: id,
      })
    });
    res.json();
    
    if (res.ok) {
      setProgramList(prevPrograms =>
        prevPrograms.map(program =>
          program._id === id
            ? { ...program, enrolled: program.enrolled + 1 }
            : program
        )
      );
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Classes</h2>
          {programList.length === 0 ? (
            <p className="text-gray-500">No classes created yet.</p>
          ) : (
            <ul className="space-y-4">
              {programList.map((cls, index) => (
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
                  <p className={`text-sm font-bold ${
                    cls.enrolled >= cls.capacity
                      ? 'text-red-600'
                      : (cls.enrolled / cls.capacity >= 0.75 ? 'text-yellow-600' : 'text-green-600')
                  }`}>
                    Enrolled: {cls.enrolled}/{cls.capacity}
                  </p>
                  <span title={cls.enrolled >= cls.capacity ? 'Class is full' : ''}>
                    <button
                      className={`border rounded px-3 py-2 ${
                        cls.enrolled >= cls.capacity
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none'
                          : 'bg-teal-500 text-white hover:bg-teal-600 pointer-events-auto'
                      }`}
                      onClick={() => registerForProgram(programList[index]._id)}
                      disabled={cls.enrolled >= cls.capacity}
                    >
                      Register
                    </button>
                  </span>
                  </li>
              ))}
            </ul>
          )}
        </div>
    </div>
  )
}

export default Programs