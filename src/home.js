import React from "react";

function Home({ onGetStarted }) {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        {/* Clean Welcome Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-purple-500 mb-4 animate-fade-in">
          Welcome to Trivesta
        </h1>

        <h2 className="text-2xl md:text-4xl font-bold text-white animate-slide-up">
          Grow Your <span className="text-purple-500">Crypto</span>, Secure Your Future
        </h2>

        <p className="mt-4 mb-8 text-gray-300 max-w-xl animate-fade-in-delay">
          Join 10,000+ investors earning passive income with trust & transparency.
        </p>

        <button
          onClick={onGetStarted}
          className="bg-purple-700 hover:bg-purple-800 shadow-lg shadow-purple-900/50 px-8 py-4 rounded-2xl font-bold text-lg transition-transform transform hover:scale-105 animate-bounce-slow"
        >
          Get Started
        </button>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-8 py-12">
        {[
          { value: "+10,000", label: "Active Investors" },
          { value: "$200M+", label: "Funds Managed" },
          { value: "98%", label: "Trust Score" },
          { value: "100%", label: "Security & Support" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-black border-2 border-purple-600 rounded-2xl shadow-md shadow-purple-900/40 p-6 text-center transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-bold text-purple-400">{stat.value}</h2>
            <p className="text-gray-300 mt-2">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Animations */}
      <style>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1.2s ease forwards;
        }
        .animate-fade-in-delay {
          opacity: 0;
          animation: fadeIn 1.8s ease forwards;
          animation-delay: 0.4s;
        }
        .animate-slide-up {
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 1.3s ease forwards;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

export default Home;
