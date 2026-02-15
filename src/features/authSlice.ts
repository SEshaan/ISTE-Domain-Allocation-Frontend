import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
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
}

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   role: null,
//   isAuthenticated: false,
//   profileComplete: false,
// };

// Debugging Initial State
const initialState: AuthState = {
  user: {
    id: 'temp-user-123', // mock _id
    name: 'Test User',
    email: 'testuser@example.com',
    regNo: 'REG2023001',
    branch: 'CSE',
    githubLink: '',
    leetcodeLink: '',
    portfolioLink: '',
    selectedDomainIds: ['',''],
  },
  token: 'temp-jwt-token',
  role: 'USER',
  isAuthenticated: true,
  profileComplete: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string; role: 'USER' | 'ADMIN'; profileComplete: boolean }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.profileComplete = action.payload.profileComplete;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.profileComplete = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return;

      Object.entries(action.payload).forEach(([key, value]) => {
        if (value !== undefined) {
          (state.user as any)[key] = value;
        }
      });

      state.profileComplete = true;
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
});

export const { loginSuccess, logout, updateProfile, setProfileComplete } = authSlice.actions;
export default authSlice.reducer;
