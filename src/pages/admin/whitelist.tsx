import { useEffect, useState } from "react";
import api from "../../utils/api";

interface WhitelistedUser {
  _id: string;
  email: string;
}

export default function AdminWhitelistedUsers() {
  const [users, setUsers] = useState<WhitelistedUser[]>([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  /* ================= GET ALL ================= */

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/whitelist");
      setUsers(res.data.data || []);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= ADD ================= */

  const addUser = async () => {
    if (!email.trim()) {
      setMessage("Email is required");
      return;
    }

    try {
      await api.post("/admin/whitelist", { email });
      setMessage("User whitelisted successfully");
      setEmail("");
      fetchUsers();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error adding user");
    }
  };

  /* ================= DELETE ================= */

  const removeUser = async (id: string) => {
    try {
      await api.delete(`/admin/whitelist/${id}`);
      setMessage("User removed successfully");
      fetchUsers();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error removing user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-16">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Admin Whitelisted Users
        </h2>

        {/* ================= ADD USER ================= */}
        <div className="mb-6 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="User Email"
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={addUser}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>

        {/* ================= USER LIST ================= */}
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-700">Whitelisted Users</h3>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        <ul className="divide-y divide-gray-200 bg-gray-50 rounded max-h-96 overflow-y-auto">
          {users.length === 0 && (
            <li className="py-4 text-center text-gray-400">
              No whitelisted users found.
            </li>
          )}

          {users.map((u) => (
            <li
              key={u._id}
              className="flex justify-between items-center py-3 px-3 hover:bg-gray-100 rounded"
            >
              <span className="font-medium text-gray-700">{u.email}</span>
              <button
                onClick={() => removeUser(u._id)}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {/* ================= MESSAGE ================= */}
        {message && (
          <div className="mt-4 p-3 rounded bg-gray-200 text-gray-700 text-center font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
