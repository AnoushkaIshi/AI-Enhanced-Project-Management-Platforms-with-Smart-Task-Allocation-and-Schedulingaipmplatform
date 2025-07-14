import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getTasks as getTasksApi,
  getRecommendations as getRecommendationsApi,
} from '../../services/taskService';
import { Task } from '../../types/task';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  recommendations: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  recommendations: [],
  loading: false,
  error: null,
};

// ✅ getTasks thunk
export const getTasks = createAsyncThunk<Task[], string, { rejectValue: string }>(
  'tasks/getTasks',
  async (projectId, { rejectWithValue }) => {
    try {
      const tasks = await getTasksApi(projectId);
      return tasks as Task[]; // ✅ Explicit cast
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to fetch tasks'); // ✅ This returns the correct type
    }
  }
);


// ✅ getRecommendations thunk
export const getRecommendations = createAsyncThunk<any[], string, { rejectValue: string }>(
  'tasks/getRecommendations',
  async (taskId, { rejectWithValue }) => {
    try {
      const recommendations = await getRecommendationsApi(taskId);
      return recommendations as any[]; // ✅ Cast to match the expected success type
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Failed to fetch recommendations'); // ✅ Correct reject type
    }
  }
);


const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 getTasks handlers
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'An error occurred';
      })

      // 🔄 getRecommendations handlers
      .addCase(getRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'An error occurred';
      });
  },
});

export const { selectTask } = taskSlice.actions;
export default taskSlice.reducer;
