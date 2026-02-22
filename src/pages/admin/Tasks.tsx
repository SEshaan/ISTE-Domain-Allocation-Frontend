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

interface Domain {
    _id: string;
    name: string;
}


export default function AdminTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        domainId: ""
    });
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/admin/task");
            setTasks(res.data.data);
        } catch (error: any) {
            console.error("Failed to fetch tasks", error);
        }
    };

    const fetchDomains = async () => {
        try {
            const res = await api.get("/admin/domain");
            setDomains(res.data.data);
        } catch (error: any) {
            console.error("Failed to fetch domains", error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchDomains();
    }, []);

    const openAdd = () => {
        setEditingTask(null);
        setForm({ title: "", description: "", dueDate: "", domainId: domains[0]?._id || "" });
        setEditorOpen(true);
    };

    const openEdit = (task: Task) => {
        setEditingTask(task);
        setForm({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.slice(0, 10),
            domainId: task.domainId._id
        });
        setEditorOpen(true);
    };

    const closeEditor = () => {
        setEditorOpen(false);
        setEditingTask(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert dueDate to ISO string with time (T00:00:00Z)
            const isoDueDate = form.dueDate ? new Date(form.dueDate + 'T00:00:00Z').toISOString() : "";
            const payload = { ...form, dueDate: isoDueDate };
            if (editingTask) {
                // Edit
                await api.put(`/admin/task/${editingTask._id}`, payload);
            } else {
                // Add
                await api.post("/admin/task", payload);
            }
            fetchTasks();
            closeEditor();
        } catch (error: any) {
            alert("Failed to save task");
            console.error("Failed to save task", error);
        } finally {
            setLoading(false);
        }
    };

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
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800" onClick={openAdd}>Add Task</button>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
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
                                    <td className="p-3">{task.domainId?.name || <span className="text-gray-400 italic">Unknown</span>}</td>
                                    <td className="p-3">{new Date(task.dueDate).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <button className="mr-2 px-3 py-1 border rounded hover:bg-gray-100" onClick={() => openEdit(task)}>Edit</button>
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

            {/* Task Editor Modal */}
            {editorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl" onClick={closeEditor}>&times;</button>
                        <h3 className="text-xl font-bold mb-4">{editingTask ? "Edit Task" : "Add Task"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleFormChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Domain</label>
                                <select
                                    name="domainId"
                                    value={form.domainId}
                                    onChange={handleFormChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    {domains.map((domain) => (
                                        <option key={domain._id} value={domain._id}>{domain.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={form.dueDate}
                                    onChange={handleFormChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-2">
                                <button type="button" className="px-4 py-2 rounded border" onClick={closeEditor} disabled={loading}>Cancel</button>
                                <button type="submit" className="px-6 py-2 rounded bg-black text-white hover:bg-gray-800" disabled={loading}>{loading ? "Saving..." : (editingTask ? "Update" : "Add")}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
