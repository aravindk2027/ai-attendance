import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup(){

 const navigate = useNavigate();

 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const [confirmPassword,setConfirmPassword] = useState("");

 const handleSignup = () => {

  if(password !== confirmPassword){
   alert("Passwords do not match");
   return;
  }

  alert("Signup successful");

  navigate("/");

 };

 return(

  <div className="signup-page">

   <div className="signup-card">

    <h2>Create Account</h2>

    <p className="subtitle">
     Join AI Attendance System
    </p>

    <input
     type="text"
     placeholder="Full Name"
     onChange={(e)=>setName(e.target.value)}
    />

    <input
     type="email"
     placeholder="Email"
     onChange={(e)=>setEmail(e.target.value)}
    />

    <input
     type="password"
     placeholder="Password"
     onChange={(e)=>setPassword(e.target.value)}
    />

    <input
     type="password"
     placeholder="Confirm Password"
     onChange={(e)=>setConfirmPassword(e.target.value)}
    />

    <button onClick={handleSignup}>
     Sign Up
    </button>

    <p className="login-text">
     Already have an account?
     <span onClick={()=>navigate("/")}>
     Login
     </span>
    </p>

   </div>

  </div>

 );

}

export default Signup;