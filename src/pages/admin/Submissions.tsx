import { useEffect, useState } from "react";
import api from "../../utils/api";

// Assuming types based on backend populate
interface Submission {
    _id: string;
    userId: {
        _id: string;
        name: string;
        regNo: string;
        email: string;
    };
    taskId: {
        _id: string;
        title: string;
    };
    repoLink: string;
    dockLink?: string;
    submittedAt: string;
}

export default function AdminSubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    const fetchSubmissions = async () => {
        try {
            const res = await api.get("/admin/submission");
            setSubmissions(res.data.data);
        } catch (error: any) {
            console.error("Failed to fetch submissions", error);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    return (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Task Submissions</h2>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 font-medium text-gray-700">User</th>
                            <th className="p-3 font-medium text-gray-700">Reg No</th>
                            <th className="p-3 font-medium text-gray-700">Task</th>
                            <th className="p-3 font-medium text-gray-700">Submitted At</th>
                            <th className="p-3 font-medium text-gray-700">Links</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length > 0 ? (
                            submissions.map((submission) => (
                                <tr key={submission._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{submission.userId ? submission.userId.name : <span className="text-gray-400 italic">Unknown</span>}</td>
                                    <td className="p-3">{submission.userId ? submission.userId.regNo : <span className="text-gray-400 italic">-</span>}</td>
                                    <td className="p-3">{submission.taskId ? submission.taskId.title : <span className="text-gray-400 italic">Unknown</span>}</td>
                                    <td className="p-3">{new Date(submission.submittedAt).toLocaleString()}</td>
                                    <td className="p-3">
                                        <a href={submission.repoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mr-3">
                                            GitHub
                                        </a>
                                        {submission.dockLink && (
                                            <a href={submission.dockLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                Live
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-3 text-center text-gray-500">No submissions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}