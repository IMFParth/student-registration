/**
 * Analytics Redux Slice
 * Author: Parth Rai
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsState {
  metrics: {
    totalStudents: number;
    activeStudents: number;
    averageGPA: number;
    graduationRate: number;
  };
  charts: {
    gpaDistribution: number[];
    departmentStats: Record<string, number>;
    yearlyTrends: Array<{ year: number; count: number }>;
  };
  predictions: {
    riskStudents: string[];
    performanceTrends: Record<string, number>;
  };
}

const initialState: AnalyticsState = {
  metrics: {
    totalStudents: 0,
    activeStudents: 0,
    averageGPA: 0,
    graduationRate: 0,
  },
  charts: {
    gpaDistribution: [],
    departmentStats: {},
    yearlyTrends: [],
  },
  predictions: {
    riskStudents: [],
    performanceTrends: {},
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateMetrics: (state, action: PayloadAction<Partial<AnalyticsState['metrics']>>) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    updateCharts: (state, action: PayloadAction<Partial<AnalyticsState['charts']>>) => {
      state.charts = { ...state.charts, ...action.payload };
    },
    updatePredictions: (state, action: PayloadAction<Partial<AnalyticsState['predictions']>>) => {
      state.predictions = { ...state.predictions, ...action.payload };
    },
  },
});

export const { updateMetrics, updateCharts, updatePredictions } = analyticsSlice.actions;
export default analyticsSlice.reducer;