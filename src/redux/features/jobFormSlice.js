import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// Async thunk for posting job requirements
export const postJobRequirement = createAsyncThunk(
  "jobForm/postJobRequirement",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/requirements/assignJob`, formData, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
      console.log("job posting log ==== ", response.data);
      return response.data; // Return API response data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to post job requirement"
      );
    }
  }
);

// Initial state
const initialState = {
  formData: {
    jobId: "",
    jobTitle: "",
    clientName: "",
    jobDescription: "",
    jobType: "",
    location: "",
    jobMode: "",
    experienceRequired: "",
    noticePeriod: "",
    relevantExperience: "",
    qualification: "",
    requirementAddedTimeStamp: "",
    recruiterIds: "",
    status: "Open",
    remark: "",
  },
  status: "idle", // idle, loading, succeeded, failed
  error: null,
  successMessage: null, // New field for success messages
  jobPostings: null, // Start with null to store response data
};

// Slice for managing job form state
const jobFormSlice = createSlice({
  name: "jobForm",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      if (name === "recruiterIds") {
        // Ensure recruiterIds is stored as an array
        state.formData[name] = typeof value === "string" ? value.split(",") : value;
      } else {
        state.formData[name] = value;
      }
    },
    resetForm: (state) => {
      // Reset formData to the initial state
      state.formData = { ...initialState.formData };
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postJobRequirement.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(postJobRequirement.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.successMessage = action.payload.message 
        state.jobPostings = action.payload; 
        state.formData = { ...initialState.formData }; 
      })
      .addCase(postJobRequirement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Capture the error message
        state.successMessage = null;
      });
  },
});

// Exporting actions and reducer
export const { updateField, resetForm } = jobFormSlice.actions;
export default jobFormSlice.reducer;
