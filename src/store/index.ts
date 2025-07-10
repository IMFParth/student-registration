/**
 * Redux Store Configuration
 * Author: Parth Rai
 */

import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './studentsSlice';
import analyticsReducer from './analyticsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    analytics: analyticsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;