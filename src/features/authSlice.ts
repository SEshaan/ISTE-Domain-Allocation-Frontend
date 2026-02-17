import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { applyDomains } from './domainSlice';

export interface User {
  id: string; // maps to _id
  name: string;
  email: string;
  regNo: string;
  branch: string;
  githubLink: string; 
  leetcodeLink: string;
  portfolioLink:string;
  selectedDomainIds: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  role: 'USER' | 'ADMIN' | null;
  isAuthenticated: boolean;
  profileComplete: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  profileComplete: false,
  status: 'idle',
  error: null,
};

export const updateProfile = createAsyncThunk<User, Partial<User>>(
  'auth/updateProfile',
  async (data, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await api.put('/user/profile/update', data, { headers });
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string; role: 'USER' | 'ADMIN'; profileComplete: boolean }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      const { name, regNo, branch, githubLink, leetcodeLink } = action.payload.user;
      state.profileComplete = [name, regNo, branch, githubLink, leetcodeLink]
        .every(field => field?.trim());

    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.profileComplete = false;
    },
    updateDomains: (state, action: PayloadAction<string[]>) => {
      if (!state.user) return;

      state.user.selectedDomainIds = action.payload;
      state.profileComplete = true;
    },
    setProfileComplete: (state, action: PayloadAction<boolean>) => {
      state.profileComplete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfile.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.profileComplete = true;
      state.status = 'succeeded';
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });
    builder.addCase(applyDomains.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { loginSuccess, logout, updateDomains, setProfileComplete } = authSlice.actions;
export default authSlice.reducer;
