import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import userServices from "../services/userServices";

const Calendar = () => {
  const [registrations, setRegistrations] = useState([]);
  const [eventDates, setEventDates] = useState(new Set());
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedEvents, setSelectedEvents] = useState([]); // Change state to store all selected events

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await userServices.get_all_registrations();
        if (response.status === 404) {
          setRegistrations([]);
        } else {
          const registrations = response.data.all_user_registrations.map((registration) => ({
            date: dayjs(registration.Event_Date).format("YYYY-MM-DD"),
            details: registration // Assuming registration contains event details
          }));
          setRegistrations(registrations);
          const uniqueDates = new Set(registrations.map(item => item.date));
          setEventDates(uniqueDates);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegistrations();
  }, []);

  const generateDays = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const days = [];

    for (let day = startOfMonth; day.isBefore(endOfMonth.add(1, "day")); day = day.add(1, "day")) {
      days.push(day);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const days = generateDays();
  const monthName = currentMonth.format("MMMM YYYY");

  const handleDateClick = (formattedDate) => {
    // Filter to get all events for the selected date
    const eventsForDate = registrations.filter(reg => reg.date === formattedDate);
    setSelectedEvents(eventsForDate); // Set the selected events
  };

  return (
    <div className="rounded-3xl max-w-md mx-auto p-5 relative bg-teal-500 m-5">
      <div className="flex justify-between items-center mb-4 bg-blue-500">
        <button onClick={handlePrevMonth} className="text-xl">❮</button>
        <h2 className="text-2xl font-bold">{monthName}</h2>
        <button onClick={handleNextMonth} className="text-xl">❯</button>
      </div>
      <div className="grid grid-cols-7 text-center border-b-2 border-gray-300 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold text-gray-600">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: days[0].day() }).map((_, index) => (
          <div key={index} className="text-transparent"></div>
        ))}
        {days.map((day) => {
          const formattedDate = day.format("YYYY-MM-DD");
          const isEventDate = eventDates.has(formattedDate);

          return (
            <div key={day.format()}>
              <div
                className={`border border-gray-300 p-4 rounded-full flex items-center justify-center cursor-pointer ${
                  isEventDate 
                    ? "bg-red-500 text-black" 
                    : "text-gray-800"
                }`}
                onClick={() => isEventDate && handleDateClick(formattedDate)}
              >
                {day.date()}
              </div>
            </div>
          );
        })}
      </div>
      {/* Separate div for the event titles below the calendar */}
      <div className="mt-4 text-center text-lg font-bold">
        {selectedEvents.length > 0 
          ? selectedEvents.map(event => (
              <div key={event.details.Event_ID}>{event.details.Event_Name}</div> // Assuming Event_ID is a unique identifier
            ))
          : "Select a date to see the event titles."
        }
      </div>
    </div>
  );
};

export default Calendar;
