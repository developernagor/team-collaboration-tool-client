import { useCallback, useEffect, useRef, useState } from "react";

function Message({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // UPDATE LAST SEEN (keep this ONLY)
  useEffect(() => {
    if (!currentUser?.email) return;

    const updateLastSeen = async () => {
      await fetch(
        "https://team-collaboration-tool-server.vercel.app/users/last-seen",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser.email }),
        }
      );
    };

    updateLastSeen();
    const interval = setInterval(updateLastSeen, 30000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // FETCH MESSAGES
  const fetchMessages = useCallback(async () => {
    const res = await fetch(
      "https://team-collaboration-tool-server.vercel.app/messages"
    );

    const data = await res.json();

    setMessages(data);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = e.target.message.value.trim();
    if (!text) return;

    setLoading(true);

    await fetch(
      "https://team-collaboration-tool-server.vercel.app/messages",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          senderName: currentUser?.displayName || "Anonymous",
          senderEmail: currentUser?.email,
        }),
      }
    );

    e.target.reset();
    fetchMessages();
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      
      <div className="p-4 bg-blue-500 text-white">
        <h1 className="font-bold">Chat Room</h1>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isMe = msg.senderEmail === currentUser?.email;

          return (
            <div
              key={msg._id}
              className={`mb-3 flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-xs">
                {!isMe && (
                  <p className="text-xs text-gray-500">
                    {msg.senderName}
                  </p>
                )}

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

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="p-3 flex gap-2 bg-white">
        <input
          name="message"
          className="flex-1 border px-3 py-2 rounded-full"
          placeholder="Type message..."
        />

        <button
          disabled={loading}
          className="bg-blue-500 text-white px-4 rounded-full"
        >
          Send
        </button>
      </form>
    </div>
  );
}
export default Message;