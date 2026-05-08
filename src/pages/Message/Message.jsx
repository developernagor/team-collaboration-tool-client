import React, { useEffect, useRef, useState } from "react";
import { auth } from "../../firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";

function Message() {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const bottomRef = useRef(null);

  // ✅ Get logged-in user safely
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Load messages
  useEffect(() => {
    fetch("https://team-collaboration-tool-server.vercel.app/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        scrollToBottom();
      });
  }, []);

  // ✅ Auto scroll
  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ✅ Send message
  const handleSend = (e) => {
    e.preventDefault();

    const text = e.target.message.value.trim();
    if (!text) return;

    const newMessage = {
      text,
      senderName: currentUser?.displayName || "Anonymous",
      senderEmail: currentUser?.email,
    };

    fetch("https://team-collaboration-tool-server.vercel.app/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages((prev) => [...prev, data.data]);
        }
        e.target.reset();
        scrollToBottom();
      });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* 🔹 Header */}
      <div className="p-4 bg-blue-500 text-white font-semibold text-lg">
        Chat Room
      </div>

      {/* 🔹 Messages */}
      <div className="flex-1 overflow-y-auto p-4">

        {messages.map((msg, index) => {
          const isMe = msg.senderEmail === currentUser?.email;

          return (
            <div
              key={index}
              className={`mb-4 flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-xs">

                {/* 👤 Name (only for others) */}
                {!isMe && (
                  <p className="text-xs text-gray-500 mb-1 ml-1">
                    {msg.senderName || "Unknown"}
                  </p>
                )}

                {/* 💬 Bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isMe
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* 🔹 Input */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t flex gap-2"
      >
        <input
          type="text"
          name="message"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 outline-none"
        />

        <button className="bg-blue-500 text-white px-5 rounded-full">
          Send
        </button>
      </form>
    </div>
  );
}

export default Message;