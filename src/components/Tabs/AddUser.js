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

import { useSelector, useDispatch } from "react-redux";
import {
  submitFormData,
  updateFormData,
  clearFormData,
} from "../../redux/features/formSlice";
import { useNavigate } from "react-router-dom";


const AddUser = () => {
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

    const today = new Date();
    const birthDate = new Date(dob);

    if (birthDate > today) return "Date of birth cannot be in the future";

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

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

    dispatch(submitFormData(formData));
    dispatch(clearFormData());
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prevData) => ({
      ...prevData,
      roles: [selectedRole],
    }));
    dispatch(updateFormData({ name: "roles", value: [selectedRole] }));
  };

  // Clear the form

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // timer for the registration success message
  useEffect(() => {
    if (status === "succeeded" && response) {
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
        roles: [],
      });

      const timer = setTimeout(() => {
        setShowAlert(false);
        dispatch(clearFormData())
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [status, response]);

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
      roles: [],
    });
    
    setFormError({});
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      {/* Left Half (Animation Component) */}
      

      
      <Grid
        item
        xs={12}
        md={12}
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
            maxWidth: { xs: 320, sm: 400, md: 1200 },
            p: { xs: 2, sm: 3 },
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
            height: "auto",
          }}
        >
          
            <>
              {showAlert && status === "succeeded" && response && (
                <Alert severity="success">
                  Registration Successful! User ID: {response.data?.userId},
                  Email:{response.data?.email}
                </Alert>
              )}
               <Typography
                      variant="h5"
                      align="start"
                      color="primary"
                      gutterBottom
                      sx={{
                        backgroundColor: "rgba(232, 245, 233)",
                        padding: 1,
                        borderRadius: 1,
                      }}
                    >
                     Add User
                    </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* User ID Field */}
                  <Grid item xs={12} sm={4}>
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
                      variant="filled"
                    />
                  </Grid>

                  {/* User Name Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="User Name"
                      name="userName"
                      type="text"
                       variant="filled"
                      value={formData.userName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.userName}
                      helperText={formError.userName}
                    />
                  </Grid>

                  {/* Email Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                       variant="filled"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.email}
                      helperText={formError.email}
                    />
                  </Grid>

                  {/* Personal Email Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Personal Email"
                      name="personalemail"
                      type="email"
                       variant="filled"
                      value={formData.personalemail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.personalemail}
                      helperText={formError.personalemail}
                    />
                  </Grid>

                  {/* Phone Number Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      type="number"
                       variant="filled"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.phoneNumber}
                      helperText={formError.phoneNumber}
                    />
                  </Grid>

                  {/* Designation Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Designation"
                      name="designation"
                      type="text"
                       variant="filled"
                      value={formData.designation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!formError.designation}
                      helperText={formError.designation}
                    />
                  </Grid>

                  {/* Gender Field */}
                  <Grid item xs={12}md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Gender"
                        name="gender"
                         variant="filled"
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
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Date of Birth"
                      name="dob"
                      type="date"
                       variant="filled"
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
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Joining Date"
                      name="joiningDate"
                      type="date"
                       variant="filled"
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
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Password"
                      name="password"
                       variant="filled"
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
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                       variant="filled"
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

                  <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Select Role"
                       variant="filled"
                      value={formData.roles[0] || ""}
                      onChange={(e) => handleRoleChange(e.target.value)}
                    >
                      <MenuItem value="ADMIN">Admin</MenuItem>
                      <MenuItem value="EMPLOYEE">Employee</MenuItem>
                    </Select>
                  </FormControl>
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
                    ADD USER
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleClear}
                  >
                    Clear FORM
                  </Button>
                </Box>
              </form>
            </>
         
        </Box>


      </Grid>
    </Grid>
  );
};

export default AddUser;
