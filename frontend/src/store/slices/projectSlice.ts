import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getProjects = createAsyncThunk('projects/getProjects', async () => {
  const res = await fetch('/api/projects');
  return await res.json();
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(getProjects.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default projectSlice.reducer;
