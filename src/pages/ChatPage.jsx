import React, { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";



import { auth } from "../firebase/firebase.config";
import Users from "./Users/Users";
import Message from "./Message/Message";

function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsub();
  }, []);

  return (
    <div className="h-screen flex">

      {/* 👥 USERS SIDEBAR */}
      <Users currentUser={currentUser} />

      {/* 💬 CHAT AREA */}
      <div className="flex-1">
        <Message currentUser={currentUser} />
      </div>

    </div>
  );
}

export default ChatPage;