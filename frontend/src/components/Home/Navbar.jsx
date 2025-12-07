import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">
        Chatbot App
      </h1>

      <div className="space-x-4">
        <Link to="/login">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
