import { useEffect, useState } from "react";
import api from "../../utils/api";

interface Interview {
  _id: string;
  userId: any;
  domainId: any;
  datetime: string;
  durationMinutes: number;
  meetLink: string;
}

export default function AdminInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedId, setSelectedId] = useState("");

  const [userId, setUserId] = useState("");
  const [domainId, setDomainId] = useState("");
  const [datetime, setDatetime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [meetLink, setMeetLink] = useState("");

  const [message, setMessage] = useState("");

  /* ================= FETCH ALL ================= */

  const fetchInterviews = async () => {
    try {
      const res = await api.get("/admin/interview");
      setInterviews(res.data.data || []);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error fetching interviews");
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  /* ================= FETCH ONE ================= */

  const getInterview = async () => {
    if (!selectedId) return;

    try {
      const res = await api.get(`/admin/interview/${selectedId}`);
      const i = res.data.data;

      setUserId(i.userId?._id || i.userId);
      setDomainId(i.domainId?._id || i.domainId);
      setDatetime(i.datetime ? i.datetime.slice(0, 16) : "");
      setDurationMinutes(i.durationMinutes);
      setMeetLink(i.meetLink || "");

      setMessage("Interview loaded");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error fetching interview");
    }
  };

  /* ================= CREATE ================= */

  const scheduleInterview = async () => {
    try {
      await api.post("/admin/interview", {
        userId,
        domainId,
        datetime,
        durationMinutes,
        meetLink,
      });

      setMessage("Interview scheduled successfully");
      resetForm();
      fetchInterviews();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error scheduling interview");
    }
  };

  /* ================= UPDATE ================= */

  const updateInterview = async () => {
    if (!selectedId) return;

    try {
      await api.put(`/admin/interview/${selectedId}`, {
        datetime,
        durationMinutes,
        meetLink,
      });

      setMessage("Interview updated successfully");
      fetchInterviews();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error updating interview");
    }
  };

  /* ================= DELETE ================= */

  const cancelInterview = async (id: string) => {
    try {
      await api.delete(`/admin/interview/${id}`);
      setMessage("Interview cancelled");
      fetchInterviews();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error cancelling interview");
    }
  };

  /* ================= UTIL ================= */

  const resetForm = () => {
    setSelectedId("");
    setUserId("");
    setDomainId("");
    setDatetime("");
    setDurationMinutes(30);
    setMeetLink("");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Admin Interview Management
        </h2>

        {/* ================= LIST ================= */}

        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <h3 className="text-xl font-semibold">All Interviews</h3>
            <button
              onClick={fetchInterviews}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Refresh
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {interviews.length === 0 && (
              <div>No interviews found.</div>
            )}

            {interviews.map((i) => (
              <div key={i._id} className="border p-3 mb-3 rounded text-sm">
                <div><b>ID:</b> {i._id}</div>
                <div><b>User:</b> {i.userId?.email || i.userId?._id || i.userId}</div>
                <div><b>Domain:</b> {i.domainId?.name || i.domainId?._id || i.domainId}</div>
                <div><b>Date:</b> {new Date(i.datetime).toLocaleString()}</div>
                <div><b>Duration:</b> {i.durationMinutes} min</div>
                <div><b>Meet:</b> {i.meetLink}</div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setSelectedId(i._id)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => cancelInterview(i._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SELECT ================= */}

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Selected Interview</h3>
          <div className="flex gap-2">
            <input
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              placeholder="Interview ID"
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={getInterview}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Load
            </button>
          </div>
        </div>

        {/* ================= FORM ================= */}

        <div className="flex flex-col gap-4">

          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="border p-2 rounded"
          />

          <input
            value={domainId}
            onChange={(e) => setDomainId(e.target.value)}
            placeholder="Domain ID"
            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            placeholder="Duration (minutes)"
            className="border p-2 rounded"
          />

          <input
            value={meetLink}
            onChange={(e) => setMeetLink(e.target.value)}
            placeholder="Google Meet Link"
            className="border p-2 rounded"
          />

          <div className="flex gap-3">
            <button
              onClick={scheduleInterview}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Schedule
            </button>

            <button
              onClick={updateInterview}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Update
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-6 p-3 bg-gray-200 rounded text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
