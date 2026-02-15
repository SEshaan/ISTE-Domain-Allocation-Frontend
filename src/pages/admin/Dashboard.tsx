export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Pending Tasks</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Pending Interviews</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Active Domains</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
          </div>
        </div>
        {/* TODO: Implement domain-wise stats and pending reviews */}
      </div>
    </div>
  );
}
