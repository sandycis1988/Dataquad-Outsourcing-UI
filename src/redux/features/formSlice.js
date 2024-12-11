import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// Async action for form submission
// charset=UTF-8
export const submitFormData = createAsyncThunk(
  "form/submit",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Sending form data:", formData); // Log the form data
      const response = await axios.post(
        `${BASE_URL}/users/register`,
        formData,
        {

          headers: {
            "Content-Type": "application/json", // Corrected the charset
           "Access-Control-Allow-Origin": "*", // Allow cross-origin requests (though this should ideally be set server-side)
          },
        }
      );
      console.log("API Response:", response.data); // Log the response data
      return response.data;
    } catch (error) {
      console.error("Error submitting form:", error.response);
      
      // Extract the errorMessage from the API response if it exists
      const errorMessage = error.response?.data?.error?.errorMessage || "Error submitting form";
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial state with updated form structure
const initialState = {
  status: null,
  error: {
    userId: null,
    userName: null,
    password: null,
    confirmPassword: null,
    email: null,
    personalemail: null,
    phoneNumber: null,
    designation: null,
    gender:null,
    joiningDate:null,
    dob:null,
    roles: null,
  },
  response: null,
  formData: {
    userId: "",
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
    personalemail: "",
    phoneNumber: "",
    designation: "",
    gender:'',
    joiningDate:null,
    dob:null,
    roles: [], 
  },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    // Update form data
    updateFormData: (state, action) => {
      const { name, value } = action.payload;

      if (name === "roles") {
        // Check if the role already exists in the array
        const existingRoleIndex = state.formData.roles.findIndex(
          (role) => role === value // Assuming `value` is a string representing the role name
        );

        if (existingRoleIndex >= 0) {
          // If the role already exists, remove it
          state.formData.roles.splice(existingRoleIndex, 1);
        } else {
          // If the role doesn't exist, add it
          state.formData.roles.push(value);
        }
      } else {
        // Update other form data fields
        state.formData[name] = value;
      }
    },

    // Clear form data
    clearFormData: (state) => {
      console.log("Clearing form data...");
      state.formData = initialState.formData;  // Only reset formData, leave status, error, response intact
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFormData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitFormData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.response = action.payload;
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.status = "failed";

        // If the error contains an errorMessage, map it to the userId field (or any relevant field)
        if (action.payload) {
          if (action.payload.includes("userId already exists")) {
            state.error.userId = action.payload;
          }
          // You can add additional field-specific checks here
        } else {
          state.error.general = "An unknown error occurred";
        }
      });
  },
});

export const { updateFormData, clearFormData } = formSlice.actions;

export default formSlice.reducer;
