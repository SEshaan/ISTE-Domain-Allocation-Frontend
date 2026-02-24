import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getquestionnaireByDomain, getResponse, submitResponse, updateResponse } from '../../../features/questionSlice';
import Loader from '../../../components/loader';
import Popup from '../../../components/Popup';
import { getReadableTextColor } from '../../../utils/color';

export default function Question() {
  const [searchParams] = useSearchParams();
  const domainId = searchParams.get('domain');

  const domain = useAppSelector((s) => s.domain.domainList.find((d) => d._id === domainId)) ?? {
    name: 'Unknown Domain',
    color: '#333333',
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  
  
  const questionState = useAppSelector((s) => s.question);
  
  const questionnaires = questionState?.questionnaires ?? {};
  const loading = questionState?.loading ?? false;
  const error = questionState?.error ?? null;
  
  
  const questionnaire = useMemo(() => {
    if (!domainId) return null;
    return questionnaires?.[domainId] ?? null;
  }, [questionnaires, domainId]);
  
  // Fetch questionnaire for the domain
  useEffect(() => {
    if (domainId) {
      dispatch(getquestionnaireByDomain(domainId));
    }
  }, [domainId, dispatch]);

  // Fetch responses only after questionnaire is loaded
  useEffect(() => {
    if (questionnaire && questionnaire._id) {
      dispatch(getResponse());
    }
  }, [questionnaire, dispatch]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});

  // Remove autosave logic. Answers are only saved on submit.
  const [popup, setPopup] = useState<{
    visible: boolean;
    message: string;
    theme: 'info' | 'warning' | 'confirm';
    onConfirm?: () => void;
    onClose?: () => void;
  }>({
    visible: false,
    message: '',
    theme: 'info',
  });

  // Load previous response into state if available
  // Load previous response into state if available (only once per questionnaire)
  useEffect(() => {
    if (!questionnaire) return;
    const response = questionState.responses[questionnaire._id];
    if (!response) return;
    if (Object.keys(mcqAnswers).length === 0 && Array.isArray(response.mcqAnswers)) {
      setMcqAnswers(response.mcqAnswers.reduce((acc, curr) => {
        acc[curr.questionId] = curr.selectedOptionIndex;
        return acc;
      }, {} as Record<string, number>));
    }
    if (Object.keys(textAnswers).length === 0 && Array.isArray(response.textAnswers)) {
      setTextAnswers(response.textAnswers.reduce((acc, curr) => {
        acc[curr.questionId] = curr.answerText;
        return acc;
      }, {} as Record<string, string>));
    }
  }, [questionnaire, questionState.responses]);


  /* ================= FETCH questionnaire ================= */

  // (Removed duplicate fetch logic, now handled above)



  /* ================= MERGE QUESTIONS ================= */

  const allQuestions = useMemo(() => {
    if (!questionnaire) return [];

    const mcqs = questionnaire.mcqQuestions.map((q) => ({
      ...q,
      type: 'MCQ' as const,
    }));

    const texts = questionnaire.textQuestions.map((q) => ({
      ...q,
      type: 'TEXT' as const,
    }));

    return [...mcqs, ...texts];
  }, [questionnaire]);

  const currentQuestion = allQuestions[currentQuestionIndex];

  /* ================= NAVIGATION ================= */

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!questionnaire) return;

    if (allQuestions.length === 0) {
      setPopup({
        visible: true,
        theme: 'warning',
        message: 'No questions available.',
      });
      return;
    }

    // Check unanswered
    const unanswered = allQuestions.filter((q) => {
      if (q.type === 'MCQ') return mcqAnswers[q._id] === undefined;
      if (q.type === 'TEXT') return !textAnswers[q._id]?.trim();
      return false;
    });

    if (unanswered.length > 0) {
      setPopup({
        visible: true,
        theme: 'warning',
        message: `Please answer all questions before submitting. (${unanswered.length} remaining)`,
      });
      return;
    }

    const payload = {
      
questionnaireId: questionnaire._id,
      mcqAnswers: Object.entries(mcqAnswers).map(([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      })),
      textAnswers: Object.entries(textAnswers).map(([questionId, answerText]) => ({
        questionId,
        answerText: answerText.trim(),
      })),
    };

    const existingResponse = questionState.responses[questionnaire._id];
    let resultAction;

    if (existingResponse) {
      resultAction = await dispatch(updateResponse({
        responseId: existingResponse._id,
        data: {
          mcqAnswers: payload.mcqAnswers,
          textAnswers: payload.textAnswers,
        }
      }));
    } else {
      resultAction = await dispatch(submitResponse(payload));
    }

    if (submitResponse.fulfilled.match(resultAction) || updateResponse.fulfilled.match(resultAction)) {
      setPopup({
        visible: true,
        theme: 'info',
        message: existingResponse ? 'Response updated successfully!' : 'Response submitted successfully!',
        onClose: () => navigate('/dashboard'),
        
      });
    } else {
      setPopup({
        visible: true,
        theme: 'warning',
        message:
          typeof resultAction.payload === 'string'
            ? resultAction.payload
            : 'Failed to submit response.',
      });
    }
  };

  /* ================= UI STATES ================= */

  if (!domainId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
        <p>No domain specified.</p>
        <button
          onClick={() => navigate('/questionsandtasks')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:scale-105 transition-transform"
        >
          Back
        </button>
      </div>
    );
  }

  if (loading && !questionnaire) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-xl">{error}</p>
        <button
          onClick={() => domainId && dispatch(getquestionnaireByDomain(domainId))}
          className="px-6 py-2 bg-white text-black rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Retry
        </button>
        <button
          onClick={() => navigate('/questionsandtasks')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:scale-105 transition-transform"
        >
          Back
        </button>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
        
        <p>questionnaire not found.</p>
        <button
          onClick={() => navigate('/questionsandtasks')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Back
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
        <p>No questions available.</p>
        <button
          onClick={() => navigate('/questionsandtasks')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Back
        </button>
      </div>
    );
  }

  /* ================= RENDER ================= */


  return (
    <div className="w-full min-h-screen py-8 md:py-12 px-4 transition-colors duration-500"
      style={{ backgroundColor: domain.color }}>
      {loading && <Loader />}

      <div className="max-w-5xl mx-auto bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[80vh] border border-zinc-800 relative">

        <div className="p-6 md:p-12 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <span className="text-sm font-bold tracking-widest text-zinc-500 uppercase">
                Question {currentQuestionIndex + 1} <span className="text-zinc-700">/ {allQuestions.length}</span>
              </span>
              
              <div className="flex items-center gap-2 text-zinc-400 text-sm bg-zinc-900/50 px-3 py-1.5 rounded-full w-fit">
                <span className={`w-2 h-2 rounded-full ${questionnaire?.dueDate ? 'bg-red-500' : 'bg-zinc-600'}`} />
                <span className="font-medium">
                  Deadline: {questionnaire?.dueDate ? new Date(questionnaire.dueDate).toLocaleDateString() : 'None'}
                </span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-2xl md:text-3xl text-white leading-tight text-left">
              {currentQuestion.question.split('\n').map((line, idx) => (
                <p className='mb-4' key={idx}>
                  <ReactMarkdown
                components={{
                  br: ({node, ...props}) => <br className="mb-8" {...props} />,
                  p: ({node, ...props}) => <span {...props} />,
                  strong: ({node, ...props}) => <strong {...props} />, // preserve bold
                  code: ({node, ...props}) => <code className="bg-zinc-800 text-zinc-200 px-1 py-0.5 rounded" {...props} />, // preserve inline code
                  h1: ({node, ...props}) => <h1 className='text-4xl md:text-6xl font-bold mb-4' {...props} />, // preserve heading 1
                  h2: ({node, ...props}) => <h2 className='text-3xl md:text-5xl font-bold mb-3' {...props} />, // preserve heading 2
                  h3: ({node, ...props}) => <h3 className='text-2xl md:text-4xl font-bold mb-2' {...props} />, // preserve heading 3
                  em: ({node, ...props}) => <em {...props} />, // preserve italics
                  hr: ({node, ...props}) => <hr className="my-8 border-zinc-700" {...props} />, // preserve horizontal rules
                }}
                skipHtml={false}
              >
                {line}
              </ReactMarkdown>
                </p>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {currentQuestion.type === 'TEXT' ? (
              <textarea
                className="w-full h-64 md:h-full min-h-[300px] bg-zinc-900/30 text-white text-lg p-6 rounded-xl border-2 border-zinc-800 focus:border-opacity-100 focus:outline-none transition-all resize-none placeholder-zinc-600 focus:bg-zinc-900/50"
                style={{ borderColor: textAnswers[currentQuestion._id] ? domain.color : undefined }}
                placeholder="Type your answer here..."
                value={textAnswers[currentQuestion._id] || ''}
                onChange={(e) => {
                  setTextAnswers((prev) => ({
                    ...prev,
                    [currentQuestion._id]: e.target.value,
                  }));
                }}
              />
            ) : (
              <div className="grid gap-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = mcqAnswers[currentQuestion._id] === idx;
                  return (
                    <button
                      key={idx}
                    onClick={() => {
                      setMcqAnswers((prev) => ({
                        ...prev,
                        [currentQuestion._id]: idx,
                      }));
                    }}
                      className={`group w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-4
                        ${isSelected ? 'bg-zinc-900' : 'bg-zinc-900/20 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40'}
                      `}
                      style={{
                        borderColor: isSelected ? domain.color : undefined,
                      }}
                    >
                      <div 
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
                          ${isSelected ? '' : 'border-zinc-600 group-hover:border-zinc-500'}
                        `}
                        style={{
                          borderColor: isSelected ? domain.color : undefined,
                          backgroundColor: isSelected ? domain.color : 'transparent'
                        }}
                      >
                        {isSelected && <div className="w-2 h-2 bg-black rounded-full" />}
                      </div>
                      <span className={`text-lg ${isSelected ? 'text-white font-medium' : 'text-zinc-300'}`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-zinc-900 flex items-center justify-between">
            <button
              onClick={() => navigate('/questionsandtasks')}
              className="px-6 py-3 rounded-lg font-medium transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              Back
            </button>
            <div className='flex gap-4'>
              <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === 0
                  ? 'text-zinc-700 cursor-not-allowed'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Previous
            </button>

            {currentQuestionIndex === allQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-lg font-bold text-black shadow-lg hover:brightness-110 active:scale-95 transition-all transform"
                style={{ backgroundColor: domain.color, color: getReadableTextColor(domain.color) }}
              >
                Submit Response
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-lg font-bold bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all transform"
              >
                Next
              </button>
            )}
            </div>
          </div>
        </div>
      </div>

      <Popup
        visible={popup.visible}
        theme={popup.theme}
        message={popup.message}
        onClose={() => {setPopup((prev) => ({ ...prev, visible: false })); popup.onClose && popup.onClose();}}
        onConfirm={popup.onConfirm}
      />
    </div>
  );
}
