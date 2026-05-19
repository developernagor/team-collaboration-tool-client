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
  const [currentUser, setCurrentUser] =
    useState(null);

  const bottomRef = useRef(null);

  // =========================
  // GET CURRENT USER
  // =========================
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
      }
    );

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
              "Content-Type":
                "application/json",
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

    const interval = setInterval(
      updateLastSeen,
      30000
    );

    return () => clearInterval(interval);
  }, [currentUser]);

  // =========================
  // FETCH MESSAGES
  // =========================
  const fetchMessages = useCallback(
    async () => {
      try {
        const res = await fetch(
          "https://team-collaboration-tool-server.vercel.app/messages"
        );

        const data = await res.json();

        setMessages(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

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

    const text =
      e.target.message.value.trim();

    if (!text) return;

    setLoading(true);

    try {
      const messageData = {
        text,

        senderName:
          currentUser.displayName ||
          currentUser.email.split("@")[0],

        senderEmail:
          currentUser.email,

        createdAt: new Date(),
      };

      const res = await fetch(
        "https://team-collaboration-tool-server.vercel.app/messages",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            messageData
          ),
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
      <div className="bg-blue-500 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">
          Chat Room
        </h1>

        <p className="text-sm opacity-90">
          Welcome{" "}
          {currentUser?.displayName ||
            currentUser?.email}
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {messages.map((msg) => {
          const isMe =
            msg.senderEmail ===
            currentUser?.email;

          return (
            <div
              key={msg._id}
              className={`flex ${
                isMe
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {/* LEFT AVATAR */}
              {!isMe && (
                <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center mr-2 font-bold shrink-0">
                  {msg.senderName
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
              )}

              {/* MESSAGE AREA */}
              <div className="max-w-xs md:max-w-md">

                {/* NAME */}
                <p
                  className={`text-xs mb-1 font-medium ${
                    isMe
                      ? "text-right text-blue-600"
                      : "text-left text-gray-600"
                  }`}
                >
                  {isMe
                    ? "You"
                    : msg.senderName}
                </p>

                {/* MESSAGE BOX */}
                <div
                  className={`px-4 py-3 rounded-2xl shadow-md break-words ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-white text-black rounded-bl-sm"
                  }`}
                >
                  {/* MESSAGE */}
                  <p>{msg.text}</p>

                  {/* TIME */}
                  <p
                    className={`text-[10px] mt-2 ${
                      isMe
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {msg.createdAt
                      ? new Date(
                          msg.createdAt
                        ).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute:
                              "2-digit",
                          }
                        )
                      : ""}
                  </p>
                </div>
              </div>

              {/* RIGHT AVATAR */}
              {isMe && (
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center ml-2 font-bold shrink-0">
                  {currentUser?.displayName
                    ?.charAt(0)
                    .toUpperCase() ||
                    currentUser?.email
                      ?.charAt(0)
                      .toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT AREA */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t flex gap-2"
      >
        <input
          type="text"
          name="message"
          placeholder="Type message..."
          className="flex-1 border rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 transition text-white px-6 rounded-full font-medium disabled:opacity-50"
        >
          {loading
            ? "Sending..."
            : "Send"}
        </button>
      </form>
    </div>
  );
}

export default Message;