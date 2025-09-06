// src/pages/Home.js
import React from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";

function Home({ onGetStarted }) {
  return (
    <div className="bg-black text-white min-vh-100">
      {/* Hero Section */}
      <section className="hero d-flex align-items-center text-center py-5 bg-black">
        <Container>
          {/* Clean Welcome Heading */}
          <h1 className="display-2 fw-bold text-purple-500 mb-4 animate-fade-in">
            Welcome to Trivesta
          </h1>

          <h2 className="display-5 fw-bold text-white animate-slide-up">
            Grow Your <span className="text-purple-500">Crypto</span>, Secure Your Future
          </h2>

          <p className="lead mt-3 mb-5 text-gray-300 animate-fade-in-delay">
            Join 10,000+ investors earning passive income with trust & transparency.
          </p>

          <Button
            size="lg"
            className="bg-purple-700 hover:bg-purple-800 border-0 shadow-md shadow-purple-900/50 px-5 py-3 rounded-2xl fw-bold text-white transition-all animate-bounce-slow"
            onClick={onGetStarted}
          >
            Get Started
          </Button>
        </Container>
      </section>

      {/* Stats Section */}
      <Container className="my-5">
        <Row className="g-4">
          {[
            { value: "+10,000", label: "Active Investors" },
            { value: "$200M+", label: "Funds Managed" },
            { value: "98%", label: "Trust Score" },
            { value: "100%", label: "Security & Support" },
          ].map((stat, index) => (
            <Col md={3} key={index}>
              <Card className="stat-card text-center p-4 bg-black border-2 border-purple-600 rounded-2xl shadow-md shadow-purple-900/40 transition-transform transform hover:scale-105">
                <h2 className="text-purple-400 fw-bold">{stat.value}</h2>
                <p className="text-gray-300">{stat.label}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

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
