// src/pages/Invest.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  { id: 1, badge: "Trending", name: "Basic", range: "$500 - $1500", duration: "1 Month" },
  { id: 2, badge: "Trending", name: "Basic", range: "$700 - $2100", duration: "1 Month" },
  { id: 3, badge: "Most Popular", name: "Premium", range: "$1500 - $5000", duration: "3 Months" },
  { id: 4, badge: "Most Popular", name: "Premium", range: "$3000 - $10000", duration: "3 Months" },
  { id: 5, badge: "Exclusive", name: "VIP", range: "$10000 - $35000", duration: "6 Months" },
  { id: 6, badge: "Exclusive", name: "VIP", range: "$30000 - $100000", duration: "6 Months" },
];

// Badge color mapping
const badgeColors = {
  Trending: "bg-blue-600",
  "Most Popular": "bg-green-600",
  Exclusive: "bg-red-600",
};

export default function Invest() {
  const navigate = useNavigate();
  const [customAmount, setCustomAmount] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Handle preset plan investment
  const handleInvest = (plan) => {
    if (!acceptTerms) {
      alert("Please accept the Terms & Conditions before proceeding.");
      return;
    }
    navigate(`/checkout/${plan.id}`, { state: plan });
  };

  // Handle custom investment
  const handleCustomInvest = () => {
    if (!acceptTerms) {
      alert("Please accept the Terms & Conditions before proceeding.");
      return;
    }
    if (!customAmount) {
      alert("Enter custom amount.");
      return;
    }
    if (Number(customAmount) < 1) {
      alert("Minimum investment amount is $1.");
      return;
    }

    let durationText = "";

    if (Number(customAmount) >= 1 && Number(customAmount) <= 90) {
      // Auto duration for small testers
      durationText = "2 Weeks";
    } else {
      if (!customDuration) {
        alert("Enter custom duration in months.");
        return;
      }
      durationText = `${customDuration} Months`;
    }

    navigate(`/checkout/custom`, {
      state: {
        name: "Custom",
        amount: Number(customAmount),
        duration: durationText,
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-purple-500 mb-10">
        Investment Plans
      </h1>

      {/* Investment Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative border-2 border-purple-500 rounded-2xl p-6 bg-black transition-transform transform hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]"
          >
            {/* Badge */}
            <div
              className={`absolute -top-3 left-4 ${
                badgeColors[plan.badge] || "bg-purple-600"
              } text-white text-sm font-bold px-3 py-1 rounded-full shadow-md`}
            >
              {plan.badge}
            </div>

            {/* Plan Content */}
            <h2 className="text-2xl font-semibold text-purple-400 mt-4">
              {plan.name}
            </h2>
            <p className="text-lg mt-3">
              <span className="font-bold">Range:</span> {plan.range}
            </p>
            <p className="text-lg mt-1">
              <span className="font-bold">Duration:</span> {plan.duration}
            </p>

            <button
              onClick={() => handleInvest(plan)}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-semibold shadow-md"
            >
              Invest
            </button>
          </div>
        ))}
      </div>

      {/* Custom Investment */}
      <div className="max-w-xl mx-auto mt-12 border-2 border-purple-500 p-6 rounded-2xl bg-black transition-transform transform hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]">
        <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">
          Custom Investment
        </h2>
        <input
          type="number"
          placeholder="Enter Amount ($)"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-black border border-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        {/* Only show duration input if amount > 90 */}
        {(!customAmount || Number(customAmount) > 90) && (
          <input
            type="number"
            placeholder="Enter Duration (Months)"
            value={customDuration}
            onChange={(e) => setCustomDuration(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-lg bg-black border border-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        )}

        <button
          onClick={handleCustomInvest}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-semibold shadow-md"
        >
          Invest Custom Amount
        </button>
      </div>

      {/* Terms and Conditions */}
      <div className="text-center mt-8">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
            className="mr-2"
          />
          <span className="text-sm text-gray-300">
            I agree to the{" "}
            <span className="text-purple-400 underline">Terms & Conditions</span>
          </span>
        </label>
      </div>
    </div>
  );
}
