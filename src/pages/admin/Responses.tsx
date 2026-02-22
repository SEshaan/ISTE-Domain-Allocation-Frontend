import { useEffect, useState } from "react";
import api from "../../utils/api";

// Assuming types based on backend populate
interface McqAnswer {
    questionId: {
        _id: string;
        question: string;
    };
    answer: string;
}

interface TextAnswer {
    questionId: {
        _id: string;
        question: string;
    };
    answer: string;
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

    const fetchResponses = async () => {
        try {
            const res = await api.get("/admin/response");
            setResponses(res.data.data);
        } catch (error: any) {
            console.error("Failed to fetch responses", error);
        }
    };

    useEffect(() => {
        fetchResponses();
    }, []);

    return (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Questionnaire Responses</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {responses.length > 0 ? (
                    responses.map((response) => (
                        <details key={response._id} className="group border border-gray-200 rounded-md">
                            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-900 hover:bg-gray-50">
                                {response.userId.name} ({response.userId.regNo})
                            </summary>
                            <div className="border-t border-gray-200 p-4 bg-slate-50 dark:bg-slate-900">
                                <h4 className="font-semibold mb-2">MCQ Answers</h4>
                                {response.mcqAnswers.map(ans => (
                                    <div key={ans.questionId._id} className="mb-2">
                                        <p className="font-medium text-sm">{ans.questionId.question}</p>
                                        <p className="text-sm text-gray-600">{ans.answer}</p>
                                    </div>
                                ))}
                                <h4 className="font-semibold mt-4 mb-2">Text Answers</h4>
                                {response.textAnswers.map(ans => (
                                    <div key={ans.questionId._id} className="mb-2">
                                        <p className="font-medium text-sm">{ans.questionId.question}</p>
                                        <p className="text-sm text-gray-600">{ans.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </details>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No responses found.</p>
                )}
            </div>
        </div>
    );
}