import { useState } from "react";
import api from "../../../utils/api";
import McqEditor from "./McqEditor";

export default function EditQuestionnaireModal({
  questionnaire,
  close,
  refresh,
}: any) {
  const [dueDate, setDueDate] = useState(
    questionnaire.dueDate.slice(0, 16)
  );

  const [mcqs, setMcqs] = useState(
    questionnaire.mcqQuestions.map((m: any) => ({
      _id: m._id,
      question: m.question,
      options: m.options,
      correctOptionIndex: m.correctOptionIndex ?? 0,
    }))
  );

  const handleUpdate = async () => {
    await api.put(`/admin/questionnaire/${questionnaire._id}`, {
      dueDate: new Date(dueDate).toISOString(),
    });

    for (const mcq of mcqs) {
      await api.put(`/admin/mcq-question/${mcq._id}`, {
        question: mcq.question,
        options: mcq.options,
        correctOptionIndex: mcq.correctOptionIndex,
      });
    }

    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-2xl">
        <h3 className="text-lg font-bold mb-4">Edit Questionnaire</h3>

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <McqEditor mcqs={mcqs} setMcqs={setMcqs} />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={close} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}