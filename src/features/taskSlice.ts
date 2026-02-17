import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

/* ================= TYPES ================= */

export interface Task {
  _id: string;
  domainId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Submission {
  _id: string;
  userId: string;
  taskId: string;
  repoLink: string;
  dockLink: string;
  otherLink?: string;
  submittedAt: string;
}

export interface SubmissionPayload {
  taskId: string;
  repoLink: string;
  dockLink: string;
  otherLink?: string;
}

export interface UpdateSubmissionPayload {
  repoLink?: string;
  dockLink?: string;
  otherLink?: string;
}

interface TaskState {
  tasks: Record<string, Task[]>; // domainId -> Task[]
  submissions: Record<string, Submission>; // taskId -> Submission
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: {},
  submissions: {},
  loading: false,
  error: null,
};

/* ================= THUNKS ================= */

export const getTasksByDomain = createAsyncThunk(
  'task/getTasksByDomain',
  async (domainId: string, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await api.get(`/user/task/${domainId}`, { headers });
      return { domainId, tasks: response.data.data as Task[] };
    } catch (error: any) {
      // A 404 isn't a real error, it just means there are no tasks for this domain.
      if (error.response?.status === 404) {
        return { domainId, tasks: [] };
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSubmissions = createAsyncThunk(
  'task/getSubmissions',
  async (domainId: string, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await api.get('/user/submission', { params: { domainId }, headers });
      const submissions = response.data.data as any[];
      return submissions.map(s => ({
          ...s,
          taskId: typeof s.taskId === 'object' && s.taskId !== null ? s.taskId._id : s.taskId
      })) as Submission[];
    } catch (error: any) {
      // A 404 isn't a real error in this case, it just means the user
      // hasn't made any submissions yet.
      if (error.response?.status === 404) {
        return [];
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const submitTask = createAsyncThunk(
  'task/submitTask',
  async (data: SubmissionPayload, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const { taskId, ...body } = data;
      const response = await api.post(`/user/submission/${taskId}`, body, { headers });
      return response.data.data as Submission;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTaskSubmission = createAsyncThunk(
  'task/updateTaskSubmission',
  async ({ submissionId, data }: { submissionId: string; data: UpdateSubmissionPayload }, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await api.put(`/user/submission/${submissionId}`, data, { headers });
      return response.data.data as Submission;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* ================= SLICE ================= */

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    resetTaskState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksByDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasksByDomain.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks[action.payload.domainId] = action.payload.tasks;
      })
      .addCase(getTasksByDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach((submission) => {
          state.submissions[submission.taskId] = submission;
        });
      })
      .addCase(getSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitTask.fulfilled, (state, action) => {
        state.submissions[action.payload.taskId] = action.payload;
      })
      .addCase(updateTaskSubmission.fulfilled, (state, action) => {
        state.submissions[action.payload.taskId] = action.payload;
      });
  },
});

export const { resetTaskState } = taskSlice.actions;
export default taskSlice.reducer;
