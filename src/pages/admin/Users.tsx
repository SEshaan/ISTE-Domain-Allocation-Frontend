export default function Users() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          User Management
        </h1>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-600">
              User profiles with domain preferences and submitted content will appear here.
            </p>
            {/* TODO: Implement user table with pagination, filtering, and view-only profiles */}
          </div>
        </div>
      </div>
    </div>
  );
}
