import { useState } from "react";
import api from "../../../utils/api";
import McqEditor from "./McqEditor";

interface Mcq {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export default function CreateQuestionnaire({ refresh }: { refresh: () => void }) {
  const [domainId, setDomainId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [mcqs, setMcqs] = useState<Mcq[]>([]);
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    try {
      await api.post(`/admin/questionnaire/${domainId}`, {
        mcqQuestions: mcqs,
        textQuestions: [],
        dueDate,
      });

      setMessage("Created successfully");
      setDomainId("");
      setDueDate("");
      setMcqs([]);
      refresh();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Create Questionnaire</h3>

      <input
        value={domainId}
        onChange={(e) => setDomainId(e.target.value)}
        placeholder="Domain ID"
        className="border p-2 rounded w-full mb-4"
      />

      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />

      <McqEditor mcqs={mcqs} setMcqs={setMcqs} />

      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-purple-600 text-white rounded mt-4"
      >
        Create
      </button>

      {message && <div className="mt-3">{message}</div>}
    </div>
  );
}