import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_URL from '../apiConfig';

// Async thunk for fetching employees
export const fetchEmployees = createAsyncThunk('employee/fetchEmployees', async () => {
  const response = await axios.get(`${BASE_URL}/users/employee`); // Replace with your API endpoint
  console.log('Logging the employee data from employee slice:', response.data); // Log the response data before returning it
  return response.data;
});

const employeesSlice = createSlice({
  name: 'employee',
  initialState: {
    employeesList: [], // More descriptive than "employeesData"
    fetchStatus: 'idle', // Describes the fetching process status
    fetchError: null, // Clearly indicates this is an error related to fetching
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.fetchStatus = 'loading'; // Describes that the data is being fetched
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded'; // Indicates successful data fetch
        state.employeesList = action.payload; // Stores the fetched employee data
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.fetchStatus = 'failed'; // Indicates the fetch operation failed
        state.fetchError = action.error.message; // Captures the error message
      });
  },
});

export default employeesSlice.reducer;
