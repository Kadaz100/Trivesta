// src/App.js
import React, { useContext } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

// pages / components
import Signup from "./signup";
import Login from "./login";
import Account from "./account";
import Home from "./home";
import Invest from "./invest";
import Checkout from "./checkout";
import About from "./About";
import Support from "./Support";   // ✅ import Support page

function App() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate("/account");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="bg-black text-white min-vh-100">
      {/* Navbar */}
      <Navbar
        expand="lg"
        className="py-3 bg-black border-b-2 border-purple-600 shadow-md shadow-purple-900/40"
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-3 text-purple-500"
          >
            Trivesta
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="bg-purple-600"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto gap-2">
              <Nav.Link
                as={Link}
                to="/"
                className="text-white fw-semibold transition-all hover:text-purple-400 hover:underline hover:underline-offset-4 hover:decoration-purple-500"
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/invest"
                className="text-white fw-semibold transition-all hover:text-purple-400 hover:underline hover:underline-offset-4 hover:decoration-purple-500"
              >
                Invest
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className="text-white fw-semibold transition-all hover:text-purple-400 hover:underline hover:underline-offset-4 hover:decoration-purple-500"
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/support"
                className="text-white fw-semibold transition-all hover:text-purple-400 hover:underline hover:underline-offset-4 hover:decoration-purple-500"
              >
                Support
              </Nav.Link>

              {currentUser ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/account"
                    className="text-purple-400 fw-bold border border-purple-600 px-3 py-1 rounded-2xl shadow-md shadow-purple-900/40 hover:bg-purple-700 hover:text-white transition-all"
                  >
                    Account (
                    {currentUser?.displayName || currentUser?.email})
                  </Nav.Link>
                  <Button
                    size="sm"
                    className="ms-2 bg-purple-600 border-0 hover:bg-purple-700 text-white rounded-2xl px-3 py-1 shadow-md shadow-purple-900/40"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="text-white fw-semibold transition-all hover:text-purple-400 hover:underline hover:underline-offset-4 hover:decoration-purple-500"
                >
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home onGetStarted={handleGetStarted} />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/checkout/:planId" element={<Checkout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} /> {/* ✅ Support form now active */}
      </Routes>

      {/* Footer */}
      <footer className="text-center py-4 mt-5 bg-black border-t-2 border-purple-600 text-gray-300">
        <Container>
          <p className="mb-1">
            © {new Date().getFullYear()}{" "}
            <span className="text-purple-400">Trivesta</span>. All Rights
            Reserved.
          </p>
          <small className="text-purple-300">
          </small>
          <div className="mt-2">
            {/* Example footer link */}
            <a
              href="h"
              className="text-purple-400 hover:text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Trivesta
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default App;
