import { useEffect, useState } from "react";
import Header from "../../../components/header";
import Loader from "../../../components/loader";
import api from "../../../utils/api";

interface User {
    _id: string;
    name: string;
    regNo: string;
    email: string;
}

interface Question {
    _id: string;
    question: string;
}

interface McqAnswer {
    questionId: Question;
    answer: string;
    _id: string;
}

interface TextAnswer {
    questionId: Question;
    answer: string;
    _id: string;
}

interface Questionnaire {
    _id: string;
    domainId: string;
    dueDate: string;
}

interface Response {
    _id: string;
    userId: User;
    questionnaireId: Questionnaire;
    mcqAnswers: McqAnswer[];
    textAnswers: TextAnswer[];
    submittedAt: string;
}

export default function ResponsesPage() {
    const [responses, setResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const res = await api.get("/admin/responses");
                setResponses(res.data.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "An error occurred while fetching responses.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <section className="bg-gray-900 text-white min-h-screen">
            <Header title="Responses" />
            <div className="p-8">
                {selectedResponse ? (
                    <div>
                        <button onClick={() => setSelectedResponse(null)} className="mb-4 rounded bg-primary px-4 py-2 font-bold text-black hover:bg-white transition-colors">
                            &larr; Back to all responses
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Response Details</h2>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p><strong>User:</strong> {selectedResponse.userId.name} ({selectedResponse.userId.regNo})</p>
                            <p><strong>Email:</strong> {selectedResponse.userId.email}</p>
                            <p><strong>Questionnaire Domain ID:</strong> {selectedResponse.questionnaireId.domainId}</p>
                            <p><strong>Submitted At:</strong> {new Date(selectedResponse.submittedAt).toLocaleString()}</p>
                            
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold">MCQ Answers</h3>
                                {selectedResponse.mcqAnswers.length > 0 ? (
                                    <ul className="list-disc pl-5 mt-2 space-y-2">
                                        {selectedResponse.mcqAnswers.map(ans => (
                                            <li key={ans._id}>
                                                <p><strong>Q:</strong> {ans.questionId.question}</p>
                                                <p><strong>A:</strong> {ans.answer}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="mt-2">No MCQ answers.</p>}
                            </div>

                            <div className="mt-4">
                                <h3 className="text-xl font-semibold">Text Answers</h3>
                                {selectedResponse.textAnswers.length > 0 ? (
                                    <ul className="list-disc pl-5 mt-2 space-y-2">
                                        {selectedResponse.textAnswers.map(ans => (
                                            <li key={ans._id}>
                                                <p><strong>Q:</strong> {ans.questionId.question}</p>
                                                <p className="whitespace-pre-wrap"><strong>A:</strong> {ans.answer}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="mt-2">No text answers.</p>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 rounded-lg">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reg No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Domain ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submitted At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {responses.map((response) => (
                                    <tr key={response._id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">{response.userId.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{response.userId.regNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{response.userId.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{response.questionnaireId.domainId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(response.submittedAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => setSelectedResponse(response)} className="text-indigo-400 hover:text-indigo-500">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
