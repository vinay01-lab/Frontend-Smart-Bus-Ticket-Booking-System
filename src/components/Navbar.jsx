export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-3 flex justify-between">
      <h1 className="font-bold text-xl">Smart Bus Booking</h1>
      <div className="space-x-4">
        <a href="/">Home</a>
        <a href="/admin">Admin</a>
      </div>
    </nav>
  );
}
