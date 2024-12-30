import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// Async action for form submission
export const submitFormData = createAsyncThunk(
  "form/submit",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Sending form data:", formData); 
      const response = await axios.post(
        `${BASE_URL}/users/register`,
        formData,
        {
         
          headers: {
            "Content-Type": "application/json",
           // "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log("API Response:", response.data); // Log the response data
      return response.data;
    } catch (error) {
      console.error("Error submitting form:", error.response);

      // Check for specific error code 300 for duplicate userId or email
      const errorCode = error.response?.data?.error?.errorcode;
      const errorMessage = error.response?.data?.error?.errormessage || "Error submitting form";

      // Prevent form submission if API errors occur
      if (errorCode === "300") {
        // Return the error message to reject the form submission
        return rejectWithValue(errorMessage);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Initial state
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
    gender: null,
    joiningDate: null,
    dob: null,
    roles: null,
    general: null, // Add a general error field
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
    gender: '',
    joiningDate: null,
    dob: null,
    roles: ['EMPLOYEE'],
  },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    // Update form data
    updateFormData: (state, action) => {
      const { name, value } = action.payload;

      
        state.formData[name] = value;
     
    },

    // Clear form data
    clearFormData(state) {
      state.formData = {
        userId: "",
        userName: "",
        password: "",
        confirmPassword: "",
        email: "",
        personalemail: "",
        phoneNumber: "",
        designation: "",
        gender: "",
        joiningDate: null,
        dob: null,
        roles: ["EMPLOYEE"],
      };
      state.status = null;
      state.error = {
        userId: null,
        userName: null,
        password: null,
        confirmPassword: null,
        email: null,
        personalemail: null,
        phoneNumber: null,
        designation: null,
        gender: null,
        joiningDate: null,
        dob: null,
        roles: null,
        general: null,
      }; // Reset the error state to the initial structure
      state.response = null; // Clear the response here
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFormData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitFormData.fulfilled, (state, action) => {
        if (action.payload && action.payload) {
          state.status = action.payload.error ? "failed" : "succeeded";
          state.response = action.payload.data
            ? action.payload.data.data
            : action.payload.error;
          console.log("Log for registration success", action.payload);
        }
        console.log("Log for registration success", action.payload);
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.status = "failed";

        // If there is an error message, map it to the respective field
        if (action.payload) {
          // Handle errors for duplicate userId or email
          if (action.payload.includes("userId already exists") || action.payload.includes("email is already in use")) {
            state.error.userId = action.payload; // You can display it as email error as well
            state.error.email = action.payload; // If you want to handle it separately for email
          } else {
            state.error.general = action.payload; // General error message
          }
        } else {
          state.error.general = "An unknown error occurred";
        }
      });
  },
});

export const { updateFormData, clearFormData } = formSlice.actions;

export default formSlice.reducer;