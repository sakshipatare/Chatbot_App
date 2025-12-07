import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="max-w-4xl mx-auto text-center mt-20 px-5">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          AI Chatbot for Your Website
        </h2>

        <p className="text-lg text-gray-600 leading-relaxed">
          Our platform allows you to upload documents, ask questions, and 
          integrate your own chatbot into any website by simply copying a script.
          Your chatbot can answer questions based on your document data, store chat 
          history, and provide analytics—everything in one place.
        </p>

        <p className="text-lg text-gray-600 mt-4">
          Build your own document-based chatbot in minutes.
        </p>

        <Link to="/login">
            <button className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Get Started
            </button>
        </Link>
      </section>
    </div>
  );
}
