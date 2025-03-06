import React, { useState } from 'react';
import Navbar from '../components/navbar'

const StaffHome = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    instructor: '',
    time: '',
    location: '',
    maxParticipants: '',
    description: '',
    enrolled: 0, // Track enrollments
  });

  const [editIndex, setEditIndex] = useState(null);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editIndex !== null) {
      // Edit existing class
      const updatedClasses = [...classes];
      updatedClasses[editIndex] = formData;
      setClasses(updatedClasses);
      setEditIndex(null);
    } else {
      // Add new class
      setClasses([...classes, formData]);
    }

    // Reset form
    setFormData({
      name: '',
      type: '',
      instructor: '',
      time: '',
      location: '',
      maxParticipants: '',
      description: '',
      enrolled: 0,
    });
  };

  // Handle deleting a class
  const handleDelete = (index) => {
    const updatedClasses = classes.filter((_, i) => i !== index);
    setClasses(updatedClasses);
  };

  // Handle editing a class
  const handleEdit = (index) => {
    setFormData(classes[index]);
    setEditIndex(index);
  };

  // Handle class enrollment (mock)
  const handleEnroll = (index) => {
    const updatedClasses = [...classes];
    if (updatedClasses[index].enrolled < updatedClasses[index].maxParticipants) {
      updatedClasses[index].enrolled += 1;
      setClasses(updatedClasses);
    }
  };

  return (
    <div>
      <Navbar />
      HTML goes here 
      CSS file is /src/index.css
        
    </div>
  );
};

export default StaffHome;
