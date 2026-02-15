import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

type TileStatus = "available" | "locked" | "complete";

export default function Dashboard() {
    const navigate = useNavigate();

    // TEMP flags (Redux later)
    const profileCompleted = true;
    const domainSelected = true;
    const tasksCompleted = false;
    const finalSubmitted = false;

    function handleRedirect(path: string) {
        navigate(path);
    }

    return (
        <div className="min-h-screen bg-black text-white pb-8 md:pb-16">
            <Header title="Dashboard" theme="dark" />

            <div className="max-w-7xl mx-auto px-6 py-8">
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
                        onClick={() => handleRedirect("/tasks")}
                    />

                    <BigTile
                        title="FINAL SUBMISSION"
                        subtitle="Review and submit your application"
                        status={
                            profileCompleted && domainSelected && tasksCompleted
                                ?  finalSubmitted ? "complete" : "available"
                                : "locked"
                        }
                        onClick={() => handleRedirect("/final")}
                    />
                </div>
            </div>
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
