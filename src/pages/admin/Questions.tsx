export default function AdminQuestions() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Question Management
        </h1>
        <div className="mb-6">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            + Add Question
          </button>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-600">
              Create, edit, and manage questions per domain with deadline validation.
            </p>
            {/* TODO: Implement question CRUD interface with domain-based organization */}
          </div>
        </div>
      </div>
    </div>
  );
}
