import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Question {
  id: string;
  domainId: string;
  text: string;
  deadline: string;
}

interface Answer {
  questionId: string;
  text: string;
  submittedAt: string;
}

interface QuestionState {
  questions: Question[];
  answers: { [key: string]: Answer };
  loading: boolean;
}

const initialState: QuestionState = {
  questions: [],
  answers: {},
  loading: false,
};

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    submitAnswer: (state, action: PayloadAction<Answer>) => {
      state.answers[action.payload.questionId] = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setQuestions, submitAnswer, setLoading } = questionSlice.actions;
export default questionSlice.reducer;
