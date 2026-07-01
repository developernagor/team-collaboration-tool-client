import { useEffect } from "react";

export default function useSessionTracker(user) {
  useEffect(() => {
    if (!user?.email) return;

    const startSession = async () => {
      await fetch(
        "https://team-collaboration-tool-server.vercel.app/users/session/start",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        }
      );
    };

    startSession();

   const endSession = async () => {
  await fetch(
    "https://team-collaboration-tool-server.vercel.app/users/session/end",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
      }),
      keepalive: true,
    }
  );
};

    window.addEventListener(
      "beforeunload",
      endSession
    );

    return () => {
      endSession();

      window.removeEventListener(
        "beforeunload",
        endSession
      );
    };
  }, [user]);
}