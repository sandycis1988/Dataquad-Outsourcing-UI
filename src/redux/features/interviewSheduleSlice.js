import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// AsyncThunk for form submission
export const submitInterviewForm = createAsyncThunk(
  "interviewForm/submitInterviewForm",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/interview/schedule`, formData);
      return response.data; // Return the response data on success
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Submission Failed");
    }
  }
);

const initialState = {
  formData: {
    jobId: "",
    candidateId: "",
    candidateFullName: "",
    candidateContactNo: "",
    clientName: "",
    userId: "",
    interviewDateTime: null,
    duration: "",
    zoomLink: "",
    interviewScheduledTimestamp: null,
  },
  isSubmitting: false,
  submissionSuccess: null,
  error: null,
};

const interviewFormSlice = createSlice({
  name: "interviewForm",
  initialState,
  reducers: {
    updateFormField(state, action) {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    resetForm(state) {
      state.formData = initialState.formData;
      state.submissionSuccess = null;
      state.error = null;
    },
    clearError: (state) => {
        state.error = null;  // Clear error message
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitInterviewForm.pending, (state) => {
        state.isSubmitting = true;
        state.submissionSuccess = null;
        state.error = null;
      })
      .addCase(submitInterviewForm.fulfilled, (state) => {
        state.isSubmitting = false;
        state.submissionSuccess = true;
        state.error = null;
      })
      .addCase(submitInterviewForm.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submissionSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { updateFormField, resetForm,clearError } = interviewFormSlice.actions;
export default interviewFormSlice.reducer;
