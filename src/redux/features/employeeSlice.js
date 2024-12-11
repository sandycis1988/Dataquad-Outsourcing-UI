import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to simulate submitting employee data
export const submitEmployeeData = createAsyncThunk(
  'employee/submitEmployeeData',
  async (employeeData, { rejectWithValue }) => {
    try {
      // Simulate an API request (replace with actual API URL)
      const response = await fetch('/api/employee', {
        method: 'POST',
        body: JSON.stringify(employeeData),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error); // Reject with error details
      }

      return await response.json(); // Successful submission
    } catch (error) {
      return rejectWithValue(error.message || 'An error occurred'); // Reject with error message
    }
  }
);

const initialState = {
  loading: false,
  success: false,
  apiErrors: {}, // Store API errors
  employeeData: null, // Store employee data on successful submission
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.apiErrors = {};
      state.employeeData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEmployeeData.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.apiErrors = {};
        state.employeeData = null; // Reset employee data while loading
      })
      .addCase(submitEmployeeData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.employeeData = action.payload; // Set employee data on success
        state.apiErrors = {}; // Clear errors on success
      })
      .addCase(submitEmployeeData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.apiErrors = action.payload || {}; // Set API errors on failure
        state.employeeData = null; // Clear employee data on failure
      });
  },
});

export const { resetState } = employeeSlice.actions;

export default employeeSlice.reducer;















/*
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  userData: null,
  loading: false,
  success: false,
  apiErrors: {},
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.apiErrors = {};
    },
    submitEmployeeData: (state, action) => {
      state.loading = true;
    },
    submitEmployeeDataSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.userData = action.payload;
    },
    submitEmployeeDataFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.apiErrors = action.payload;
    },
  },
});

export const { resetState, submitEmployeeData, submitEmployeeDataSuccess, submitEmployeeDataFailure } = employeeSlice.actions;

// Thunk to make API request
export const submitEmployeeDataThunk = (formData) => async (dispatch) => {
  try {
    const response = await axios.post('https://your-api-endpoint.com/register', formData);
    dispatch(submitEmployeeDataSuccess(response.data));
  } catch (error) {
    dispatch(submitEmployeeDataFailure(error.response.data));
  }
};

export default employeeSlice.reducer;

*/ 