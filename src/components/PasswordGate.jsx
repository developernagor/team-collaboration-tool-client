import { useState } from "react";

function PasswordGate({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const correctPassword = "11821"; // Change this password

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === correctPassword) {
      setAuthorized(true);
    } else {
      alert("Wrong Password");
    }
  };

  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="border p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">
            Enter Password
          </h2>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="border p-2 rounded w-full mb-3"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return children;
}

export default PasswordGate;