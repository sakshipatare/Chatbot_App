import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* NAVBAR */}
      <nav className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-center gap-10 relative">
        <h1 className="text-xl font-semibold absolute left-6 text-blue-600">
          Chatbot App
        </h1>

        <div className="flex gap-10">
          <NavLink to="details" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-700"}>
            Details
          </NavLink>
          <NavLink to="documents" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-700"}>
            Documents
          </NavLink>
          <NavLink to="history" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-700"}>
            Dashboard
          </NavLink>
          <NavLink to="script" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-700"}>
            Script
          </NavLink>
        </div>

        <button
          onClick={handleLogout}
          className="absolute right-6 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      <div className="p-8">
        {/* This will render the nested routes */}
        <Outlet />
      </div>
    </div>
  );
}
