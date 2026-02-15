import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  domainId: string;
  title: string;
  description: string;
  deadline: string;
}

interface TaskSubmission {
  taskId: string;
  driveLink: string;
  description: string;
  submittedAt: string;
}

interface TaskState {
  tasks: Task[];
  submissions: { [key: string]: TaskSubmission };
  loading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  submissions: {},
  loading: false,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    submitTask: (state, action: PayloadAction<TaskSubmission>) => {
      state.submissions[action.payload.taskId] = action.payload;
    },
    updateTaskSubmission: (state, action: PayloadAction<TaskSubmission>) => {
      state.submissions[action.payload.taskId] = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setTasks, submitTask, updateTaskSubmission, setLoading } = taskSlice.actions;
export default taskSlice.reducer;
