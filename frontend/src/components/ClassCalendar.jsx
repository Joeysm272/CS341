import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const ClassCalendar = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Class Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[]} // Empty for now; you can later add events
      />
    </div>
  );
};

export default ClassCalendar;

//Execute this cmd in frontend directory
//npm install @fullcalendar/react @fullcalendar/daygrid

