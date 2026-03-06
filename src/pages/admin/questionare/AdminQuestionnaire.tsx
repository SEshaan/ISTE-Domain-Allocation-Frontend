import { useEffect, useState } from "react";
import api from "../../../utils/api";
import CreateQuestionnaire from "./CreateQuestionnaire";
import EditQuestionnaireModal from "./EditQuestionnaireModal";

export default function AdminQuestionnaire() {
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const fetchQuestionnaires = async () => {
    const res = await api.get("/admin/questionnaire");
    setQuestionnaires(res.data.data || []);
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow">

        <h2 className="text-2xl font-bold mb-6">
          Admin Questionnaire Management
        </h2>

        <CreateQuestionnaire refresh={fetchQuestionnaires} />

        <hr className="my-8" />

        <h3 className="text-xl font-semibold mb-4">All Questionnaires</h3>

        {questionnaires.map((q) => (
          <div key={q._id} className="border p-4 mb-3 rounded">
            <div>ID: {q._id}</div>
            <div>MCQs: {q.mcqQuestions.length}</div>

            <button
              onClick={() => setEditing(q)}
              className="mt-2 px-3 py-1 border rounded"
            >
              Edit
            </button>
          </div>
        ))}

        {editing && (
          <EditQuestionnaireModal
            questionnaire={editing}
            close={() => setEditing(null)}
            refresh={fetchQuestionnaires}
          />
        )}
      </div>
    </div>
  );
}