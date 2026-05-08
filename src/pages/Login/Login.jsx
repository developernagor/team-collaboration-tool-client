import React, { useState } from 'react'
import loginLottie from "../../assets/loginLottie.json"
import Lottie from 'lottie-react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config';
import { useNavigate } from 'react-router';


function Login() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    setLoading(true);
    try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log(result.user);
    form.reset();
    navigate("/");
  } catch (error) {
  if (error.code === "auth/user-not-found") {
    setError("User not found");
  } else if (error.code === "auth/wrong-password") {
    setError("Incorrect password");
  } else {
    setError("Login failed. Try again.");
  }
}finally {
  setLoading(false);
}
  }
  return (
    <>
    
    <div className="hero bg-base-200 min-h-screen">
    
  <div className="hero-content flex-col lg:flex-row-reverse">

    {/* Lottie Animation */}
    <div className="w-80 lg:w-96">
          <Lottie animationData={loginLottie} loop={true} />
        </div>

    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <form onSubmit={handleLogin} className="card-body">
        <fieldset className="fieldset">
          <label className="fieldset-label">Email</label>
          <input type="email" name="email" className="input" placeholder="Email" required />
          <label className="fieldset-label">Password</label>
          <input type="password" name="password" className="input" placeholder="Password" required />
          <div><a className="link link-hover">Forgot password?</a></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="btn btn-neutral mt-4" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </fieldset>
      </form>
    </div>
  </div>
</div>
    </>
  )
}

export default Login
