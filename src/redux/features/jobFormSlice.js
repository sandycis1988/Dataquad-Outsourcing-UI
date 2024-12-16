import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for posting job requirements
export const postJobRequirement = createAsyncThunk(
  "jobForm/postJobRequirement",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://192.168.0.162:8111/requirements/assignJob`, formData, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
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
  jobPostings: null,  // Start with null to store a single job object
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
    postJobRequirementSuccess: (state, action) => {
      // Directly set jobPostings to the newly posted job (single job)
      state.jobPostings = action.payload;
      state.status = "succeeded";
    },
    resetForm: (state) => {
      // Reset formData to the initial state
      state.formData = { ...initialState.formData };
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postJobRequirement.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(postJobRequirement.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        // Reset the form data on success
        state.formData = { ...initialState.formData };
      })
      .addCase(postJobRequirement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Exporting actions and reducer
export const { updateField, resetForm, postJobRequirementSuccess } = jobFormSlice.actions;
export default jobFormSlice.reducer;
