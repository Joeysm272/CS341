import React, {useState, useEffect} from 'react'
import Navbar from '../components/navbar';

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
                  <p className="text-sm text-gray-600">Time: {new Date(cls.time).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Location: {cls.location}</p>
                  <p className="text-sm text-gray-600">Capacity: {cls.capacity}</p>
                  <p className="text-sm text-gray-600">Price: ${cls.price}</p>
                  <p className="text-sm text-gray-700 mt-2">{cls.desc}</p>

                  {/* Enrollment Counter */}
                  <p className="text-sm font-bold text-green-600">
                    Enrolled: {cls.enrolled} / {cls.capacity}
                  </p>
                  <button className='border rounded bg-teal-500 text-white px-3 py-2 hover:bg-teal-600' onClick={() => registerForProgram(programList[index]._id)}>Register</button>
                </li>
              ))}
            </ul>
          )}
        </div>
    </div>
  )
}

export default Programs