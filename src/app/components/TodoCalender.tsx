"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { type EventInput } from '@fullcalendar/core';


interface TodoCalendarProps {
  events: EventInput[];
}

export const TodoCalendar = ({ events }: TodoCalendarProps) => {
  return (
<div className="mt-4 rounded-lg bg-card text-card-foreground shadow-sm p-4 text-sm sm:text-base">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        height="auto" 
      />
    </div>
  );
};