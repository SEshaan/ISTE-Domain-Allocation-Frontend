import { useEffect, useState } from "react";
import api from "../../utils/api";
import { getReadableTextColor } from "../../utils/color";

// Interfaces
interface Domain {
  _id: string;
  name: string;
  color?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  regNo: string;
  branch: string;
  githubLink?: string;
  leetcodeLink?: string;
  portfolioLink?: string;
  selectedDomainIds: Domain[];
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [filterDomain, setFilterDomain] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all domains for the filter dropdown
  const fetchDomains = async () => {
    try {
      const res = await api.get("/admin/domain");
      setDomains(res.data.data);
    } catch (err: any) {
      console.error("Error fetching domains", err);
    }
  };

  // Fetch users, optionally filtered by domain
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = filterDomain
        ? `/admin/user/domain/${filterDomain}`
        : "/admin/user";
      const res = await api.get(url);
      setUsers(res.data.data || []);
      setMessage(
        res.data.message || `${res.data.data?.length || 0} users found.`
      );
    } catch (err: any) {
      setUsers([]);
      setMessage(err.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filterDomain]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDomain(e.target.value);
  };

  const handleRefresh = () => {
    if (filterDomain) {
      setFilterDomain(""); // This will trigger the useEffect to fetch all users
    } else {
      fetchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-16">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          User Management
        </h1>

        {/* Filters and Actions */}
        <div className="p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label
              htmlFor="domain-filter"
              className="font-semibold text-gray-700"
            >
              Filter by Domain:
            </label>
            <select
              id="domain-filter"
              value={filterDomain}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All Domains</option>
              {domains.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {filterDomain ? "Clear Filter & Refresh" : "Refresh"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 p-3 rounded bg-gray-200 text-gray-700 text-center font-medium">
            {message}
          </div>
        )}

        {/* User Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading users...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email / Reg No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selected Domains</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No users found.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.name}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.regNo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.branch}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.selectedDomainIds.map((domain) => (
                            <span key={domain._id} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" style={{ backgroundColor: domain.color || "#eee", color: getReadableTextColor(domain.color || "#eee") }}>
                              {domain.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col gap-1">
                          {user.githubLink && <a href={user.githubLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">GitHub</a>}
                          {user.leetcodeLink && <a href={user.leetcodeLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">LeetCode</a>}
                          {user.portfolioLink && <a href={user.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">Portfolio</a>}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
