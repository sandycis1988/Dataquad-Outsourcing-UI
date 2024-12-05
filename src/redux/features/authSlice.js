// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  roles: [],
  logInTimeStamp:null,
  status: "idle", // for tracking async request status (idle, loading, succeeded, failed)
  error: null, // to store error messages if any
};

// Async thunk for logging in
export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://192.168.0.165:9998/auth/login",
        { email, password }
      );

      // Extract roles (map to role names)
      const roles = response.data.payload.roles.map((role) => role.name);
      const logInTimeStamp = response.data.payload.loginTimestamp;
      
      // Return transformed payload
      return {
        user: response.data.payload.userId,
        roles,
        logInTimeStamp,
      };
    } catch (error) {
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


export const logoutAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (userId, { rejectWithValue }) => {
    try {
      const logoutTimestamp = new Date().toISOString(); // Capture the current logout timestamp
      await axios.post("http://192.168.0.149:9998/auth/logout", {
        userId,
        logoutTimestamp
      });

      return logoutTimestamp; // Return the logout timestamp for Redux state update
    } catch (error) {
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
      state.isAuthenticated = false;
      state.user = null;
      state.roles = []; // Reset to empty array instead of null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, (state) => {
      state.status = "loading";
      state.error = null; // Clear any previous errors
    });
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.roles = action.payload.roles; // Save transformed roles
        state.logInTimeStamp=action.payload.logInTimeStamp;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Set the error message from the rejected action
        state.isAuthenticated = false;
      })

      // logout api state updating
      .addCase(logoutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logoutTimestamp = action.payload; // Set logout timestamp after successful logout
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
