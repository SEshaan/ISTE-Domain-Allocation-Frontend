import { useEffect, useState } from "react";
import api from "../../utils/api";

interface Domain {
  _id: string;
  name: string;
  color?: string;
}

export default function AdminDomains() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [message, setMessage] = useState("");

  /* ================= GET ALL ================= */

  const fetchDomains = async () => {
    try {
      const res = await api.get("/admin/domain");
      setDomains(res.data.data);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error fetching domains");
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  /* ================= GET ONE ================= */

  const getDomain = async () => {
    if (!selectedId) return;

    try {
      const res = await api.get(`/admin/domain/${selectedId}`);
      const d = res.data.data;
      setName(d.name);
      setColor(d.color || "");
      setMessage("Domain fetched");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error fetching domain");
    }
  };

  /* ================= ADD ================= */

  const addDomain = async () => {
    try {
      await api.post("/admin/domain", { name, color });
      setMessage("Domain added");
      setName("");
      setColor("");
      fetchDomains();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error adding domain");
    }
  };

  /* ================= UPDATE ================= */

  const updateDomain = async () => {
    if (!selectedId) return;

    try {
      await api.put(`/admin/domain/${selectedId}`, { name, color });
      setMessage("Domain updated");
      fetchDomains();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error updating domain");
    }
  };

  /* ================= DELETE ================= */

  const deleteDomain = async (id: string) => {
    try {
      await api.delete(`/admin/domain/${id}`);
      setMessage("Domain deleted");
      fetchDomains();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error deleting domain");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-16">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Domain Management</h2>

        {/* All Domains */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-700">All Domains</h3>
            <button
              onClick={fetchDomains}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Refresh
            </button>
          </div>
          <ul className="divide-y divide-gray-200 bg-gray-50 rounded max-h-96 overflow-y-auto">
            {domains.length === 0 && (
              <li className="py-4 text-center text-gray-400">No domains found.</li>
            )}
            {domains.map((d) => (
              <li key={d._id} className="flex items-center justify-between py-3 px-2 hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ background: d.color || '#eee' }}
                  />
                  <span className="font-medium text-gray-700">{d.name}</span>
                  <span className="text-xs text-gray-400">({d._id})</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedId(d._id)}
                    className="px-3 py-1 text-xs bg-yellow-400 text-gray-900 rounded hover:bg-yellow-300"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => deleteDomain(d._id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Domain */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Selected Domain</h3>
          <div className="flex gap-2 mb-2">
            <input
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              placeholder="Domain ID"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              onClick={getDomain}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Load Domain
            </button>
          </div>
        </div>

        {/* Domain Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Domain Form</h3>
          <div className="flex flex-col md:flex-row gap-2 mb-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Color (e.g. #ff0000)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addDomain}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
            <button
              onClick={updateDomain}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Update
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-4 p-3 rounded bg-gray-200 text-gray-700 text-center font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
