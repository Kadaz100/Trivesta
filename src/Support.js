// src/pages/Support.js
import React, { useState } from "react";
import emailjs from "emailjs-com";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs
      .send(
        "service_fxoivnj",      // ✅ your service ID
        "template_kvqsyvk",     // ✅ your template ID
        formData,
        "hlA542xi131R3yR_E"     // ✅ your public key
      )
      .then(
        () => {
          setStatus("✅ Complaint sent! We’ll get back to you within 24hrs.");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setStatus("❌ Failed to send. Try again later.");
        }
      );
  };

  return (
    <div className="bg-black text-white min-vh-100 py-5">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-purple-500">
          Support
        </h1>
        <p className="text-center text-purple-300 mb-8">
          Send us your complaints or questions. Our team will reply within{" "}
          <span className="text-purple-400">24 hours</span>.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-black border-2 border-purple-600 rounded-2xl p-6 shadow-md shadow-purple-900/40"
        >
          <div className="mb-4">
            <label className="block mb-2 text-purple-300">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-black border-2 border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-purple-300">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-black border-2 border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-purple-300">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-3 rounded-lg bg-black border-2 border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-lg bg-purple-700 hover:bg-purple-800 shadow-md shadow-purple-900/50 transition-all"
          >
            Submit Complaint
          </button>
        </form>

        {status && (
          <p className="mt-6 text-center text-purple-300 font-semibold">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
