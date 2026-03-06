import { useEffect, useState } from "react";
import api from "../../utils/api";

/* ================= TYPES ================= */

interface McqQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
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

  const [editState, setEditState] = useState<EditState>({
    open: false,
    questionnaire: null,
    dueDate: "",
    loading: false,
  });

  const [editMcqs, setEditMcqs] = useState<any[]>([]);
  const [editTexts, setEditTexts] = useState<any[]>([]);

  /* ================= FETCH ================= */

  const fetchQuestionnaires = async () => {
    try {
      const res = await api.get("/admin/questionnaire");
      setQuestionnaires(res.data.data || []);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error fetching questionnaires");
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  /* ================= CREATE MCQ ================= */

  const addMcq = () => {
    setMcqQuestions([
      ...mcqQuestions,
      { question: "", options: [""], correctOptionIndex: 0 },
    ]);
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

  const setCorrectOption = (mcqIndex: number, optIndex: number) => {
    const copy = [...mcqQuestions];
    copy[mcqIndex].correctOptionIndex = optIndex;
    setMcqQuestions(copy);
  };

  const removeOption = (mcqIndex: number, optIndex: number) => {
    const copy = [...mcqQuestions];
    const mcq = copy[mcqIndex];

    mcq.options = mcq.options.filter((_, i) => i !== optIndex);

    if (mcq.correctOptionIndex === optIndex) {
      mcq.correctOptionIndex = 0;
    } else if (mcq.correctOptionIndex > optIndex) {
      mcq.correctOptionIndex -= 1;
    }

    setMcqQuestions(copy);
  };

  /* ================= TEXT ================= */

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

  /* ================= CREATE SUBMIT ================= */

  const addQuestionnaire = async () => {
    if (!domainId) {
      setMessage("Domain ID required");
      return;
    }

    try {
      await api.post(`/admin/questionnaire/${domainId}`, {
        mcqQuestions: mcqQuestions.map((mcq) => ({
          question: mcq.question,
          options: mcq.options,
          correctOptionIndex: mcq.correctOptionIndex,
        })),
        textQuestions,
        dueDate,
      });

      setMessage("Questionnaire created successfully");
      setDomainId("");
      setDueDate("");
      setMcqQuestions([]);
      setTextQuestions([]);

      fetchQuestionnaires();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error creating questionnaire");
    }
  };

  /* ================= EDIT ================= */

  const openEdit = (q: Questionnaire) => {
    setEditMcqs(
      q.mcqQuestions.map((mcq: any) => ({
        _id: mcq._id,
        question: mcq.question,
        options: [...mcq.options],
        correctOptionIndex:
          typeof mcq.correctOptionIndex === "number"
            ? mcq.correctOptionIndex
            : 0,
      }))
    );

    setEditTexts(
      q.textQuestions.map((tq: any) => ({
        _id: tq._id,
        question: tq.question,
      }))
    );

    setEditState({
      open: true,
      questionnaire: q,
      dueDate: q.dueDate ? q.dueDate.slice(0, 16) : "",
      loading: false,
    });
  };

  const closeEdit = () => {
    setEditState({ open: false, questionnaire: null, dueDate: "", loading: false });
    setEditMcqs([]);
    setEditTexts([]);
  };

  const handleEditCorrectOption = (mcqIdx: number, optIdx: number) => {
    setEditMcqs((prev) =>
      prev.map((mcq, i) =>
        i === mcqIdx ? { ...mcq, correctOptionIndex: optIdx } : mcq
      )
    );
  };

  const handleEditRemoveOption = (mcqIdx: number, optIdx: number) => {
    setEditMcqs((prev) =>
      prev.map((mcq, i) => {
        if (i !== mcqIdx) return mcq;

        const newOptions = mcq.options.filter((_: string, j: number) => j !== optIdx);

        let newCorrectIndex = mcq.correctOptionIndex;

        if (newCorrectIndex === optIdx) newCorrectIndex = 0;
        else if (newCorrectIndex > optIdx) newCorrectIndex -= 1;

        return { ...mcq, options: newOptions, correctOptionIndex: newCorrectIndex };
      })
    );
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editState.questionnaire) return;

    setEditState((prev) => ({ ...prev, loading: true }));

    try {
      await api.put(`/admin/questionnaire/${editState.questionnaire._id}`, {
        dueDate: new Date(editState.dueDate).toISOString(),
      });

      for (const mcq of editMcqs) {
        await api.put(`/admin/mcq-question/${mcq._id}`, {
          question: mcq.question,
          options: mcq.options,
          correctOptionIndex: mcq.correctOptionIndex,
        });
      }

      for (const tq of editTexts) {
        await api.put(`/admin/text-question/${tq._id}`, {
          question: tq.question,
        });
      }

      setMessage("Updated successfully");
      fetchQuestionnaires();
      closeEdit();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error updating");
    } finally {
      setEditState((prev) => ({ ...prev, loading: false }));
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-16">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Admin Questionnaire Management
        </h2>

        {/* CREATE SECTION */}

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

        {/* MCQ CREATE */}

        {mcqQuestions.map((mcq, i) => (
          <div key={i} className="border p-4 mb-4 rounded">
            <input
              value={mcq.question}
              onChange={(e) => updateMcqQuestion(i, e.target.value)}
              placeholder="MCQ Question"
              className="border p-2 w-full mb-3 rounded"
            />

            {mcq.options.map((opt, j) => (
              <div key={j} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name={`correct-${i}`}
                  checked={mcq.correctOptionIndex === j}
                  onChange={() => setCorrectOption(i, j)}
                />
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, j, e.target.value)}
                  className="border p-2 flex-1 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeOption(i, j)}
                  className="px-2 bg-red-500 text-white rounded"
                >
                  X
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addOption(i)}
              className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
            >
              + Add Option
            </button>

            <button
              type="button"
              onClick={() => removeMcq(i)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Remove MCQ
            </button>
          </div>
        ))}

        <button
          onClick={addMcq}
          className="px-4 py-2 bg-green-600 text-white rounded mb-6"
        >
          + Add MCQ
        </button>

        <button
          onClick={addQuestionnaire}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Create Questionnaire
        </button>

        {message && (
          <div className="mt-6 p-3 bg-gray-200 rounded text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}