// src/pages/About.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function About() {
  return (
    <div className="min-vh-100 bg-black text-white d-flex flex-column">
      <Container className="py-5 flex-grow-1">
        {/* Title */}
        <h1 className="text-center fw-bold mb-5" style={{ color: "#a855f7" }}>
          About Us
        </h1>

        {/* Intro */}
        <p className="lead text-center mb-5 mx-auto" style={{ maxWidth: "800px", color: "#d1d1d1" }}>
          At <span style={{ color: "#c084fc", fontWeight: "bold" }}>Trivesta</span>, we believe
          crypto investing should be simple, secure, and built on trust. Our
          platform was created with one purpose: to help people grow their wealth
          confidently through strategies once reserved for institutions and
          insiders.
        </p>

        <Row className="g-4">
          {/* Stats Highlight */}
          <Col md={4}>
            <Card className="bg-black border border-purple-600 shadow h-100 text-center p-4 rounded-3">
              <h2 style={{ color: "#c084fc" }}>10,000+</h2>
              <p className="text-light">Investors Worldwide</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-black border border-purple-600 shadow h-100 text-center p-4 rounded-3">
              <h2 style={{ color: "#c084fc" }}>$200M+</h2>
              <p className="text-light">Secured Investments</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-black border border-purple-600 shadow h-100 text-center p-4 rounded-3">
              <h2 style={{ color: "#c084fc" }}>98%</h2>
              <p className="text-light">Trust Score</p>
            </Card>
          </Col>
        </Row>

        {/* Sections */}
        <section className="mt-5">
          <h2 className="fw-bold mb-3" style={{ color: "#a855f7" }}>What We Do</h2>
          <p className="text-light">
            Trivesta offers a clear and direct way to invest in crypto yield. You
            choose a plan that matches your goals, and over time, your investment
            has the potential to grow—up to <span style={{ color: "#c084fc" }}>3x returns</span> 
            with carefully structured strategies.
          </p>
        </section>

        <section className="mt-5">
          <h2 className="fw-bold mb-3" style={{ color: "#a855f7" }}>How It Works</h2>
          <p className="text-light">
            Your funds never sit idle. Instead, they are deployed through
            foundations, smart money concepts, and market-driven strategies that
            generate sustainable yield while moving real economies.
          </p>
          <p className="text-light mt-2">
            Every decision is backed by cutting-edge technology, market expertise,
            and long-term vision. With Trivesta, your capital doesn’t just grow—it
            powers strategies that help shape the financial future.
          </p>
        </section>

        <section className="mt-5">
          <h2 className="fw-bold mb-3" style={{ color: "#a855f7" }}>Security & Support You Can Trust</h2>
          <p className="text-light">
            Trust is at the core of everything we do. That’s why Trivesta is built
            with institutional-grade security protocols, 24/7 monitoring, and
            round-the-clock support.
          </p>
        </section>

        <section className="mt-5">
          <h2 className="fw-bold mb-3" style={{ color: "#a855f7" }}>Our Vision</h2>
          <p className="text-light">
            We’re not just building another investment app—we’re building a bridge
            to the future of finance. Our vision is to democratize access to
            advanced crypto strategies, making them secure, transparent, and
            accessible to everyone.
          </p>
          <p className="text-light mt-2">
            At Trivesta, we prove that crypto investing doesn’t have to be
            complicated. It has to be smart, secure, and built on trust.
          </p>
        </section>

        {/* Telegram Link */}
        <div className="text-center mt-5">
          <a
            href="https://t.me/+RoYlNxIPET1jYjBk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg"
            style={{
              backgroundColor: "#a855f7",
              color: "white",
              borderRadius: "8px",
              padding: "12px 30px",
              fontWeight: "bold",
              boxShadow: "0 0 20px rgba(168,85,247,0.6)",
            }}
          >
            Join Us on Telegram
          </a>
        </div>
      </Container>

      {/* Footer */}
      <footer className="text-center py-4 mt-auto border-top border-purple-600">
        <p className="mb-0 text-light">
          © {new Date().getFullYear()} <span style={{ color: "#c084fc" }}>Trivesta</span>.  
          All rights reserved.
        </p>
      </footer>
    </div>
  );
}
