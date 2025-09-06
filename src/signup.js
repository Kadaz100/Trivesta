import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      // 🔄 make sure displayName is available right away
      await auth.currentUser.reload();

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", background:"#1a1a2e", color:"#fff" }}>
      <h2 style={{ marginBottom:"20px" }}>Create an Account</h2>
      <form onSubmit={handleSignup} style={{ display:"flex", flexDirection:"column", gap:"12px", width:"300px" }}>
        <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required 
          style={{ padding:"10px", borderRadius:"8px", border:"1px solid #6a0dad" }} />
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required 
          style={{ padding:"10px", borderRadius:"8px", border:"1px solid #6a0dad" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required 
          style={{ padding:"10px", borderRadius:"8px", border:"1px solid #6a0dad" }} />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required 
          style={{ padding:"10px", borderRadius:"8px", border:"1px solid #6a0dad" }} />
        {error && <p style={{ color:"red", fontSize:"14px" }}>{error}</p>}
        <button type="submit" style={{ padding:"12px", borderRadius:"8px", background:"#6a0dad", color:"#fff", fontWeight:"bold", border:"none", cursor:"pointer" }}>Sign Up</button>
      </form>
    </div>
  );
}
