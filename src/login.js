import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:"#1a1a2e", color:"#fff" }}>
      <h2 style={{ marginBottom:"20px" }}>Login to Your Account</h2>
      <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:"12px", width:"300px" }}>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required 
          style={{ padding:"10px", borderRadius:"8px", border:"1px solid #6a0dad" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required 
          style={{ padding:"10px", borderRadius:"8px", border:"1px solid #6a0dad" }} />
        {error && <p style={{ color:"red", fontSize:"14px" }}>{error}</p>}
        <button type="submit" style={{ padding:"12px", borderRadius:"8px", background:"#6a0dad", color:"#fff", fontWeight:"bold", border:"none", cursor:"pointer" }}>Login</button>
      </form>
    </div>
  );
}
