import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";


function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    phone: "",
    location: "",
    photoURL: "",
  });

  // Firebase user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  // Load profile from DB
  useEffect(() => {
    if (!user?.email) return;

    fetch(`https://team-collaboration-tool-server.vercel.app/users/profile/${user.email}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setForm({
            name: data.name || "",
            bio: data.bio || "",
            phone: data.phone || "",
            location: data.location || "",
            photoURL: data.photoURL || "",
          });
        }
      });
  }, [user]);

  // handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // save profile
const handleSave = async () => {
  await fetch(
    `https://team-collaboration-tool-server.vercel.app/users/profile/${user.email}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }
  );

  alert("Profile Updated!");
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">

        {/* PHOTO */}
        <div className="flex justify-center mb-4">
          <img
            src={form.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            alt="profile"
          />
        </div>

        {/* INPUTS */}
        <input
          name="photoURL"
          value={form.photoURL}
          onChange={handleChange}
          placeholder="Photo URL"
          className="w-full border p-2 mb-2 rounded"
        />

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 mb-2 rounded"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-2 mb-2 rounded"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 mb-2 rounded"
        />

        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full border p-2 mb-2 rounded"
        />

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save Profile
        </button>

      </div>
    </div>
  );
}

export default Profile;