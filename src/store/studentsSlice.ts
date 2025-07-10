/**
 * Students Redux Slice
 * Author: Parth Rai
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Student } from '../types';

interface StudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
  selectedStudent: Student | null;
}

const initialState: StudentsState = {
  students: [],
  loading: false,
  error: null,
  selectedStudent: null,
};

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async () => {
    // Mock API call
    return new Promise<Student[]>((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 1000);
    });
  }
);

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(s => s.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch students';
      });
  },
});

export const { setSelectedStudent, addStudent, updateStudent, deleteStudent, clearError } = studentsSlice.actions;
export default studentsSlice.reducer;