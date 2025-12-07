import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { CheckCircle } from "lucide-react";
import './Auth.css'

const SignupForm = () => {
    console.log("SignupForm component loaded");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const apiUrl = "http://localhost:4000";

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log("Handle submit:");
        try {
            const response = await fetch(`${apiUrl}/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    name: `${firstName} ${lastName}`, 
                    email, 
                    password, 
                    confirmPassword 
                }),
            });

            const result = await response.json();
            console.log("Signup response:", result);

            if (response.ok) {
                alert("Signup successful! Please log in.");
                navigate("/login");
            } else {
                alert(result.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
            <button
            onClick={() => navigate("/")}
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
            ✕
            </button>
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="login-form__icon flex items-center justify-center mb-6">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-blue-600"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3h9m-9 3h5.25M21 12c0 4.97-4.03 9-9 9-1.19 0-2.33-.23-3.38-.65L3 21l1.65-5.62A8.964 8.964 0 0 1 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9Z"
            />
        </svg>
        </div>

        <h2 className="login-form__title text-center font-bold mb-2">
        Stay Organized with Your Chatbot App
        </h2>

        <p className="login-form__subtitle text-center text-gray-600 mb-6">
        Your intelligent assistant for answering questions and processing documents instantly
        </p>


      <form className="login-form" onSubmit={handleSubmit}>

        <label>First Name</label>
        <input type="text" name="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

        <label>Last Name</label>
        <input type="text" name="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <label>Email Address</label>
        <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Confirm Password</label>
        <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <button type="submit" className=" w-full relative overflow-hidden text-white font-bold bg-[#007bff] rounded-[5px] cursor-pointer py-2 px-4 
                  transition-colors duration-300 z-10
                  before:absolute before:top-0 before:left-1/2 before:w-0 before:h-full before:bg-[#0056b3] 
                  before:transition-all before:duration-300 before:ease-out 
                  hover:before:w-full hover:before:left-0
                  before:z-0 mb-6 mt-3"><span className="relative z-10">Sign Up</span></button>
      </form>

      <div className="login-form__footer text-center">
        <p className="login-form__footer-text">
          Already have an account?{' '}
          <Link to="/login" className="text-[#007bff] font-medium hover:text-[#0056b3] transition-colors duration-300">Sign in</Link>
        </p>
      </div>
      </div>
    </div>
    );
};

export default SignupForm;