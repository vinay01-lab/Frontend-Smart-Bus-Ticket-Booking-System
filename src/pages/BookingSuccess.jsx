import { Link, useLocation } from "react-router-dom";

export default function BookingSuccess() {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking)
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">No booking found</h1>
        <Link to="/" className="text-blue-600 underline">Go Home</Link>
      </div>
    );

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow-lg p-6 rounded-xl w-[400px] text-center">
        <h1 className="text-2xl font-bold text-green-600">Booking Confirmed ✅</h1>

        <p className="text-gray-600 mt-2">
          Your seat has been successfully booked.
        </p>

        <div className="mt-4 text-left space-y-2">
          <div><b>Trip:</b> {booking.route}</div>
          <div><b>Date:</b> {booking.date}</div>
          <div><b>Time:</b> {booking.time}</div>
          <div><b>Seat No:</b> {booking.seat_no}</div>
          <div><b>Fare Paid:</b> ₹{booking.fare}</div>
        </div>

        <Link 
          to="/my-trips"
          className="block bg-blue-600 text-white mt-6 py-2 rounded-lg"
        >
          View My Trips
        </Link>
      </div>
    </div>
  );
}
