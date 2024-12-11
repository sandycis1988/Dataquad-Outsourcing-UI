import React, { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Typography, // Added Typography component for displaying title
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  sendOtpAsync,
  resetPasswordAsync,
  setEmail,
  setOtp,
  setStep,
  clearError,
} from "../redux/features/forgotPasswordSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ goBack }) => {
  const { email, enteredOtp, step, loading, error } = useSelector(
    (state) => state.forgotPassword
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updatePassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Function to get the title based on the current step
  const getTitle = () => {
    switch (step) {
      case 1:
        return "Forgot Password"; // Step 1 title
      case 2:
        return "Verify OTP"; // Step 2 title
      case 3:
        return "Update Password"; // Step 3 title
      default:
        return "Forgot Password";
    }
  };

  // Submit Email (Step 1)
  const handleEmailSubmit = () => {
    if (!email) {
      setValidationError("Please enter your email");
      return;
    }
    setValidationError("");
    dispatch(sendOtpAsync(email));
  };

  // Verify OTP (Step 2)
  const handleOtpVerify = () => {
    if (!enteredOtp) {
      setValidationError("Please enter OTP");
      return;
    }
    setValidationError("");
    dispatch(setStep(3)); // Move to password reset step
  };

  // Submit New Password (Step 3)
  const handleNewPasswordSubmit = () => {
    if (!updatePassword || !confirmPassword) {
      setValidationError("Please fill in both password fields");
      return;
    }
    if (updatePassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    setValidationError("");

    // Check if the email is correctly set before making the API call
    if (!email) {
      setValidationError("Email is missing");
      return;
    }

    // Dispatch the reset password action
    dispatch(resetPasswordAsync({ email, updatePassword, confirmPassword }))
      .then((result) => {
        if (!result.error) {
          // Clear OTP and reset to Step 1 after successful password reset
          dispatch(setOtp(""));
          dispatch(setStep(1));
          navigate("/"); // Navigate to login or home page
        }
      })
      .catch((err) => {
        console.log("Error resetting password:", err);
      });
  };

  // Clear validation error after successful actions
  const handleClearError = () => {
    setValidationError("");
    dispatch(clearError());
  };

  return (
    <>
      {/* Display Error Messages */}
      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading && (
        <CircularProgress sx={{ display: "block", margin: "10px auto" }} />
      )}

      {/* Step Title */}
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 3 }}>
        {getTitle()}
      </Typography>

      {/* Step 1: Email */}
      {step === 1 && (
        <>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            sx={{ mb: 3 }}
            onFocus={handleClearError}
          />
          <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
            <Grid item xs={12} sm={5} md={4}>
              <Button
                variant="outlined"
                fullWidth
                onClick={goBack}
                sx={{
                  fontSize: "16px",
                  height: "45px",
                  textTransform: "none",
                  borderColor: "#5272F2",
                  color: "#5272F2",
                  "&:hover": {
                    borderColor: "#4a6cdb",
                    backgroundColor: "#f2f2f2",
                  },
                }}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={12} sm={5} md={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleEmailSubmit}
                disabled={loading}
                sx={{
                  backgroundColor: "#5272F2",
                  "&:hover": { backgroundColor: "#4a6cdb" },
                  fontSize: "16px",
                  height: "45px",
                  textTransform: "none",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Send OTP"
                )}
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      {/* Step 2: OTP */}
      {step === 2 && (
        <>
          <TextField
            label="Enter OTP"
            type="text"
            fullWidth
            margin="normal"
            value={enteredOtp}
            onChange={(e) => dispatch(setOtp(e.target.value))}
            sx={{ mb: 3 }}
            onFocus={handleClearError}
          />
          <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
            <Grid item xs={12} sm={5} md={4}>
              <Button
                variant="outlined"
                fullWidth
                onClick={goBack}
                sx={{
                  fontSize: "16px",
                  height: "45px",
                  textTransform: "none",
                  borderColor: "#5272F2",
                  color: "#5272F2",
                  "&:hover": {
                    borderColor: "#4a6cdb",
                    backgroundColor: "#f2f2f2",
                  },
                }}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={12} sm={5} md={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleOtpVerify}
                disabled={loading}
                sx={{
                  backgroundColor: "#5272F2",
                  "&:hover": { backgroundColor: "#4a6cdb" },
                  fontSize: "16px",
                  height: "45px",
                  textTransform: "none",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      {/* Step 3: New Password */}
      {step === 3 && (
        <>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={updatePassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
            <Grid item xs={12} sm={5} md={4}>
              <Button
                variant="outlined"
                fullWidth
                onClick={goBack}
                sx={{
                  fontSize: "16px",
                  height: "45px",
                  textTransform: "none",
                  borderColor: "#5272F2",
                  color: "#5272F2",
                  "&:hover": {
                    borderColor: "#4a6cdb",
                    backgroundColor: "#f2f2f2",
                  },
                }}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={12} sm={5} md={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleNewPasswordSubmit}
                disabled={loading}
                sx={{
                  backgroundColor: "#5272F2",
                  "&:hover": { backgroundColor: "#4a6cdb" },
                  fontSize: "16px",
                  height: "45px",
                  textTransform: "none",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
