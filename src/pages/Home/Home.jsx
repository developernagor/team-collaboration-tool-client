
      import React from "react";
import { Link } from "react-router";
import Lottie from "lottie-react";
import heroAnimation from "../../assets/hero.json";

export default function Home() {
  return (

    <>
      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black min-h-screen flex items-center">

        <div className="absolute w-80 h-80 bg-pink-500 blur-3xl rounded-full opacity-20 top-10 left-10"></div>

        <div className="absolute w-80 h-80 bg-blue-500 blur-3xl rounded-full opacity-20 bottom-0 right-0"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center px-6 py-20">

          <div className="text-white">

            <span className="badge badge-secondary mb-5">
              🎓 Welcome to Mehedi Educare
            </span>

            <h1 className="text-6xl font-black leading-tight">

              Smart Student

              <br />

              Management

              <span className="text-cyan-300">
                {" "}System
              </span>

            </h1>

            <p className="mt-6 text-lg text-gray-300">

              Attendance, Payments, Results,
              Messaging, Student Profiles,
              Dashboard and much more —
              everything in one platform.

            </p>

            <div className="flex gap-4 mt-10">

              <Link
                to="/register"
                className="btn btn-primary btn-lg"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="btn btn-outline btn-lg text-white"
              >
                Login
              </Link>

            </div>

          </div>

          <div>

            <Lottie
              animationData={heroAnimation}
              loop={true}
            />

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-12">

            Powerful Features

          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                📅
                <h3 className="font-bold text-xl">
                  Attendance
                </h3>

                <p>
                  Daily attendance with reports.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                💳
                <h3 className="font-bold text-xl">
                  Payments
                </h3>

                <p>
                  Track monthly fees easily.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                💬
                <h3 className="font-bold text-xl">
                  Messaging
                </h3>

                <p>
                  Student & Admin communication.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                📊
                <h3 className="font-bold text-xl">
                  Reports
                </h3>

                <p>
                  Progress & performance analytics.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section className="py-20 bg-base-100">

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
              className="rounded-3xl shadow-xl"
              alt="Students learning together"
            />

            <div>

              <h2 className="text-4xl font-bold">

                About Mehedi Educare

              </h2>

              <p className="mt-6 text-lg">

                Mehedi Educare is an all-in-one
                student management platform.

              </p>

              <p className="mt-4">

                Manage attendance, payments,
                messaging, student profiles,
                reports and academic progress
                from one beautiful dashboard.

              </p>

              <button className="btn btn-primary mt-8">

                Learn More

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================= WHY CHOOSE US ================= */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-12">

            Why Choose Us?

          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                👨‍🏫
                <h3 className="font-bold">
                  Expert Teachers
                </h3>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                📚
                <h3 className="font-bold">
                  Quality Education
                </h3>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                💻
                <h3 className="font-bold">
                  Modern Technology
                </h3>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                🏆
                <h3 className="font-bold">
                  Trusted Institute
                </h3>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ================= STATISTICS ================= */}

<section className="py-20 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center mb-14">
      Our Achievements
    </h2>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl hover:scale-105 transition">

        <div className="text-6xl mb-3">🎓</div>

        <h3 className="text-5xl font-black">
          500+
        </h3>

        <p className="mt-3 text-lg">
          Students
        </p>

      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl hover:scale-105 transition">

        <div className="text-6xl mb-3">👨‍🏫</div>

        <h3 className="text-5xl font-black">
          25+
        </h3>

        <p className="mt-3 text-lg">
          Expert Teachers
        </p>

      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl hover:scale-105 transition">

        <div className="text-6xl mb-3">🏆</div>

        <h3 className="text-5xl font-black">
          98%
        </h3>

        <p className="mt-3 text-lg">
          Success Rate
        </p>

      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl hover:scale-105 transition">

        <div className="text-6xl mb-3">⭐</div>

        <h3 className="text-5xl font-black">
          10+
        </h3>

        <p className="mt-3 text-lg">
          Years Experience
        </p>

      </div>

    </div>

  </div>

</section>

{/* ================= SERVICES ================= */}

<section className="py-20 bg-base-100">

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center mb-4">
      Our Services
    </h2>

    <p className="text-center text-base-content/70 max-w-3xl mx-auto mb-14">
      Everything you need to manage students efficiently in one
      powerful platform.
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition">

        <div className="card-body">

          <div className="text-5xl">
            📅
          </div>

          <h3 className="text-2xl font-bold">
            Attendance Management
          </h3>

          <p>
            Track daily attendance, monthly reports,
            attendance percentage and history.
          </p>

        </div>

      </div>

      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition">

        <div className="card-body">

          <div className="text-5xl">
            💳
          </div>

          <h3 className="text-2xl font-bold">
            Payment Management
          </h3>

          <p>
            Manage tuition fees, due payments,
            receipts and payment history.
          </p>

        </div>

      </div>

      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition">

        <div className="card-body">

          <div className="text-5xl">
            💬
          </div>

          <h3 className="text-2xl font-bold">
            Student Messaging
          </h3>

          <p>
            Send notices and communicate instantly
            with students.
          </p>

        </div>

      </div>

      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition">

        <div className="card-body">

          <div className="text-5xl">
            📊
          </div>

          <h3 className="text-2xl font-bold">
            Student Reports
          </h3>

          <p>
            View complete student performance,
            progress and attendance analytics.
          </p>

        </div>

      </div>

      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition">

        <div className="card-body">

          <div className="text-5xl">
            🏫
          </div>

          <h3 className="text-2xl font-bold">
            Student Dashboard
          </h3>

          <p>
            Students can view attendance,
            payment status and important notices.
          </p>

        </div>

      </div>

      <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition">

        <div className="card-body">

          <div className="text-5xl">
            🔒
          </div>

          <h3 className="text-2xl font-bold">
            Secure Authentication
          </h3>

          <p>
            Firebase Authentication ensures
            secure login and user protection.
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

{/* ================= OUR TEACHERS ================= */}

<section className="py-20 bg-base-200">

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center mb-4">
      Meet Our Teachers
    </h2>

    <p className="text-center text-base-content/70 max-w-3xl mx-auto mb-14">
      Our experienced teachers are dedicated to helping every student
      achieve academic excellence.
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

      <div className="card bg-base-100 shadow-xl hover:-translate-y-2 transition-all duration-300">
        <figure className="px-6 pt-6">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Teacher"
            className="rounded-full w-36 h-36 object-cover border-4 border-primary"
          />
        </figure>

        <div className="card-body text-center">
          <h3 className="text-xl font-bold">
            Md. Rahim
          </h3>

          <p className="text-primary font-semibold">
            Mathematics Teacher
          </p>

          <p>
            10+ years of teaching experience.
          </p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl hover:-translate-y-2 transition-all duration-300">
        <figure className="px-6 pt-6">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Teacher"
            className="rounded-full w-36 h-36 object-cover border-4 border-secondary"
          />
        </figure>

        <div className="card-body text-center">
          <h3 className="text-xl font-bold">
            Nusrat Jahan
          </h3>

          <p className="text-secondary font-semibold">
            English Teacher
          </p>

          <p>
            Expert in spoken English and grammar.
          </p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl hover:-translate-y-2 transition-all duration-300">
        <figure className="px-6 pt-6">
          <img
            src="https://randomuser.me/api/portraits/men/55.jpg"
            alt="Teacher"
            className="rounded-full w-36 h-36 object-cover border-4 border-accent"
          />
        </figure>

        <div className="card-body text-center">
          <h3 className="text-xl font-bold">
            Ariful Islam
          </h3>

          <p className="text-accent font-semibold">
            ICT Teacher
          </p>

          <p>
            React, Programming & Web Development.
          </p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl hover:-translate-y-2 transition-all duration-300">
        <figure className="px-6 pt-6">
          <img
            src="https://randomuser.me/api/portraits/women/63.jpg"
            alt="Teacher"
            className="rounded-full w-36 h-36 object-cover border-4 border-info"
          />
        </figure>

        <div className="card-body text-center">
          <h3 className="text-xl font-bold">
            Fatema Akter
          </h3>

          <p className="text-info font-semibold">
            Science Teacher
          </p>

          <p>
            Physics, Chemistry & Biology Specialist.
          </p>
        </div>
      </div>

    </div>

  </div>

</section>

{/* ================= TESTIMONIALS ================= */}

<section className="py-20 bg-base-100">

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center mb-4">
      What Our Students Say
    </h2>

    <p className="text-center text-base-content/70 max-w-3xl mx-auto mb-14">
      Students and parents trust Mehedi Educare for quality education
      and modern management.
    </p>

    <div className="grid md:grid-cols-3 gap-8">

      <div className="card bg-base-200 shadow-xl">

        <div className="card-body">

          <div className="text-warning text-2xl">
            ⭐⭐⭐⭐⭐
          </div>

          <p className="italic">
            "The attendance and payment system is very easy to use.
            I can check everything from my dashboard."
          </p>

          <div className="mt-4">

            <h4 className="font-bold">
              Arafat Hossain
            </h4>

            <span className="text-sm opacity-70">
              Class 10 Student
            </span>

          </div>

        </div>

      </div>

      <div className="card bg-base-200 shadow-xl">

        <div className="card-body">

          <div className="text-warning text-2xl">
            ⭐⭐⭐⭐⭐
          </div>

          <p className="italic">
            "The teachers are very supportive and the online dashboard
            makes everything simple."
          </p>

          <div className="mt-4">

            <h4 className="font-bold">
              Nusrat Islam
            </h4>

            <span className="text-sm opacity-70">
              HSC Student
            </span>

          </div>

        </div>

      </div>

      <div className="card bg-base-200 shadow-xl">

        <div className="card-body">

          <div className="text-warning text-2xl">
            ⭐⭐⭐⭐⭐
          </div>

          <p className="italic">
            "The payment receipt and attendance tracking features
            are excellent."
          </p>

          <div className="mt-4">

            <h4 className="font-bold">
              Mehedi Hasan
            </h4>

            <span className="text-sm opacity-70">
              Guardian
            </span>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

</>
  );
}

