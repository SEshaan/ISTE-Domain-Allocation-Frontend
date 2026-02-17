import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/api';
import type { User } from './authSlice';

export interface Domain {
  _id: string;
  name: string;
  description: string;
  color: string;
}

interface DomainState {
  domainList: Domain[];
  selectedDomains: Domain[];
  draftDomains: Domain[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DomainState = {
  domainList: [],
  selectedDomains: [],
  draftDomains: [],
  status: 'idle',
  error: null,
};

/* ================= FETCH DOMAINS ================= */

export const fetchDomains = createAsyncThunk<
  { domains: Domain[]; userSelectedIds: string[] }
>(
  'domain/fetchDomains',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth?.token;
      const user = state.auth?.user;

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : undefined;

      const response = await api.get('/user/domain', { headers });

      return {
        domains: response.data.data,
        userSelectedIds: user?.selectedDomainIds || [],
      };
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data);
      return rejectWithValue(error.message);
    }
  }
);

/* ================= APPLY DOMAINS ================= */
/* Backend replaces entire selection and returns updated user */

export const applyDomains = createAsyncThunk<User, string[]>(
  'domain/applyDomains',
  async (domainIds, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.token;

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : undefined;

      const response = await api.post(
        '/user/domain/apply',
        { domainIds },
        { headers }
      );

      return response.data.data; // updated user
    } catch (error: any) {
      if (error.response) return rejectWithValue(error.response.data);
      return rejectWithValue(error.message);
    }
  }
);

/* ================= SLICE ================= */

const domainSlice = createSlice({
  name: 'domain',
  initialState,
  reducers: {
    setDomainList(state, action: PayloadAction<Domain[]>) {
      state.domainList = action.payload;
    },

    setSelectedDomains(state, action: PayloadAction<Domain[]>) {
      state.selectedDomains = action.payload;
      state.draftDomains = action.payload;
    },

    toggleDraftDomain(state, action: PayloadAction<Domain>) {
      const exists = state.draftDomains.find(
        (d) => d._id === action.payload._id
      );

      if (exists) {
        state.draftDomains = state.draftDomains.filter(
          (d) => d._id !== action.payload._id
        );
      } else if (state.draftDomains.length < 2) {
        state.draftDomains.push(action.payload);
      }
    },

    resetDraft(state) {
      state.draftDomains = state.selectedDomains;
    },

    resetDomainState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      /* ===== FETCH DOMAINS ===== */

      .addCase(fetchDomains.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchDomains.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.domainList = action.payload.domains;

        const selectedIds = action.payload.userSelectedIds;

        state.selectedDomains = state.domainList.filter((d) =>
          selectedIds.includes(d._id)
        );

        state.draftDomains = [...state.selectedDomains];
      })

      .addCase(fetchDomains.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      /* ===== APPLY DOMAINS ===== */

      .addCase(applyDomains.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(applyDomains.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const user = action.payload;
        const selectedIds = user.selectedDomainIds || [];

        state.selectedDomains = state.domainList.filter((d) =>
          selectedIds.includes(d._id)
        );

        state.draftDomains = [...state.selectedDomains];
      })

      .addCase(applyDomains.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setDomainList,
  setSelectedDomains,
  toggleDraftDomain,
  resetDraft,
  resetDomainState,
} = domainSlice.actions;

export default domainSlice.reducer;
