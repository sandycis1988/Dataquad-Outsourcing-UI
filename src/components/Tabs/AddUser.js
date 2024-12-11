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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useSelector, useDispatch } from "react-redux";
import {
  submitFormData,
  updateFormData,
  clearFormData,
} from "../../redux/features/formSlice";

const AddUser = () => {
  const { status, error, response } = useSelector((state) => state.form || {});
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    joinigDate: "",
    dob: "",
    roles: ["EMPLOYEE"], // Default role
  });

  const [touchedFields, setTouchedFields] = useState({});
  const [formError, setFormError] = useState({});

  // Validation regex
  const userIdRegex = /^DQIND\d{2,4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@dataqinc\.com$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Custom validation functions
  const validateUserId = (userId) =>
    userIdRegex.test(userId)
      ? ""
      : "User ID must start with 'DQIND' followed by digits";

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
    if (!dob) return "Date of birth is required";
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 ? "" : "User must be at least 18 years old";
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
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(value);
      case "joinigDate":
        return value ? "" : "Joining Date is required";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (status === "failed" && error) {
      // If API response error exists, map those errors to formError state
      const apiErrors = error.errors || {}; // Assuming error contains a field `errors` with the API validation errors
      setFormError(apiErrors);
    }
  }, [status, error]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    setFormError((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    dispatch(updateFormData({ name, value }));
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prevData) => ({
      ...prevData,
      roles: [selectedRole],
    }));
    dispatch(updateFormData({ name: "roles", value: [selectedRole] }));
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

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

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
      joinigDate: "",
      dob: "",
      roles: [],
    });

    setFormError({});
  };

  return (
    <Grid
      container
      spacing={2}
      
      
    >
      <Grid
        item  
        xs={12}
        md={12}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: { xs: 320, sm: 400, md: 1200 },
            p: { xs: 2, sm: 3 },
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "auto",
          }}
        >
          {status === "succeeded" && response ? (
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="h5" color="primary">
                Registration Successful
              </Typography>
              <Typography variant="body1" color="textSecondary">
                User {response.data.userId} has been successfully registered.
              </Typography>
              <Typography variant="body1" color="textSecondary">
                User {response.data.email} has been successfully registered.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                  marginBottom: 4,
                  fontFamily: "monospace",
                  textAlign: "left",
                }}
              >
                Employee Sign-Up
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {[
                    { label: "User ID", name: "userId", type: "text" },
                    { label: "User Name", name: "userName", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    {
                      label: "Personal Email",
                      name: "personalemail",
                      type: "email",
                    },
                    { label: "Phone Number", name: "phoneNumber", type: "tel" },
                    { label: "Designation", name: "designation", type: "text" },
                  ].map((field, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <TextField
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={!!formError[field.name]}
                        helperText={formError[field.name]}
                      />
                    </Grid>
                  ))}

                  {/* Gender Select */}
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        label="Select Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="">Select Gender</MenuItem>
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

                  {/* Date of Birth */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!formError.dob}
                      helperText={formError.dob}
                    />
                  </Grid>

                  {/* Joining Date */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Joining Date"
                      name="joinigDate"
                      type="date"
                      value={formData.joinigDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!formError.joinigDate}
                      helperText={formError.joinigDate}
                    />
                  </Grid>

                  {/* Password and Confirm Password */}
                  <Grid item xs={12} sm={4}>
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
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
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

                  <Grid item xs={12} sm={4}>
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
                              edge="end"
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

                  {/* Role Selection */}
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        label="Select Role"
                        value={formData.roles[0] || ""}
                        onChange={(e) => handleRoleChange(e.target.value)}
                      >
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="EMPLOYEE">Employee</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Buttons */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Button variant="contained" color="primary" type="submit">
                        Register
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleClear}
                      >
                        Clear
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AddUser;
