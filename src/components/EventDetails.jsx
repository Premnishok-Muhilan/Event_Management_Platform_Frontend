// src/components/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import adminServices from "../services/adminServices";

const EventDetails = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await adminServices.getEventInfoById(id);
        setEvent(response.data.event_info); // Adjust based on your API response structure
        console.log(response.data.event_info);
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching event details."
        );
      }
    };

    fetchEventDetails();
  }, [id]);

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!event) {
    return <div className="text-white text-center p-4">Event not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="w-full bg-gray-900 p-4 flex justify-center">
        <div className="w-full bg-gray-800 rounded-lg shadow-lg p-6 transition-opacity duration-500 ease-in-out opacity-100">
          <h1 className="text-3xl font-bold text-white mb-4">{event.Title}</h1>
          <p className="text-gray-200 mb-4">{event.Description}</p>
          <p className="text-gray-200">
            <strong>Date:</strong> {event.Date}
          </p>
          <p className="text-gray-200">
            <strong>Time:</strong> {event.Time}
          </p>
          <p className="text-gray-200">
            <strong>Location:</strong> {event.Location}
          </p>
          <div className="flex justify-center mt-2">
            {event.Maximum_Attendees_Possible - event.Booked_Seat_Nos.length >
            0 ? (
              <p className="text-gray-100">
                <strong>
                  Only{" "}
                  {event.Maximum_Attendees_Possible -
                    event.Booked_Seat_Nos.length}{" "}
                  seats left! Hurry up!!!
                </strong>
              </p>
            ) : (
              <p className="text-red-100">
                <strong>SOLD OUT!!!</strong>
              </p>
            )}
          </div>

          {/* Add more event details as needed */}

          <div className="flex justify-center mt-2">
            {event.Maximum_Attendees_Possible - event.Booked_Seat_Nos.length >
            0 ? (
              <Link to={`/dashboard/event/${id}/book-tickets`}>
                <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition ease-in-out duration-300">
                  Book Tickets
                </button>
              </Link>
            ) : (
              <button
                className="bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg cursor-not-allowed opacity-50"
                disabled
              >
                No Seats Available
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
