// src/components/EventCard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminServices from "../services/adminServices";

const EventCard = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await adminServices.getAllEventsInfo();
        setEvents(response.data.all_event_details); // Ensure this is the correct path to your events array
        console.log(response.data.all_event_details);
      } catch (err) {
        setError(err.message || "An error occurred while fetching events.");
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-white text-center p-4">Loading events...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  const isNewEvent = (eventDate) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);
    
    // Check if the event is today or within the last two days
    return eventDateObj >= twoDaysAgo && eventDateObj <= today;
  };

  const isUpcomingEvent = (eventDate) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const tenDaysFromNow = new Date(today);
    tenDaysFromNow.setDate(today.getDate() + 10);
    
    // Check if the event is after today and before or on the date 10 days from now
    return eventDateObj > today && eventDateObj <= tenDaysFromNow;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 transition-all duration-300 ease-in-out">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length > 0 ? (
          events.map((event) => (
            <Link
              key={event._id || event.Title}
              to={`/dashboard/event/${event._id}`}
              className="relative shadow-[5px_5px_0px_0px_rgba(109,40,217)] block bg-gray-800 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 ease-in-out p-6"
            >
              {/* Badges */}
              <div className="flex m-4">
                {isNewEvent(event.Date) && (
                  <span className="absolute top-2 right-2 inline-flex items-center rounded-md bg-green-500 px-2 py-1 text-md font-bold text-pink-100 ring-1 ring-inset ring-green-600/10">
                    NEW
                  </span>
                )}
                {isUpcomingEvent(event.Date) && (
                  <span className="absolute top-4 right-4 inline-flex items-center rounded-md bg-red-500 px-2 py-1 text-md font-bold text-white ring-1 ring-inset ring-red-600/10">
                    UPCOMING
                  </span>
                )}
              </div>
              
              {/* Event Title */}
              <h2 className="text-2xl font-bold text-white mb-4">
                {event.Title}
              </h2>
              {/* Additional event details (optional)
              <p className="text-gray-300">
                {event.Description}
              </p> */}
            </Link>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center min-h-screen p-20">
            <h1 className="text-4xl text-gray-300 font-bold">
              No events available at the moment!!! <br /> Please contact admin
              to add events!
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
