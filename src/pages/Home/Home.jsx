import React from "react";
import { Link } from "react-router";
import Lottie from "lottie-react";
import heroAnimation from "../../assets/hero.json";

function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black">

      {/* 🌈 Background Blur Circles */}
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">

        <div className="w-full max-w-5xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 flex flex-col lg:flex-row items-center gap-10">

          {/* LEFT CONTENT */}
          <div className="flex-1 text-white">
            <h1 className="text-5xl font-extrabold leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-pink-400 to-yellow-300 text-transparent bg-clip-text">
                Mehedi Educare
              </span>
            </h1>

            <p className="mt-4 text-gray-200 text-lg">
              A modern real-time chat & collaboration platform built with Firebase,
              React, and MongoDB. Fast, secure, and beautiful.
            </p>

            <div className="mt-6 flex gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md transition"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-transparent border border-white/40 hover:bg-white/10 transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* RIGHT ANIMATION */}
          <div className="flex-1">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
              <Lottie animationData={heroAnimation} loop={true} />
            </div>
          </div>

        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="relative z-10 grid md:grid-cols-3 gap-6 px-6 pb-16 max-w-6xl mx-auto">

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-xl text-white hover:scale-105 transition">
          ⚡ <h3 className="font-bold mt-2">Fast Messaging</h3>
          <p className="text-sm text-gray-300 mt-1">Real-time chat experience</p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-xl text-white hover:scale-105 transition">
          🔒 <h3 className="font-bold mt-2">Secure Login</h3>
          <p className="text-sm text-gray-300 mt-1">Firebase authentication</p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-xl text-white hover:scale-105 transition">
          💬 <h3 className="font-bold mt-2">Clean UI</h3>
          <p className="text-sm text-gray-300 mt-1">Simple and modern design</p>
        </div>

      </div>

    </div>
  );
}

export default Home;