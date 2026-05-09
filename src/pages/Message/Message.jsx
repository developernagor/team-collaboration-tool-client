import React, { useEffect, useRef, useState } from "react";
import { auth } from "../../firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";

function Message() {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const bottomRef = useRef(null);

  // ✅ Auth
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
        // Sort by time
        const sorted = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sorted);
        scrollToBottom();
      });
  }, []);

  // ✅ Scroll
  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ✅ Format Time
  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Format Date Label
  const getDateLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString();
  };

  // ✅ Send
  const handleSend = (e) => {
    e.preventDefault();

    const text = e.target.message.value.trim();
    if (!text) return;

    const newMessage = {
      text,
      senderName: currentUser?.displayName || "Anonymous",
      senderEmail: currentUser?.email,
      createdAt: new Date().toISOString(),
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

  // ✅ Track last date
  let lastDate = null;

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <div className="p-4 bg-blue-500 text-white font-semibold text-lg">
        Chat Room
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">

        {messages.map((msg, index) => {
          const isMe = msg.senderEmail === currentUser?.email;
          const currentDate = getDateLabel(msg.createdAt);

          const showDate = currentDate !== lastDate;
          lastDate = currentDate;

          return (
            <React.Fragment key={index}>

              {/* 📅 Date Separator */}
              {showDate && (
                <div className="text-center my-4">
                  <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                    {currentDate}
                  </span>
                </div>
              )}

              {/* 💬 Message */}
              <div
                className={`mb-3 flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-xs">

                  {!isMe && (
                    <p className="text-xs text-gray-500 mb-1 ml-1">
                      {msg.senderName || "Unknown"}
                    </p>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isMe
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    <p>{msg.text}</p>

                    <p
                      className={`text-[10px] mt-1 text-right ${
                        isMe ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
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