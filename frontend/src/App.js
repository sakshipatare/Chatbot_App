import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import SignupForm from './components/Auth/Signup';
import DashboardLayout from './components/Dashboard/Dashboard';
import DetailsPage from './components/Dashboard/Details/Details';
import Documents from './components/Dashboard/Document/Document';
import History from './components/Dashboard/History/History';
import Script from './components/Dashboard/Script/Script';
import Ticket from './components/Dashboard/Ticket/Ticket';

import './App.css';

function App() {
  return (
    <GoogleOAuthProvider clientId="96058883383-37l1psr3jj24606a7doisqhd6ac0th2h.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />

          {/* Dashboard with nested routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<History />} /> 
            <Route path="details" element={<DetailsPage />} />
            <Route path="documents" element={<Documents />} />
            <Route path="history" element={<History />} />
            <Route path="tickets" element={<Ticket />} />
            <Route path="script" element={<Script />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
