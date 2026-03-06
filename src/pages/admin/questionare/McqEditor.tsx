import React from "react";

interface Mcq {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

interface Props {
  mcqs: Mcq[];
  setMcqs: React.Dispatch<React.SetStateAction<Mcq[]>>;
}

export default function McqEditor({ mcqs, setMcqs }: Props) {
  const addMcq = () => {
    setMcqs([...mcqs, { question: "", options: [""], correctOptionIndex: 0 }]);
  };

  const removeMcq = (index: number) => {
    setMcqs(mcqs.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, value: string) => {
    const copy = [...mcqs];
    copy[index].question = value;
    setMcqs(copy);
  };

  const addOption = (mcqIndex: number) => {
    const copy = [...mcqs];
    copy[mcqIndex].options.push("");
    setMcqs(copy);
  };

  const updateOption = (mcqIndex: number, optIndex: number, value: string) => {
    const copy = [...mcqs];
    copy[mcqIndex].options[optIndex] = value;
    setMcqs(copy);
  };

  const setCorrect = (mcqIndex: number, optIndex: number) => {
    const copy = [...mcqs];
    copy[mcqIndex].correctOptionIndex = optIndex;
    setMcqs(copy);
  };

  const removeOption = (mcqIndex: number, optIndex: number) => {
    const copy = [...mcqs];
    const mcq = copy[mcqIndex];

    mcq.options = mcq.options.filter((_, i) => i !== optIndex);

    if (mcq.correctOptionIndex === optIndex) {
      mcq.correctOptionIndex = 0;
    } else if (mcq.correctOptionIndex > optIndex) {
      mcq.correctOptionIndex -= 1;
    }

    setMcqs(copy);
  };

  return (
    <div>
      {mcqs.map((mcq, i) => (
        <div key={i} className="border p-4 mb-4 rounded">
          <input
            value={mcq.question}
            onChange={(e) => updateQuestion(i, e.target.value)}
            placeholder="MCQ Question"
            className="border p-2 w-full mb-3 rounded"
          />

          {mcq.options.map((opt, j) => (
            <div key={j} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name={`correct-${i}`}
                checked={mcq.correctOptionIndex === j}
                onChange={() => setCorrect(i, j)}
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
        type="button"
        onClick={addMcq}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        + Add MCQ
      </button>
    </div>
  );
}