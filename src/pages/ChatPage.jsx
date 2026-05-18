import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth"; // ✅ REQUIRED

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
      <Users currentUser={currentUser} />
      <div className="flex-1">
        <Message currentUser={currentUser} />
      </div>
    </div>
  );
}

export default ChatPage;