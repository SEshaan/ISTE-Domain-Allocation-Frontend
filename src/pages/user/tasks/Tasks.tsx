import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getTasksByDomain, getSubmissions, submitTask, updateTaskSubmission } from '../../../features/taskSlice';
import type { SubmissionPayload, UpdateSubmissionPayload } from '../../../features/taskSlice';
import Loader from '../../../components/loader';
import Popup from '../../../components/Popup';
import { getReadableTextColor } from '../../../utils/color';

export default function Tasks() {
  const [searchParams] = useSearchParams();
  const domainId = searchParams.get('domain');

  const domain = useAppSelector((s) => s.domain.domainList.find((d) => d._id === domainId)) ?? {
    name: 'Unknown Domain',
    color: '#333333',
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const taskState = useAppSelector((s) => s.task);
  const { tasks: tasksByDomain, submissions, loading, error } = taskState;

  const tasks = useMemo(() => {
    if (!domainId) return [];
    return tasksByDomain[domainId] ?? [];
  }, [tasksByDomain, domainId]);

  useEffect(() => {
    if (domainId) {
      dispatch(getTasksByDomain(domainId));
      dispatch(getSubmissions(domainId));
    }
  }, [domainId, dispatch]);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [repoLink, setRepoLink] = useState('');
  const [dockLink, setDockLink] = useState('');
  const [otherLink, setOtherLink] = useState('');

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

  const currentTask = tasks[currentTaskIndex];

  useEffect(() => {
    if (currentTask && submissions[currentTask._id]) {
      const submission = submissions[currentTask._id];
      setRepoLink(submission.repoLink || '');
      setDockLink(submission.dockLink || '');
      setOtherLink(submission.otherLink || '');
    } else {
      setRepoLink('');
      setDockLink('');
      setOtherLink('');
    }
  }, [currentTask, submissions]);

  /* ================= NAVIGATION ================= */

  const handleNext = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex((prev) => prev - 1);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!currentTask) return;

    if (!repoLink.trim() || !dockLink.trim()) {
      setPopup({
        visible: true,
        theme: 'warning',
        message: 'Please provide both a repository link and a documentation/deployment link.',
      });
      return;
    }

    const existingSubmission = submissions[currentTask._id];
    let resultAction;

    if (existingSubmission) {
      const payload: UpdateSubmissionPayload = {
        repoLink: repoLink.trim(),
        dockLink: dockLink.trim(),
        otherLink: otherLink.trim() || undefined,
      };
      resultAction = await dispatch(updateTaskSubmission({
        submissionId: existingSubmission._id,
        data: payload,
      }));
    } else {
      const payload: SubmissionPayload = {
        taskId: currentTask._id,
        repoLink: repoLink.trim(),
        dockLink: dockLink.trim(),
        otherLink: otherLink.trim() || undefined,
      };
      resultAction = await dispatch(submitTask(payload));
    }

    if (submitTask.fulfilled.match(resultAction) || updateTaskSubmission.fulfilled.match(resultAction)) {
      setPopup({
        visible: true,
        theme: 'info',
        message: existingSubmission ? 'Submission updated successfully!' : 'Task submitted successfully!',
        onClose: () => {
          if (currentTaskIndex == tasks.length - 1) {
            navigate('/questionsandtasks');
          } else {
            handleNext();
          }
        },
        
      });
    } else {
      setPopup({
        visible: true,
        theme: 'warning',
        message:
          typeof resultAction.payload === 'string'
            ? resultAction.payload
            : 'Failed to submit.',
      });
    }
  };

  /* ================= UI STATES ================= */

  if (!domainId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>No domain specified.</p>
      </div>
    );
  }

  if (loading && tasks.length === 0) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-xl">{error}</p>
        <button
          onClick={() => domainId && dispatch(getTasksByDomain(domainId))}
          className="px-6 py-2 bg-white text-black rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Retry
        </button>
        <button
          onClick={() => navigate('/questionsandtasks')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Back
        </button>
      </div>
    );
  }

  if (!loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
        <p>No tasks found for this domain.</p>
        <button
          onClick={() => navigate('/questionsandtasks')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Back
        </button>
      </div>
    );
  }

  if (!currentTask) {
    return <Loader />;
  }

  /* ================= RENDER ================= */

  const textColor = getReadableTextColor(domain.color);

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
                Task {currentTaskIndex + 1} <span className="text-zinc-700">/ {tasks.length}</span>
              </span>
              
              <div className="flex items-center gap-2 text-zinc-400 text-sm bg-zinc-900/50 px-3 py-1.5 rounded-full w-fit">
                <span className={`w-2 h-2 rounded-full ${currentTask.dueDate ? 'bg-red-500' : 'bg-zinc-600'}`} />
                <span className="font-medium">
                  Deadline: {currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleDateString() : 'None'}
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
              {currentTask.title}
            </h2>
            <p className="text-zinc-400 text-lg">{currentTask.description}</p>
          </div>

          {/* Content - Submission Form */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Repository Link</label>
              <input
                type="url"
                className="w-full bg-zinc-900/30 text-white text-lg p-4 rounded-xl border-2 border-zinc-800 focus:border-opacity-100 focus:outline-none transition-all placeholder-zinc-600 focus:bg-zinc-900/50"
                style={{ borderColor: repoLink ? domain.color : undefined }}
                placeholder="https://github.com/your-username/your-repo"
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Deployment / Documentation Link</label>
              <input
                type="url"
                className="w-full bg-zinc-900/30 text-white text-lg p-4 rounded-xl border-2 border-zinc-800 focus:border-opacity-100 focus:outline-none transition-all placeholder-zinc-600 focus:bg-zinc-900/50"
                style={{ borderColor: dockLink ? domain.color : undefined }}
                placeholder="https://your-project.vercel.app or Google Docs link"
                value={dockLink}
                onChange={(e) => setDockLink(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Other Link (Optional)</label>
              <input
                type="url"
                className="w-full bg-zinc-900/30 text-white text-lg p-4 rounded-xl border-2 border-zinc-800 focus:border-opacity-100 focus:outline-none transition-all placeholder-zinc-600 focus:bg-zinc-900/50"
                placeholder="Figma, etc."
                value={otherLink}
                onChange={(e) => setOtherLink(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-zinc-900 flex items-center justify-between">
            <button
          onClick={() => navigate('/questionsandtasks')}
          className="px-6 py-3 rounded-lg font-medium transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          Back
        </button>

            <div className="flex items-center gap-4">
              
              
              <button
              onClick={handlePrev}
              disabled={currentTaskIndex === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentTaskIndex === 0
                  ? 'text-zinc-700 cursor-not-allowed'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Previous
            </button>

            <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-lg font-bold text-black shadow-lg hover:brightness-110 active:scale-95 transition-all transform"
                style={{ backgroundColor: domain.color, color: textColor }}
              >
                {submissions[currentTask._id] ? 'Update Submission' : 'Submit Task'}
              </button>

              {currentTaskIndex < tasks.length - 1 && (
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