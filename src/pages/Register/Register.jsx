import React, { useState } from "react";
import loginLottie from "../../assets/loginLottie.json";
import { toast } from "react-toastify";
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
  const SERVER = "https://team-collaboration-tool-server.vercel.app";

const handleRegister = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  const form = e.target;

  const name = form.name.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value.trim();
  const confirmPassword = form.confirmPassword.value.trim();

  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    setLoading(false);
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    setLoading(false);
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(result.user, {
      displayName: name,
    });

    const res = await fetch(`${SERVER}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: result.user.uid,
        name,
        email,
        role: "user",
        createdAt: new Date().toISOString(),
      }),
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || "Failed to save user");
    }

    toast.success("Registration successful");

    form.reset();

    navigate("/login");
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      setError("Email already exists");
    } else if (err.code === "auth/weak-password") {
      setError("Password must be at least 6 characters");
    } else {
      setError(err.message || "Registration failed");
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