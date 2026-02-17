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

export default function AdminQuestionnaire() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [domainId, setDomainId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [mcqQuestions, setMcqQuestions] = useState<McqQuestion[]>([]);
  const [textQuestions, setTextQuestions] = useState<TextQuestion[]>([]);
  const [message, setMessage] = useState("");

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

          {questionnaires.length === 0 && (
            <div>No questionnaires found.</div>
          )}

          {questionnaires.map((q) => (
            <div key={q._id} className="border p-3 mb-3 rounded">
              <div><b>ID:</b> {q._id}</div>
              <div><b>Domain:</b> {q.domainId}</div>
              <div><b>Due:</b> {new Date(q.dueDate).toLocaleString()}</div>
              <div><b>MCQs:</b> {q.mcqQuestions?.length || 0}</div>
              <div><b>Text Questions:</b> {q.textQuestions?.length || 0}</div>
            </div>
          ))}
        </div>

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
