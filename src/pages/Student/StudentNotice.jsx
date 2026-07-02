import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentNotice() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios
      .get("https://team-collaboration-tool-server.vercel.app/notices")
      .then((res) => setNotices(res.data));
  }, []);

  return (
    <div className="space-y-4">
      {notices.map((notice) => (
        <div
          key={notice._id}
          className="bg-white rounded-lg shadow p-5"
        >
          <h2 className="text-xl font-bold">
            {notice.title}
          </h2>

          <p className="mt-2">
            {notice.description}
          </p>

          <small className="text-gray-500">
            {new Date(
              notice.createdAt
            ).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}