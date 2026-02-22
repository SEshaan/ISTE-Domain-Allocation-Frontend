import { useEffect, useState } from "react";
import api from "../../utils/api";

interface McqQuestion {
  question: string;
  options: string[];
}

interface TextQuestion {
  question: string;
}

interface Questionnaire {
  _id: string;
  domainId: string;
  dueDate: string;
  mcqQuestions: any[];
  textQuestions: any[];
}


interface EditState {
  open: boolean;
  questionnaire: Questionnaire | null;
  dueDate: string;
  loading: boolean;
}

export default function AdminQuestionnaire() {

  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [domainId, setDomainId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [mcqQuestions, setMcqQuestions] = useState<McqQuestion[]>([]);
  const [textQuestions, setTextQuestions] = useState<TextQuestion[]>([]);
  const [message, setMessage] = useState("");
  const [editState, setEditState] = useState<EditState>({ open: false, questionnaire: null, dueDate: "", loading: false });

  /* ================= FETCH ================= */

  const fetchQuestionnaires = async () => {
    try {
      const res = await api.get("/admin/questionnaire");
      setQuestionnaires(res.data.data || []);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error fetching questionnaires");
    }
  };
  /* ================= EDIT HANDLERS ================= */
  const openEdit = (q: Questionnaire) => {
    // Deep copy questions for editing
    setEditMcqs(q.mcqQuestions.map((mcq: any) => ({ _id: mcq._id, question: mcq.question, options: [...mcq.options] })));
    setEditTexts(q.textQuestions.map((tq: any) => ({ _id: tq._id, question: tq.question })));
    setEditState({
      open: true,
      questionnaire: q,
      dueDate: q.dueDate ? q.dueDate.slice(0, 16) : "",
      loading: false,
    });
  };

  // Local state for editing questions in modal
  const [editMcqs, setEditMcqs] = useState<any[]>([]);
  const [editTexts, setEditTexts] = useState<any[]>([]);

  const closeEdit = () => {
    setEditState({ open: false, questionnaire: null, dueDate: "", loading: false });
    setEditMcqs([]);
    setEditTexts([]);
  };

  const handleEditDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditState((prev) => ({ ...prev, dueDate: e.target.value }));
  };

  const handleEditMcqChange = (idx: number, value: string) => {
    setEditMcqs((prev) => prev.map((mcq, i) => i === idx ? { ...mcq, question: value } : mcq));
  };
  const handleEditMcqOptionChange = (mcqIdx: number, optIdx: number, value: string) => {
    setEditMcqs((prev) => prev.map((mcq, i) => i === mcqIdx ? { ...mcq, options: mcq.options.map((opt: string, j: number) => j === optIdx ? value : opt) } : mcq));
  };
  const handleEditAddOption = (mcqIdx: number) => {
    setEditMcqs((prev) => prev.map((mcq, i) => i === mcqIdx ? { ...mcq, options: [...mcq.options, ""] } : mcq));
  };
  const handleEditRemoveOption = (mcqIdx: number, optIdx: number) => {
    setEditMcqs((prev) => prev.map((mcq, i) => i === mcqIdx ? { ...mcq, options: mcq.options.filter((_: string, j: number) => j !== optIdx) } : mcq));
  };
  const handleEditRemoveMcq = (idx: number) => {
    setEditMcqs((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleEditAddMcq = () => {
    setEditMcqs((prev) => [...prev, { question: "", options: [""] }]);
  };

  const handleEditTextChange = (idx: number, value: string) => {
    setEditTexts((prev) => prev.map((tq, i) => i === idx ? { ...tq, question: value } : tq));
  };
  const handleEditRemoveText = (idx: number) => {
    setEditTexts((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleEditAddText = () => {
    setEditTexts((prev) => [...prev, { question: "" }]);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editState.questionnaire) return;
    setEditState((prev) => ({ ...prev, loading: true }));
    try {
      // Update due date
      await api.put(`/admin/questionnaire/${editState.questionnaire._id}`, {
        dueDate: new Date(editState.dueDate).toISOString(),
      });
      // Update MCQ questions
      for (const mcq of editMcqs) {
        if (mcq._id) {
          await api.put(`/admin/mcq-question/${mcq._id}`, { question: mcq.question, options: mcq.options });
        }
        // else: new MCQ creation not supported in edit (backend does not support adding to existing questionnaire)
      }
      // Update text questions
      for (const tq of editTexts) {
        if (tq._id) {
          await api.put(`/admin/text-question/${tq._id}`, { question: tq.question });
        }
      }
      setMessage("Questionnaire and questions updated successfully");
      fetchQuestionnaires();
      closeEdit();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error updating questionnaire/questions");
    } finally {
      setEditState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this questionnaire?")) return;
    try {
      await api.delete(`/admin/questionnaire/${id}`);
      setMessage("Questionnaire deleted successfully");
      fetchQuestionnaires();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error deleting questionnaire");
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  /* ================= MCQ HANDLERS ================= */

  const addMcq = () => {
    setMcqQuestions([...mcqQuestions, { question: "", options: [""] }]);
  };

  const removeMcq = (index: number) => {
    setMcqQuestions(mcqQuestions.filter((_, i) => i !== index));
  };

  const updateMcqQuestion = (index: number, value: string) => {
    const copy = [...mcqQuestions];
    copy[index].question = value;
    setMcqQuestions(copy);
  };

  const addOption = (mcqIndex: number) => {
    const copy = [...mcqQuestions];
    copy[mcqIndex].options.push("");
    setMcqQuestions(copy);
  };

  const updateOption = (mcqIndex: number, optIndex: number, value: string) => {
    const copy = [...mcqQuestions];
    copy[mcqIndex].options[optIndex] = value;
    setMcqQuestions(copy);
  };

  const removeOption = (mcqIndex: number, optIndex: number) => {
    const copy = [...mcqQuestions];
    copy[mcqIndex].options = copy[mcqIndex].options.filter(
      (_, i) => i !== optIndex
    );
    setMcqQuestions(copy);
  };

  /* ================= TEXT QUESTION HANDLERS ================= */

  const addTextQuestion = () => {
    setTextQuestions([...textQuestions, { question: "" }]);
  };

  const removeTextQuestion = (index: number) => {
    setTextQuestions(textQuestions.filter((_, i) => i !== index));
  };

  const updateTextQuestion = (index: number, value: string) => {
    const copy = [...textQuestions];
    copy[index].question = value;
    setTextQuestions(copy);
  };

  /* ================= CREATE ================= */

  const addQuestionnaire = async () => {
    if (!domainId) {
      setMessage("Domain ID required");
      return;
    }

    try {
      await api.post(`/admin/questionnaire/${domainId}`, {
        mcqQuestions,
        textQuestions,
        dueDate,
      });

      setMessage("Questionnaire created successfully");

      // Reset
      setDomainId("");
      setDueDate("");
      setMcqQuestions([]);
      setTextQuestions([]);

      fetchQuestionnaires();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error creating questionnaire");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-16">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Admin Questionnaire Management
        </h2>

        {/* ================= LIST ================= */}

        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <h3 className="text-xl font-semibold">All Questionnaires</h3>
            <button
              onClick={fetchQuestionnaires}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Refresh
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {questionnaires.length === 0 && (
              <div>No questionnaires found.</div>
            )}

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3 font-medium text-gray-700">ID</th>
                  <th className="p-3 font-medium text-gray-700">Domain</th>
                  <th className="p-3 font-medium text-gray-700">Due</th>
                  <th className="p-3 font-medium text-gray-700">MCQs</th>
                  <th className="p-3 font-medium text-gray-700">Text Qs</th>
                  <th className="p-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questionnaires.map((q) => (
                  <tr key={q._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{q._id}</td>
                    <td className="p-3">{q.domainId}</td>
                    <td className="p-3">{new Date(q.dueDate).toLocaleString()}</td>
                    <td className="p-3">{q.mcqQuestions?.length || 0}</td>
                    <td className="p-3">{q.textQuestions?.length || 0}</td>
                    <td className="p-3">
                      <button className="mr-2 px-3 py-1 border rounded hover:bg-gray-100" onClick={() => openEdit(q)}>Edit</button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(q._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* ================= EDIT MODAL ================= */}
        {editState.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative overflow-y-auto max-h-screen">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl" onClick={closeEdit}>&times;</button>
              <h3 className="text-xl font-bold mb-4">Edit Questionnaire</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    value={editState.dueDate}
                    onChange={handleEditDueDateChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                {/* MCQ SECTION */}
                <div>
                  <h4 className="font-semibold mb-2">MCQ Questions</h4>
                  <button type="button" onClick={handleEditAddMcq} className="mb-3 px-3 py-1 bg-green-600 text-white rounded">+ Add MCQ</button>
                  {editMcqs.map((mcq, i) => (
                    <div key={mcq._id || i} className="border p-3 mb-3 rounded">
                      <input
                        value={mcq.question}
                        onChange={e => handleEditMcqChange(i, e.target.value)}
                        placeholder="MCQ Question"
                        className="border p-2 w-full mb-2 rounded"
                      />
                      {mcq.options.map((opt: string, j: number) => (
                        <div key={j} className="flex gap-2 mb-2">
                          <input
                            value={opt}
                            onChange={e => handleEditMcqOptionChange(i, j, e.target.value)}
                            placeholder="Option"
                            className="border p-2 flex-1 rounded"
                          />
                          <button type="button" onClick={() => handleEditRemoveOption(i, j)} className="px-2 bg-red-500 text-white rounded">X</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleEditAddOption(i)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2">+ Add Option</button>
                      <button type="button" onClick={() => handleEditRemoveMcq(i)} className="px-3 py-1 bg-red-600 text-white rounded">Remove MCQ</button>
                    </div>
                  ))}
                </div>
                {/* TEXT SECTION */}
                <div>
                  <h4 className="font-semibold mb-2">Text Questions</h4>
                  <button type="button" onClick={handleEditAddText} className="mb-3 px-3 py-1 bg-green-600 text-white rounded">+ Add Text Question</button>
                  {editTexts.map((tq, i) => (
                    <div key={tq._id || i} className="flex gap-2 mb-3">
                      <input
                        value={tq.question}
                        onChange={e => handleEditTextChange(i, e.target.value)}
                        placeholder="Text Question"
                        className="border p-2 flex-1 rounded"
                      />
                      <button type="button" onClick={() => handleEditRemoveText(i)} className="px-3 bg-red-600 text-white rounded">X</button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button type="button" className="px-4 py-2 rounded border" onClick={closeEdit} disabled={editState.loading}>Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded bg-black text-white hover:bg-gray-800" disabled={editState.loading}>{editState.loading ? "Saving..." : "Update"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= CREATE ================= */}

        <div>
          <h3 className="text-xl font-semibold mb-4">Create Questionnaire</h3>

          <div className="flex flex-col gap-4">

            <input
              value={domainId}
              onChange={(e) => setDomainId(e.target.value)}
              placeholder="Domain ID"
              className="border p-2 rounded"
            />

            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-2 rounded"
            />

            {/* MCQ SECTION */}
            <div>
              <h4 className="font-semibold mb-2">MCQ Questions</h4>
              <button
                onClick={addMcq}
                className="mb-3 px-3 py-1 bg-green-600 text-white rounded"
              >
                + Add MCQ
              </button>

              {mcqQuestions.map((mcq, i) => (
                <div key={i} className="border p-3 mb-3 rounded">
                  <input
                    value={mcq.question}
                    onChange={(e) => updateMcqQuestion(i, e.target.value)}
                    placeholder="MCQ Question"
                    className="border p-2 w-full mb-2 rounded"
                  />

                  {mcq.options.map((opt, j) => (
                    <div key={j} className="flex gap-2 mb-2">
                      <input
                        value={opt}
                        onChange={(e) =>
                          updateOption(i, j, e.target.value)
                        }
                        placeholder="Option"
                        className="border p-2 flex-1 rounded"
                      />
                      <button
                        onClick={() => removeOption(i, j)}
                        className="px-2 bg-red-500 text-white rounded"
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addOption(i)}
                    className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    + Add Option
                  </button>

                  <button
                    onClick={() => removeMcq(i)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Remove MCQ
                  </button>
                </div>
              ))}
            </div>

            {/* TEXT SECTION */}
            <div>
              <h4 className="font-semibold mb-2">Text Questions</h4>
              <button
                onClick={addTextQuestion}
                className="mb-3 px-3 py-1 bg-green-600 text-white rounded"
              >
                + Add Text Question
              </button>

              {textQuestions.map((tq, i) => (
                <div key={i} className="flex gap-2 mb-3">
                  <input
                    value={tq.question}
                    onChange={(e) =>
                      updateTextQuestion(i, e.target.value)
                    }
                    placeholder="Text Question"
                    className="border p-2 flex-1 rounded"
                  />
                  <button
                    onClick={() => removeTextQuestion(i)}
                    className="px-3 bg-red-600 text-white rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addQuestionnaire}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Create Questionnaire
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-6 p-3 bg-gray-200 rounded text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
