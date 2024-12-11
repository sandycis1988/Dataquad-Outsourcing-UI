import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// Async thunk to handle email submission and send OTP
export const sendOtpAsync = createAsyncThunk(
  "forgotPassword/sendOtp", // The name of the action
  async (email, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/users/send-otp`;

      const response = await axios.post(
        url,
        { email }, // Send email in the body as JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to send OTP");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk for OTP verification
export const verifyOtpAsync = createAsyncThunk(
  "forgotPassword/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/users/verify-otp`;

      const response = await axios.post(
        url,
        { email, otp }, // Send email and OTP in the body as JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "OTP verification failed");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Async thunk to reset password after OTP verification
export const resetPasswordAsync = createAsyncThunk(
  "forgotPassword/resetPassword",
  async ({ email, updatePassword ,confirmPassword}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/update-password`,
        { email, updatePassword,confirmPassword }, // Send email and new password
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to reset password");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    email: "",
    otp: "", // Store OTP sent by the backend
    enteredOtp: "", // Store OTP entered by the user
    loading: false,
    step: 1, // 1: Email, 2: OTP, 3: New Password
    error: null,
    response: null,
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setOtp: (state, action) => {
      state.enteredOtp = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling sendOtpAsync action
      .addCase(sendOtpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 2; // Move to OTP step
        // state.email = action.payload
        state.otp = action.payload.otp; // Save OTP
      })
      .addCase(sendOtpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling verifyOtpAsync action
      .addCase(verifyOtpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpAsync.fulfilled, (state) => {
        state.loading = false;
        state.step = 3; // Move to reset password step after OTP verification
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling resetPasswordAsync action
      .addCase(resetPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.loading = false;
        state.step = 1; // Reset to Step 1 after password reset
        state.otp = ""; // Clear OTP after successful password reset
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setEmail, setOtp, setStep, clearError } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
