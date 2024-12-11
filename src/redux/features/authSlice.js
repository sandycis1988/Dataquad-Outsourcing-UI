import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../apiConfig";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  roles: [], // Store roles as an array
  logInTimeStamp: null,
  logoutTimestamp: null,
  status: "idle", // For tracking async request status (idle, loading, succeeded, failed)
  error: null, // To store error messages if any
};

// Async thunk for logging in
export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`, // Update with your actual login endpoint
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract necessary data from the API response
      const { userId, roleType, loginTimestamp } = response.data.payload;

      // Return transformed data for Redux state
      return {
        isAuthenticated: true,
        user: userId,
        roles: [roleType], // Assuming roleType is a string, we place it in an array
        logInTimeStamp: loginTimestamp,
      };
    } catch (error) {
      // Handle errors from the API
      if (error.response) {
        if (error.response.status === 403) {
          return rejectWithValue("Your account is not authorized to log in.");
        } else if (error.response.status === 400) {
          return rejectWithValue("Invalid credentials or bad request.");
        } else {
          return rejectWithValue(
            error.response.data?.message || "An unexpected error occurred."
          );
        }
      } else if (error.request) {
        return rejectWithValue("Network error. Please try again later.");
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

// Async thunk for logging out
export const logoutAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (userId, { rejectWithValue }) => {
    try {
      // Log the user out via API
      const response = await axios.put(
        `${BASE_URL}/users/logout/${userId}`, // Update with your logout endpoint

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return { userId };
    } catch (error) {
      // Handle errors during logout
      if (error.response) {
        return rejectWithValue("Failed to log out. Please try again.");
      } else if (error.request) {
        return rejectWithValue("Network error. Please try again later.");
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Reset authentication-related data upon logout
      state.isAuthenticated = false;
      state.user = null;
      state.roles = []; // Reset roles to empty array instead of null
      state.logInTimeStamp = null;
      state.logoutTimestamp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login request pending state
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear any previous errors
      })
      // Handle successful login (fulfilled state)
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.roles = action.payload.roles; // Save transformed roles
        state.logInTimeStamp = action.payload.logInTimeStamp;
      })
      // Handle login failure (rejected state)
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Set the error message from the rejected action
        state.isAuthenticated = false;
      })
      // Handle logout request pending state
      .addCase(logoutAsync.pending, (state) => {
        state.status = "loading";
      })
      // Handle successful logout (fulfilled state)
      .addCase(logoutAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Reset authentication-related data directly here
        state.isAuthenticated = false;
        state.user = null;
        state.roles = [];
        state.logInTimeStamp = null;
        state.logoutTimestamp = action.payload.logoutTimestamp; // Set logout timestamp after successful logout
      })
      // Handle logout failure (rejected state)
      .addCase(logoutAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Set the error message from the rejected action
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
