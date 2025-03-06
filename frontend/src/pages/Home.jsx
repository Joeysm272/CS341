import React from 'react'
import Navbar from '../components/navbar'

const Home = () => {

//   const createProgram = async () => {
//     fetch('http://localhost:8000/programs', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json" // Telling the server we’re sending JSON
//       },
//       body: JSON.stringify({
//         programName: 'Sharks',
//         time: '8:00am',
//         location: 'Mars',
//         capacity: 10,
//         price: 15,
//         desc: 'Swimming lessons'
//       })
//     })
//   }

// const deleteProgram = async () => {
//   fetch('http://localhost:8000/programs/67c7976a50fce705a4ca4286', {
//     method: "DELETE"
//   })
// }
        // <button className='bg-black text-white cursor-pointer' onClick={createProgram}>Create Program</button>
        // <button className='bg-black text-white cursor-pointer' onClick={deleteProgram}>Delete Program</button>
  return (
    <div>
      <Navbar />
      HTML goes here 
      CSS file is /src/index.css

    </div>
  )
}

export default Home