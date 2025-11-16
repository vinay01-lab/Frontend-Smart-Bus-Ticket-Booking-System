import { useParams } from "react-router-dom";
import SeatMap from "../components/SeatMap";

export default function Booking() {
  const { tripId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Booking for Trip {tripId}</h1>
      <SeatMap tripId={tripId} />
    </div>
  );
}