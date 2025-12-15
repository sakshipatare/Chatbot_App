import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { Bot } from "lucide-react";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-white/95 backdrop-blur-sm shadow-sm fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ChatBot AI
              </span>
            </Link>

            {/* NAV LINKS */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/dashboard/details"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                  }`
                }
              >
                Details
              </NavLink>

              <NavLink
                to="/dashboard/documents"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                  }`
                }
              >
                Documents
              </NavLink>

              <NavLink
                to="/dashboard/history"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/dashboard/tickets"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                  }`
                }
              >
                Ticket
              </NavLink>

              <NavLink
                to="/dashboard/script"
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                  }`
                }
              >
                Script
              </NavLink>
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT AREA */}
      <div className="pt-16 p-0 m-0 w-full">
        <Outlet />
      </div>
    </>
  );
}
