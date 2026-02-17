import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

/* ================= TYPES ================= */

export interface MCQQuestion {
  _id: string;
  question: string;
  options: string[];
  correctOptionIndex?: number; // optional (normally not needed on frontend)
}

export interface TextQuestion {
  _id: string;
  question: string;
}

export interface questionnaire {
  _id: string;
  domainId: string;
  mcqQuestions: MCQQuestion[];
  textQuestions: TextQuestion[];
  dueDate: string;
}

export interface MCQAnswer {
  questionId: string;
  selectedOptionIndex: number;
}

export interface TextAnswer {
  questionId: string;
  answerText: string;
}

export interface ResponseData {
  _id: string;
  userId: string;
  questionnaireId: string;
  mcqAnswers: MCQAnswer[];
  textAnswers: TextAnswer[];
}

interface QuestionState {
  questionnaires: Record<string, questionnaire>; // domainId -> questionnaire
  responses: Record<string, ResponseData>; // questionnaireId -> Response
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questionnaires: {},
  responses: {},
  loading: false,
  error: null,
};

const normalizeResponse = (data: any): ResponseData => ({
  ...data,
  mcqAnswers: data.mcqAnswers.map((a: any) => ({
    ...a,
    questionId: typeof a.questionId === 'object' ? a.questionId._id : a.questionId,
  })),
  textAnswers: data.textAnswers.map((a: any) => ({
    ...a,
    questionId: typeof a.questionId === 'object' ? a.questionId._id : a.questionId,
  })),
});

/* ================= THUNKS ================= */

export const getquestionnaireByDomain = createAsyncThunk(
  'question/getquestionnaireByDomain',
  async (domainId: string, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const response = await api.get(
        `/user/questionnaire/${domainId}`,
        { headers }
      );

      return response.data.data as questionnaire;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const submitResponse = createAsyncThunk(
  'question/submitResponse',
  async (
    data: {
      questionnaireId: string;
      mcqAnswers: MCQAnswer[];
      textAnswers: TextAnswer[];
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = (getState() as any).auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const response = await api.post(
        '/user/response/',
        {
          questionnaireId: data.questionnaireId, // backend expects this key
          mcqAnswers: data.mcqAnswers,
          textAnswers: data.textAnswers,
        },
        { headers }
      );

      return normalizeResponse(response.data.data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getResponse = createAsyncThunk(
  'question/getResponse',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const response = await api.get('/user/response', { headers });

      return (response.data.data as any[]).map(normalizeResponse);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateResponse = createAsyncThunk(
  'question/updateResponse',
  async (
    {
      responseId,
      data,
    }: {
      responseId: string;
      data: {
        mcqAnswers?: MCQAnswer[];
        textAnswers?: TextAnswer[];
      };
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = (getState() as any).auth?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const response = await api.put(
        `/user/response/${responseId}`,
        data,
        { headers }
      );

      return normalizeResponse(response.data.data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
/* ================= SLICE ================= */

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    resetQuestionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      /* ===== GET questionnaire ===== */
      .addCase(getquestionnaireByDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getquestionnaireByDomain.fulfilled, (state, action) => {
        state.loading = false;
        const q = action.payload;
        state.questionnaires[q.domainId] = q;
      })
      .addCase(getquestionnaireByDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ===== SUBMIT RESPONSE ===== */
      .addCase(submitResponse.pending, (state) => {
        // silent autosave — no global loading
      })
      .addCase(submitResponse.fulfilled, (state, action) => {
        state.loading = false;
        const r = action.payload;
        state.responses[r.questionnaireId] = r;
      })
      .addCase(submitResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ===== GET RESPONSES ===== */
      .addCase(getResponse.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResponse.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach((r) => {
          state.responses[r.questionnaireId] = r;
        });
      })
      .addCase(getResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ===== UPDATE RESPONSE ===== */
      .addCase(updateResponse.pending, (state) => {
        // silent autosave — no global loading
      })
      .addCase(updateResponse.fulfilled, (state, action) => {
        state.loading = false;
        const r = action.payload;
        state.responses[r.questionnaireId] = r;
      })
      .addCase(updateResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default questionSlice.reducer;
export const { resetQuestionState } = questionSlice.actions;
