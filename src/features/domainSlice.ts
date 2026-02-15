import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Domain {
  id: string;
  name: string;
}

interface DomainState {
  domainList: Domain[];
  selectedDomains: Domain[];      // persisted (from backend)
  draftDomains: Domain[];         // page-level edits
  loading: boolean;
}

const initialState: DomainState = {
  domainList: ['App Dev', 'Web Dev', 'IoT', 'Machine Learning', 'Design', 'Motion Graphics', 'GameDev / XR', 'Electrical', 'Competitive Programming', 'Management'].map(name => ({
    id: name,
    name,
  })),
  selectedDomains: [],
  draftDomains: [],
  loading: false,
};

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
      const exists = state.draftDomains.find(d => d.id === action.payload.id);

      if (exists) {
        state.draftDomains = state.draftDomains.filter(
          d => d.id !== action.payload.id
        );
      } else if (state.draftDomains.length < 2) {
        state.draftDomains.push(action.payload);
      }
    },

    resetDraft(state) {
      state.draftDomains = state.selectedDomains;
    },
  },
});

export const {
  setDomainList,
  setSelectedDomains,
  toggleDraftDomain,
  resetDraft,
} = domainSlice.actions;

export default domainSlice.reducer;

