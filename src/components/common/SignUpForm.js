
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SignIn from "./SignIn";
import SignUpFromLeftSide from "./SignUpFromLeftSide";
import { useSelector, useDispatch } from "react-redux";
import {
  submitFormData,
  updateFormData,
  clearFormData,
} from "../../redux/features/formSlice";
import { useNavigate } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';

const SignUpForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { status, error, response } = useSelector((state) => state.form || {});
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
    personalemail: "",
    phoneNumber: "",
    designation: "",
    gender: "",
    joiningDate: "",
    dob: "",

    roles: ["EMPLOYEE"],
  });

  const [touchedFields, setTouchedFields] = useState({});
  const [formError, setFormError] = useState({});

  // Validation regex
  // const userIdRegex = /^DQIND\d{2,4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@dataqinc\.com$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Custom validation functions
  const validateUserId = (userId) => {
    const userIdRegex = /^DQIND\d{2,4}$/; // Ensures the ID starts with "DQIND" followed by 2 to 4 digits
    return userIdRegex.test(userId)
      ? ""
      : "User ID must start with 'DQIND' followed by 2 to 4 digits";
  };

  const validateUserName = (userName) =>
    userName.length <= 20 ? "" : "User Name must not exceed 20 characters";

  const validateEmail = (email) =>
    emailRegex.test(email)
      ? ""
      : "Please enter a valid email (example@dataqinc.com)";

  const validatePhoneNumber = (phoneNumber) =>
    phoneRegex.test(phoneNumber) ? "" : "Phone number must be 10 digits";

  const validateGender = (gender) => (gender ? "" : "Please select a gender");

  const validateDOB = (dob) => {
    if (!dob) return "Date of birth is required"; // Check if DOB is empty
  
    let today = new Date();
    let birthDate = new Date(dob);
  
    if (birthDate > today) return "Date of birth cannot be in the future";
  
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  
    return "";
  };

  const validateJoiningDate = (joiningDate, dob) => {
    if (!joiningDate) return "Joining date is required";
    const birthDate = new Date(dob);
    const joinDate = new Date(joiningDate);
    if (joinDate <= birthDate) {
      return "Joining date must be after date of birth";
    }
    return "";
  };

  const validatePassword = (password) =>
    passwordRegex.test(password)
      ? ""
      : "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character";

  const validateConfirmPassword = (confirmPassword) =>
    confirmPassword === formData.password ? "" : "Passwords do not match";

  const validateField = (name, value) => {
    switch (name) {
      case "userId":
        return validateUserId(value);
      case "userName":
        return validateUserName(value);
      case "email":
        return validateEmail(value);
      case "phoneNumber":
        return validatePhoneNumber(value);
      case "gender":
        return validateGender(value);
      case "dob":
        return validateDOB(value);
      case "joinigDate":
        return validateJoiningDate(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(value);
      case "joiningDate":
        return value ? "" : "Joining Date is required";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (status === "failed" && error) {
      const apiErrors = {};
      if (error.message === "userId already exists") {
        apiErrors.userId = "User ID already exists";
      }
      setFormError(apiErrors); // Set the error state from API response
    }
  }, [status, error]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    setFormError((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For other fields, simply update the state as usual
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Dispatch the updated value
    dispatch(updateFormData({ name, value }));
  };

  // const handleRoleChange = (selectedRole) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     roles: [selectedRole],
  //   }));
  //   dispatch(updateFormData({ name: "roles", value: [selectedRole] }));
  // };

  // Handle form submission

  const handleJoiningDateChange = (event) => {
    const joiningDate = event.target.value;
    const dob = formData.dob; // Get the date of birth from the form data
    const error = validateJoiningDate(joiningDate, dob);

    setFormError((prev) => ({
      ...prev,
      joiningDate: error, // Update the error state for the joining date field
    }));

    // Update the formData as well
    setFormData((prevData) => ({
      ...prevData,
      joiningDate: joiningDate,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {
      userId: validateUserId(formData.userId),
      userName: validateUserName(formData.userName),
      email: validateEmail(formData.email),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      gender: validateGender(formData.gender),
      dob: validateDOB(formData.dob),
      joiningDate: validateJoiningDate(formData.joiningDate, formData.dob),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    if (Object.values(errors).some((error) => error !== "")) {
      setFormError(errors);
      return;
    }

    try {
      dispatch(submitFormData(formData));
      dispatch(clearFormData());
    } catch (error) {
      console.error("Submission failed: ", error);
    }
  };

  // Clear the form

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // timer for the registration success message
  useEffect(() => {
    if (status === "succeeded"||  status === "failed" && response) {
      setShowAlert(true);

      setFormData({
        userId: "",
        userName: "",
        password: "",
        confirmPassword: "",
        email: "",
        personalemail: "",
        phoneNumber: "",
        designation: "",
        gender: "",
        joiningDate: "",
        dob: "",
        roles: ['EMPLOYEE'],
      });

      const timer = setTimeout(() => {
        setShowAlert(false);
        dispatch(clearFormData())
        setIsSignIn(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [status, response,navigate]);

  const isFormValid = Object.values(formError).every((error) => error === "");

  const handleClear = () => {
    dispatch(clearFormData());
    setFormData({
      userId: "",
      userName: "",
      password: "",
      confirmPassword: "",
      email: "",
      personalemail: "",
      phoneNumber: "",
      designation: "",
      gender: "",
      joiningDate: "",
      dob: "",
      roles: ['EMPLOYEE'],
    });

    setFormError({});
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      {/* Left Half (Animation Component) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: "relative",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <SignUpFromLeftSide />
      </Grid>

      {/* Right Half (Form) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",

          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: { xs: 320, sm: 400, md: 500 },
            p: { xs: 2, sm: 3 },
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
            height: "auto",
          }}
        >
          {isSignIn ? (
            <SignIn />
          ) : (
            <>
              {(showAlert && status === "succeeded" || status === "failed") && response && (
                <Alert severity={status === "succeeded" ? "success" : "error"}>
                  {status === "succeeded" ? (
                    <>
                      Registration Successful! User ID: {response?.data?.userId}
                      , Email: {response?.data?.email}
                    </>
                  ) : (
                    <>
                      Registration Failed:{" "}
                      {response?.error?.errormessage || "Unknown error occurred"}
                    </>
                  )}
                </Alert>
              )}
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                  
                }}
              >
                Sign up
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* User ID Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="User ID"
                      name="userId"
                      type="text"
                      value={formData.userId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.userId}
                      helperText={formError.userId}
                    />
                  </Grid>

                  {/* User Name Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="User Name"
                      name="userName"
                      type="text"
                      value={formData.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.userName}
                      helperText={formError.userName}
                    />
                  </Grid>

                  {/* Email Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.email}
                      helperText={formError.email}
                    />
                  </Grid>

                  {/* Personal Email Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Personal Email"
                      name="personalemail"
                      type="email"
                      value={formData.personalemail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.personalemail}
                      helperText={formError.personalemail}
                    />
                  </Grid>

                  {/* Phone Number Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      type="number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.phoneNumber}
                      helperText={formError.phoneNumber}
                    />
                  </Grid>

                  {/* Designation Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Designation"
                      name="designation"
                      type="text"
                      value={formData.designation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.designation}
                      helperText={formError.designation}
                    />
                  </Grid>

                  {/* Gender Field */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Gender"
                        name="gender"
                        error={!!formError.gender}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block" }}
                      >
                        {formError.gender}
                      </Typography>
                    </FormControl>
                  </Grid>

                  {/* Date of Birth Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.dob}
                      helperText={formError.dob}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  {/* Joining Date Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Joining Date"
                      name="joiningDate"
                      type="date"
                      value={formData.joiningDate}
                      onChange={handleJoiningDateChange}
                      onBlur={handleBlur} // Optional: You can also validate on blur
                      error={!!formError.joiningDate} // Show error if any
                      helperText={formError.joiningDate} // Display error message
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  {/* Password Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.password}
                      helperText={formError.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Confirm Password Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.confirmPassword}
                      helperText={formError.confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowConfirmPassword}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Submit and Clear Buttons */}
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid}
                  >
                    Register
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </Box>
              </form>
            </>
          )}
        </Box>

        {/* Toggle Login/Register */}
        <Box sx={{ position: "absolute", top: "8px", right: "8px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsSignIn(!isSignIn)}
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: { xs: "0.8rem", md: "1rem" },
              fontWeight: "200",
              padding: { xs: "4px 8px", md: "6px 12px" },
            }}
          >
            {isSignIn ? (
              <>
                <PersonAddIcon fontSize="small" sx={{ marginRight: "2px", padding: "2px" }}  /> Register
              </>
            ) : (
              <>
                <LoginIcon fontSize="small" sx={{ marginRight: "2px", padding: "2px" }} /> LogIn
              </>
            )}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUpForm;
