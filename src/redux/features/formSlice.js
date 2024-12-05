import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action for form submission
// charset=UTF-8
export const submitFormData = createAsyncThunk(
  "form/submit",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Sending form data:", formData); // Log the form data
      const response = await axios.post(
        "http://192.168.0.148:9998/users/register",
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
      console.error("Error submitting form:", error.response); // Log any errors
      return rejectWithValue(error.response?.data?.fieldErrors || "Error submitting form");
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
    joiningDate:'',
    dob:'',
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
        state.error = action.payload;
      });
  },
});

export const { updateFormData, clearFormData } = formSlice.actions;

export default formSlice.reducer;
