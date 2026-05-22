import { useEffect, useState } from "react";
import axios from "axios";

interface ActivityLog {
  id: number;
  user_id: number;
  activity: string;
  created_at: string;
  user?: {
    name: string;
  };
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/activity-logs",
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      
      setLogs(response.data.data);
    } catch (error) {
      console.error("Failed to fetch activity logs", error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Activity Logs</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Activity</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border p-2">{log.id}</td>
              <td className="border p-2">{log.user?.name}</td>
              <td className="border p-2">{log.activity}</td>
              <td className="border p-2">
  {new Date(log.created_at).toLocaleString()}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}