import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/authSlice";
import { resetDomainState } from "../../features/domainSlice";
import { resetQuestionState } from "../../features/questionSlice";
import { resetTaskState } from "../../features/taskSlice";
import { persistor } from "../../app/store";
import Header from "../../components/header";
import Loader from "../../components/loader";
import api from "../../utils/api";

type TileStatus = "available" | "locked" | "complete";

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, interviewScheduled } = useAppSelector(state => state.auth);
    const { status } = useAppSelector(state => state.domain);
    const { selectedDomains } = useAppSelector(state => state.domain);

    // Check if all required profile fields are filled
    const profileCompleted = !!(
        user?.name && user.name.trim() &&
        user?.email && user.email.trim() &&
        user?.regNo && user.regNo.trim() &&
        user?.branch && user.branch.trim() &&
        user?.githubLink && user.githubLink.trim() &&
        user?.leetcodeLink && user.leetcodeLink.trim()
    );

    // Check if exactly 2 domains are selected
    const domainSelected = selectedDomains.length === 2;
    const tasksCompleted = false;
    const finalSubmitted = false;

    const [showInterviewPopup, setShowInterviewPopup] = useState(false);
    const [interview, setInterview] = useState<any>(null);

    function handleRedirect(path: string) {
        navigate(path);
    }

    const handleInterviewClick = async () => {
        setShowInterviewPopup(true);
        try {
            const res = await api.get('/interview');
            if (res.data.data && res.data.data.length > 0) {
                setInterview(res.data.data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch interview details", err);
        }
    };

    function handleLogout() {
        dispatch(logout());
        dispatch(resetDomainState());
        dispatch(resetQuestionState());
        dispatch(resetTaskState());
        persistor.purge();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-black text-white pb-8 md:pb-16">
            { status === 'loading' && <Loader /> }
            <Header title="Dashboard" theme="dark" />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* LOGOUT BUTTON */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                    >
                        LOGOUT
                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <BigTile
                        title="PROFILE"
                        subtitle="Complete or edit your personal details"
                        status={!finalSubmitted ? profileCompleted ? "complete" : "available" : "locked"}
                        onClick={() => handleRedirect("/profile")}
                    />

                    <BigTile
                        title="DOMAIN SELECTION"
                        subtitle="Choose or update your preferred domain"
                        status={!finalSubmitted ? profileCompleted ? domainSelected ? "complete" : "available" : "locked" : "locked"}
                        onClick={() => handleRedirect("/domains")}
                    />

                    <BigTile
                        title="QUESTIONS / TASKS"
                        subtitle="Complete domain-specific evaluation"
                        status={
                            !finalSubmitted ? profileCompleted && domainSelected
                                ? tasksCompleted
                                    ? "complete"
                                    : "available"
                                : "locked" : "locked"
                        }
                        onClick={() => handleRedirect("/questionsandtasks")}
                    />

                    <BigTile
                        title="INTERVIEW"
                        subtitle="View your scheduled interview details"
                        status={interviewScheduled ? "available" : "locked"}
                        onClick={handleInterviewClick}
                    />
                </div>
            </div>

            {/* Interview Popup */}
            {showInterviewPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-2xl w-full relative flex flex-col gap-6">
                        <button
                            onClick={() => setShowInterviewPopup(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h2 className="text-3xl font-bold tracking-wide text-center mb-2">INTERVIEW DETAILS</h2>

                        {interview ? (
                            <>
                                <div className="space-y-4 text-lg text-zinc-300">
                                    <div className="flex flex-col md:flex-row justify-between p-4 bg-black/40 rounded-xl border border-zinc-800">
                                        <span className="text-zinc-500 font-bold uppercase text-sm tracking-wider">Date & Time</span>
                                        <span className="font-mono text-white">
                                            {new Date(interview.datetime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row justify-between p-4 bg-black/40 rounded-xl border border-zinc-800">
                                        <span className="text-zinc-500 font-bold uppercase text-sm tracking-wider">Duration</span>
                                        <span className="font-mono text-white">{interview.durationMinutes} Minutes</span>
                                    </div>

                                    {interview.domainId && (
                                        <div className="flex flex-col md:flex-row justify-between p-4 bg-black/40 rounded-xl border border-zinc-800">
                                            <span className="text-zinc-500 font-bold uppercase text-sm tracking-wider">Domain</span>
                                            <span className="font-bold text-white">{interview.domainId.name || "Unknown"}</span>
                                        </div>
                                    )}
                                </div>

                                <a 
                                    href={interview.meetLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group relative w-full aspect-video bg-zinc-800 rounded-xl border-2 border-zinc-700 hover:border-blue-500 hover:bg-zinc-800/80 transition-all flex flex-col items-center justify-center gap-4 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 10l5-5v14l-5-5"></path><rect x="2" y="6" width="13" height="12" rx="2"></rect></svg>
                                    </div>
                                    
                                    <div className="text-center z-10">
                                        <h3 className="text-xl font-bold text-white mb-1">Join Google Meet</h3>
                                        <p className="text-zinc-400 text-sm">{interview.meetLink}</p>
                                    </div>
                                </a>
                            </>
                        ) : (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------------------------------- */
/* BIG TILE COMPONENT                  */
/* ---------------------------------- */

type BigTileProps = {
    title: string;
    subtitle: string;
    status: TileStatus;
    onClick: () => void;
};

function BigTile({ title, subtitle, status, onClick }: BigTileProps) {
    const isLocked = status === "locked";
    const isComplete = status === "complete";

    return (
        <button
            disabled={isLocked}
            onClick={onClick}
            className={`
                relative w-full min-h-[180px] md:min-h-[260px]
                border-2 rounded-xl p-6 text-left transition
                flex flex-col justify-between
                ${isLocked && "border-neutral-700 bg-black opacity-40 cursor-not-allowed"}
                ${!isLocked && "border-white bg-neutral-900 hover:bg-neutral-800 active:text-primary"}
            `}
        >
            {/* STATUS BADGE */}
            <div className="flex justify-start">
                {isLocked && (
                    <span className="px-3 py-1 text-md font-regular bg-neutral-700 rounded-full">
                        LOCKED
                    </span>
                )}
                {isComplete && (
                    <span className="px-3 py-1 text-md font-bold bg-lime-400 text-black rounded-full">
                        COMPLETED
                    </span>
                )}
                {!isLocked && !isComplete && (
                    <span className="px-3 py-1 text-md font-bold bg-yellow-400 text-black rounded-full">
                        AVAILABLE
                    </span>
                )}
            </div>
            {/* ARROW */}
            {!isLocked && (
                <div className="absolute top-6 right-6">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-80"
                    >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                    </svg>
                </div>
            )}

            {/* CONTENT */}
            <div>
                <p className="mt-2 text-md opacity-70 max-w-md">
                    {subtitle}
                </p>
                <h2 className="text-5xl font-bold tracking-wide">
                    {title}
                </h2>
            </div>

            
        </button>
    );
}
