import React, { useState } from "react";
import loginLottie from "../../assets/loginLottie.json";
import Lottie from "lottie-react";
import { Link, useNavigate } from "react-router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";

function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();

    // validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1. Firebase user create
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(result)

      // 2. Update profile
      await updateProfile(result.user, {
        displayName: name,
      });

      // 3. Save user to MongoDB
      await fetch("https://team-collaboration-tool-server.vercel.app/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          uid: result.user.uid,
          
        }),
      });
      const data = await res.json(); 
      console.log("Mongo response:", data)
      if (!res.ok || data.success === false) {
  throw new Error(data.message || "Failed to save user");
}

      form.reset();

      // redirect
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters");
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* Lottie */}
        <div className="w-80 lg:w-96">
          <Lottie animationData={loginLottie} loop={true} />
        </div>

        {/* Form */}
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleRegister} className="card-body">
            <fieldset className="fieldset">

              <label className="fieldset-label">Name</label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="Enter your name"
                required
                onChange={() => setError("")}
              />

              <label className="fieldset-label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="Email"
                required
                onChange={() => setError("")}
              />

              <label className="fieldset-label">Password</label>
              <input
                type="password"
                name="password"
                className="input"
                placeholder="Password"
                required
                onChange={() => setError("")}
              />

              <label className="fieldset-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="input"
                placeholder="Re-write Password"
                required
                onChange={() => setError("")}
              />

              {/* error */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                className="btn btn-neutral mt-4 w-full"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </fieldset>

            <p className="mt-3 text-sm">
              If you already have an account, please{" "}
              <Link to="/login" className="text-blue-500 font-bold">
                login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;