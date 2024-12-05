import React, { useEffect, useState } from "react";
import userServices from "../services/userServices";
import { useNavigate } from "react-router-dom";

const ViewRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  //const [error, setError] = useState(null);

  const navigate = useNavigate();
  // const handleTransferTickets = ()=>{
  //   // navigate("/dashboard/registrations/transfer-tickets")
  //   navigate(`/dashboard/registrations/${registration.id}/transfer-tickets`)

  // }
  const handleTransferTickets = (eventId) => {
    navigate(`/dashboard/registrations/${eventId}/transfer-tickets`);
  };

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await userServices.get_all_registrations();

        // Check if the response status indicates no registrations found
        if (response.status === 404) {
          setRegistrations([]); // Set registrations to an empty array
        } else {
          setRegistrations(response.data.all_user_registrations);
          console.log(response.data.all_user_registrations);
        }
      } catch (err) {
        //console.log(registrations)
        //console.error(err);
        // Optionally set an error state here if desired
      }
    };

    fetchRegistrations();
  }, []);

  // if (error) {
  //   return (
  //     <div className="text-red-500 text-center p-4">
  //       Failed to fetch registrations.
  //     </div>
  //   );
  // }

  // if (registrations.length === 0) {
  //   console.log("OVER HERE!")
  //   return (
  //     <div className="text-black text-center p-4">No registrations found.</div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center transition-all duration-300 ease-in-out">
      <h1 className="text-3xl font-bold text-white mb-6">
        My Event Registrations
      </h1>

      {registrations.length === 0 ? (
        <div className="text-white text-lg">
          No registrations found for the user. Please register for events to
          view event registrations!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {registrations.map((registration) => (
            <div
              key={registration._id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Event Name: {registration.Event_Name}
                </h2>
                <p className="text-gray-300 mb-2">
                  Event Date:{" "}
                  {new Date(registration.Event_Date).toLocaleDateString()}
                </p>
                <p className="text-gray-300 mb-2">
                  Registration Date:{" "}
                  {new Date(
                    registration.Registration_Date
                  ).toLocaleDateString()}
                </p>
                <p className="text-gray-400">
                  Seats: {registration.Selected_Seat_Nos.join(", ")}
                </p>
                <p className="text-gray-400 mt-2">
                  Total Cost: ₹{registration.Revenue.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-center items-center m-4">
                <button
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-500 hover:to-blue-600 transition duration-300 ease-in-out"
                  onClick={() => handleTransferTickets(registration.Event_Id)}
                >
                  Transfer Tickets!
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewRegistrations;
