import { useEffect, useState } from "react";
import api from "../../utils/api";

// Assuming these types based on backend schemas
interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    domainId: {
        _id: string;
        name: string;
    };
}

export default function AdminTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/admin/task");
            setTasks(res.data.data);
        } catch (error: any) {
            console.error("Failed to fetch tasks", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (taskId: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/admin/task/${taskId}`);
            fetchTasks();
        } catch (error: any) {
            console.error("Failed to delete task", error);
            alert("Failed to delete task");
        }
    };

    return (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Tasks</h2>
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Add Task</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 font-medium text-gray-700">Title</th>
                            <th className="p-3 font-medium text-gray-700">Domain</th>
                            <th className="p-3 font-medium text-gray-700">Due Date</th>
                            <th className="p-3 font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{task.title}</td>
                                    <td className="p-3">{task.domainId.name}</td>
                                    <td className="p-3">{new Date(task.dueDate).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <button className="mr-2 px-3 py-1 border rounded hover:bg-gray-100">Edit</button>
                                        <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(task._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-3 text-center text-gray-500">No tasks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}