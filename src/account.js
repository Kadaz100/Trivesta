// src/pages/Account.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Account() {
  const location = useLocation();
  const plan = location.state?.plan;

  const [balance, setBalance] = useState(0);
  const [daysLeft, setDaysLeft] = useState(14); // ✅ default 2 weeks
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (!plan) return;

    let startingAmount;

    if (plan.amount) {
      // ✅ Custom investment (from Checkout.js)
      startingAmount = parseFloat(plan.amount);
    } else {
      // ✅ If plan has range → pick random within range
      const [min, max] = plan.range.replace("$", "").split(" – ").map(Number);
      startingAmount = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setBalance(startingAmount);

    // ✅ Simulate daily profit growth
    let day = 0;
    const growthInterval = setInterval(() => {
      day++;
      const dailyProfit = startingAmount * 0.02; // 2% per day (example)
      setProfit((prev) => prev + dailyProfit);
      setBalance((prev) => prev + dailyProfit);
      setDaysLeft((prev) => (prev > 0 ? prev - 1 : 0));

      if (day >= 14) clearInterval(growthInterval); // stop after 2 weeks
    }, 3000); // every 3s = 1 day for demo

    return () => clearInterval(growthInterval);
  }, [plan]);

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-black text-purple-400">
        <p className="text-lg font-semibold">⚠️ No active investment. Please invest first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold mb-8 text-purple-500 tracking-wide">
          📊 My Account
        </h2>

        {/* Investment Details */}
        <div className="bg-gradient-to-br from-black via-[#0f0f1a] to-black border border-purple-600 rounded-2xl p-8 mb-10 text-center shadow-lg shadow-purple-900/40">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Investment Details</h3>
          <p className="text-lg">
            <span className="font-semibold">Plan:</span> {plan.name}
          </p>
          {plan.amount ? (
            <p className="text-lg">
              <span className="font-semibold">Invested:</span> ${plan.amount}
            </p>
          ) : (
            <p className="text-lg">
              <span className="font-semibold">Range:</span> {plan.range}
            </p>
          )}
          <p className="text-lg">
            <span className="font-semibold">Duration:</span> {plan.duration}
          </p>
        </div>

        {/* Balance */}
        <div className="bg-gradient-to-br from-[#0f0f1a] via-black to-[#0f0f1a] border border-purple-600 rounded-2xl p-8 mb-10 text-center shadow-lg shadow-purple-900/40">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Account Balance</h3>
          <p className="text-3xl font-extrabold text-green-400 mb-2">
            ${balance.toFixed(2)}
          </p>
          <p className="text-purple-300">Profit Earned: ${profit.toFixed(2)}</p>
          <p className="text-sm text-gray-400 mt-2">⏳ {daysLeft} days left</p>
        </div>
      </div>
    </div>
  );
}
