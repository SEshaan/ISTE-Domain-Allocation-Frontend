import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../../../components/title';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { submitAnswer } from '../../../features/questionSlice';

export default function Question() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const questions = useAppSelector((s) => s.question.questions);
  const answers = useAppSelector((s) => s.question.answers);

  // Fallback mock when there are no questions in store (useful for development)
  const fallback = {
    id: 'q1',
    domainId: 'DS',
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    deadline: '2025-03-03',
  };

  const currentQuestion = useMemo(() => {
    if (questions && questions.length > 0) {
      if (id) return questions.find((q) => q.id === id) ?? questions[0];
      return questions[0];
    }
    return fallback;
  }, [questions, id]);

  const currentIndex = useMemo(() => {
    if (!questions || questions.length === 0) return 0;
    return Math.max(0, questions.findIndex((q) => q.id === currentQuestion?.id));
  }, [questions, currentQuestion]);

  const [text, setText] = useState(() => answers[currentQuestion?.id ?? fallback.id]?.text ?? '');
  const [saved, setSaved] = useState(false);

  function handleSubmit() {
    const payload = {
      questionId: currentQuestion?.id ?? fallback.id,
      text: text.trim(),
      submittedAt: new Date().toISOString(),
    };

    dispatch(submitAnswer(payload as any));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function goPrev() {
    if (!questions || questions.length === 0) return;
    const prev = questions[currentIndex - 1];
    if (prev) navigate(`/questions?id=${prev.id}`);
  }

  function goNext() {
    if (!questions || questions.length === 0) return;
    const next = questions[currentIndex + 1];
    if (next) navigate(`/questions?id=${next.id}`);
  }

  return (
      <div className="w-full h-screen bg-[#00FFEE] py-12">
        <div className="bg-black rounded-lg p-12 text-primary relative mx-16 h-full flex flex-col">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h2 className="text-4xl md:text-6xl Blockletter text-left">QUESTION {currentIndex + 1}</h2>

              <p className="mt-6 text-2xl text-gray-500 leading-relaxed max-w-3xl text-left">
                {currentQuestion?.text}
              </p>
            </div>

            <div className="w-36 md:w-48 h-36 md:h-48 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              {/* simple placeholder illustration */}
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6" />
                <path d="M9 9h6" />
                <path d="M12 22v-6" />
                <path d="M7 12h10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>

          <div className="mt-6 flex-1">
            <textarea
              className="w-full h-full text-light text-xl bg-transparent border rounded-lg border-gray-500 placeholder-gray-500 p-4 resize-none focus:outline-none"
              placeholder="ANSWER HERE"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="mt-6 flex items-center justify-between flex-shrink-0">
            <div>
                {/* Space for adding more features */}
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <button
                className="px-2 py-1 rounded hover:bg-gray-800 text-4xl"
                onClick={goPrev}
                aria-label="back"
              >
                ←
              </button>
              <button
                className="px-2 py-1 rounded hover:bg-gray-800 text-4xl"
                onClick={goNext}
                aria-label="next"
              >
                →
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-red-500 inline-block" />
              <span className="font-regular text-3xl">DEADLINE: {currentQuestion?.deadline}</span>
            </div>
          </div>

          {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              className="bg-white text-black rounded-full px-6 py-2 font-semibold shadow"
              onClick={handleSubmit}
            >
              Submit
            </button>
            {saved && <span className="ml-3 text-green-400">Saved ✓</span>}
          </div> */}
        </div>
      </div>
  );
}
