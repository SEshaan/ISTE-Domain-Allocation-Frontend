import { useEffect, useState } from "react";
import api from "../../utils/api";
import Loader from "../../components/loader";

// Assuming types based on backend populate
interface McqAnswer {
    questionId: {
        _id: string;
        question: string;
        options: string[];
    };
    selectedOptionIndex: number;
    answerText: string;
}

interface TextAnswer {
    questionId: {
        _id: string;
        question: string;
    };
    answerText: string;
}

interface Response {
    _id: string;
    userId: {
        _id: string;
        name: string;
        regNo: string;
    };
    questionnaireId: {
        _id: string;
        domainId: string;
    };
    mcqAnswers: McqAnswer[];
    textAnswers: TextAnswer[];
}

export default function AdminResponses() {
    const [responses, setResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);

    const fetchResponses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/admin/response");
            setResponses(res.data.data);
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to fetch responses");
            console.error("Failed to fetch responses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResponses();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-16">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
                {selectedResponse ? (
                    <div>
                        <button
                            onClick={() => setSelectedResponse(null)}
                            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            &larr; Back to All Responses
                        </button>
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Response from {selectedResponse.userId.name}</h2>
                            <p className="text-gray-600">Registration No: {selectedResponse.userId.regNo}</p>
                            <p className="text-gray-600">Domain ID: {selectedResponse.questionnaireId.domainId}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">MCQ Answers</h3>
                                <div className="space-y-4">
                                    {selectedResponse.mcqAnswers.length > 0 ? selectedResponse.mcqAnswers.map(ans => (
                                        <div key={ans.questionId._id} className="p-4 bg-gray-50 rounded-lg border">
                                            <p className="font-medium text-gray-800">{ans.questionId.question}</p>
                                            <p className="text-blue-600 mt-1">{ans.questionId.options[ans.selectedOptionIndex]}</p>
                                        </div>
                                    )) : <p className="text-gray-500">No MCQ answers submitted.</p>}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Text Answers</h3>
                                <div className="space-y-4">
                                    {selectedResponse.textAnswers.length > 0 ? selectedResponse.textAnswers.map(ans => (
                                        <div key={ans.questionId._id} className="p-4 bg-gray-50 rounded-lg border">
                                            <p className="font-medium text-gray-800">{ans.questionId.question}</p>
                                            <p className="text-gray-700 mt-1 whitespace-pre-wrap">{ans.answerText}</p>
                                        </div>
                                    )) : <p className="text-gray-500">No text answers submitted.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Questionnaire Responses</h2>
                        <div className="overflow-x-auto">
                            {responses.length > 0 ? (
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration No.</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain ID</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {responses.map((response) => (
                                            <tr key={response._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{response.userId.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{response.userId.regNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{response.questionnaireId.domainId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => setSelectedResponse(response)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 py-8">No responses found.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}