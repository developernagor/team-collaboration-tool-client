import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";


function Message() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const bottomRef = useRef(null);

  // =========================
  // GET CURRENT USER
  // =========================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsub();
  }, []);

  // =========================
  // UPDATE LAST SEEN
  // =========================
  useEffect(() => {
    if (!currentUser?.email) return;

    const updateLastSeen = async () => {
      try {
        await fetch(
          "https://team-collaboration-tool-server.vercel.app/users/last-seen",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: currentUser.email,
            }),
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    updateLastSeen();

    const interval = setInterval(updateLastSeen, 30000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // =========================
  // FETCH MESSAGES
  // =========================
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(
        "https://team-collaboration-tool-server.vercel.app/messages"
      );

      const data = await res.json();

      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSend = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please login first");
      return;
    }

    const text = e.target.message.value.trim();

    if (!text) return;

    setLoading(true);

    try {
      const messageData = {
        text,
        senderName:
          currentUser.displayName ||
          currentUser.email.split("@")[0],

        senderEmail: currentUser.email,
      };

      const res = await fetch(
        "https://team-collaboration-tool-server.vercel.app/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );

      const data = await res.json();

      if (data.success) {
        e.target.reset();

        setMessages((prev) => [
          ...prev,
          {
            ...messageData,
            _id: data.insertedId,
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="p-4 bg-blue-500 text-white">
        <h1 className="font-bold text-xl">
          Chat Room
        </h1>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4">

        {messages.map((msg) => {
          const isMe =
            msg.senderEmail === currentUser?.email;

          return (
            <div
              key={msg._id}
              className={`mb-3 flex ${
                isMe
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="max-w-xs">

  {/* NAME */}
  <p
    className={`text-xs mb-1 font-medium ${
      isMe
        ? "text-right text-blue-600"
        : "text-left text-gray-600"
    }`}
  >
    {isMe ? "You" : msg.senderName}
  </p>

  {/* MESSAGE */}
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

      {/* INPUT */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t flex gap-2"
      >
        <input
          type="text"
          name="message"
          placeholder="Type message..."
          className="flex-1 border rounded-full px-4 py-2 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-5 rounded-full disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default Message;