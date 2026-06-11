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

    const endSession = () => {
      navigator.sendBeacon(
        "https://team-collaboration-tool-server.vercel.app/users/session/end",
        new Blob(
          [
            JSON.stringify({
              email: user.email,
            }),
          ],
          {
            type: "application/json",
          }
        )
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