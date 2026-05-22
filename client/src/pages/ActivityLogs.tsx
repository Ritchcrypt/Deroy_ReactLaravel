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
interface Summary {
  total_activities: number;
  total_logins: number;
  failed_logins: number;
  managed_users: number;
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<Summary>({
  total_activities: 0,
  total_logins: 0,
  failed_logins: 0,
  managed_users: 0,
});

const [search, setSearch] = useState("");
const [filter, setFilter] = useState("All");

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
    setSummary(response.data.summary);

  } catch (error) {

    console.error("Failed to fetch activity logs", error);

  }
};
  
const getActivityStyle = (activity: string) => {

  if (
    activity.includes("Deleted") ||
    activity.includes("Failed")
  ) {
    return "bg-red-100 text-red-700";
  }

  if (
    activity.includes("Created") ||
    activity.includes("Logged in") ||
    activity.includes("Restored")
  ) {
    return "bg-green-100 text-green-700";
  }

  if (activity.includes("Updated")) {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
};
const filteredLogs = logs.filter((log) => {

  const matchesSearch =
    log.activity.toLowerCase().includes(search.toLowerCase()) ||
    (log.user?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesFilter =
    filter === "All" ||
    log.activity.includes(filter);

  return matchesSearch && matchesFilter;

});
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Activity Logs</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

  <div className="bg-white shadow rounded p-4 border">
    <h2 className="text-sm text-gray-500">Total Activities</h2>
    <p className="text-2xl font-bold">{summary.total_activities}</p>
  </div>

  <div className="bg-white shadow rounded p-4 border">
    <h2 className="text-sm text-gray-500">Total Logins</h2>
    <p className="text-2xl font-bold text-green-600">
      {summary.total_logins}
    </p>
  </div>

  <div className="bg-white shadow rounded p-4 border">
    <h2 className="text-sm text-gray-500">Failed Logins</h2>
    <p className="text-2xl font-bold text-red-600">
      {summary.failed_logins}
    </p>
  </div>

  <div className="bg-white shadow rounded p-4 border">
    <h2 className="text-sm text-gray-500">Managed Users</h2>
    <p className="text-2xl font-bold text-blue-600">
      {summary.managed_users}
    </p>
  </div>

</div>
<div className="flex flex-col md:flex-row gap-4 mb-4">

  <input
    type="text"
    placeholder="Search logs..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded w-full md:w-1/2"
  />

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="border p-2 rounded"
  >
    <option value="All">All Activities</option>
    <option value="Logged in">Logged In</option>
    <option value="Failed">Failed Login</option>
    <option value="Created">Created User</option>
    <option value="Updated">Updated User</option>
    <option value="Deleted">Deleted User</option>
    <option value="Restored">Restored User</option>
  </select>

</div>
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
          {filteredLogs.map((log) => (
            <tr key={log.id}>
              <td className="border p-2">{log.id}</td>
              <td className="border p-2">{log.user?.name}</td>
              <td className="border p-2">

  <span
    className={`px-3 py-1 rounded-full text-sm font-semibold ${getActivityStyle(log.activity)}`}
  >
    {log.activity}
  </span>

</td>
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