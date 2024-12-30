// src/store/candidateSubmissionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// Initial state
const initialState = {
  formData: {
    userId: "",
    jobId: "",
    fullName: "",
    candidateEmailId: "",
    contactNumber: "",
    currentOrganization: "",
    qualification: "",
    totalExperience: "",
    relevantExperience: "",
    currentCTC: "",
    expectedCTC: "",
    noticePeriod: "",
    currentLocation: "",
    preferredLocation: "",
    skills: [],
    communicationSkills: "",
    requiredTechnologiesRating: "",
    overallFeedback: "",
  },
  successMessage: "",
  candidateId:'',
  employeeId:'',
  jobId:'',
  errorMessage: "",
  loading: false,
};

// Async thunk for API submission
export const submitFormData = createAsyncThunk(
  "candidateSubmission/submitFormData",
  async ({ formData, userId, jobId }, { rejectWithValue }) => {
    try {
      // Actual API call using axios
      const response = await axios.post(
        `${BASE_URL}/candidate/submit`,
        {
          ...formData,
          userId, // Include userId
          jobId, // Include jobId
        },
        {
          // withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      ); // Replace with your API endpoint
      return response.data; // Assuming your API returns the success message or response data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message); // Handling error
    }
  }
);

// Slice
const candidateSubmissionSlice = createSlice({
  name: "candidateSubmission",
  initialState,
  reducers: {
    updateFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
      
    },
    resetForm(state) {
      state.formData = initialState.formData;
      state.successMessage = "";
      state.errorMessage = "";
      state.candidateId = "";
      state.employeeId = "";
      state.jobId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFormData.pending, (state) => {
        state.loading = true;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(submitFormData.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; // Message from API
        state.candidateId = action.payload.candidateId; // Candidate ID
        state.employeeId = action.payload.employeeId; // Employee ID
        state.jobId = action.payload.jobId;
        state.errorMessage = "";
        state.formData = initialState.formData;
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          action.payload || "Failed to submit form. Please try again.";
      });
  },
});

export const { updateFormData, resetForm } = candidateSubmissionSlice.actions;

export default candidateSubmissionSlice.reducer;
