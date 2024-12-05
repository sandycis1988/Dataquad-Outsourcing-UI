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
import SignIn from "./SignIn";
import SignUpFromLeftSide from "./SignUpFromLeftSide";
import { useSelector, useDispatch } from "react-redux";
import {
  submitFormData,
  updateFormData,
  clearFormData,
} from "../../redux/features/formSlice";
import RegistrationSuccess from "./RegistrationSuccess";

const SignUpForm = () => {
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
    joinigDate: "",
    dob: "",

    roles: ['EMPLOYEE'],
  });

  const [formError, setFormError] = useState({});

  const emailRegex = /^[a-zA-Z0-9._%+-]+@dataqinc\.com$/;
  const phoneRegex = /^[0-9]{10}$/; // Assuming phone number is 10 digits

  // Custom validation functions
  const validateEmail = (email) => {
    return emailRegex.test(email)
      ? ""
      : "Please enter a valid email (example@dataqinc.com)";
  };

  const validatePhoneNumber = (phoneNumber) => {
    return phoneRegex.test(phoneNumber) ? "" : "Phone number must be 10 digits";
  };

  const validatePassword = (password) => {
    return password.length >= 6 ? "" : "Password must be at least 6 characters";
  };

  const validateConfirmPassword = (confirmPassword) => {
    return confirmPassword === formData.password
      ? ""
      : "Passwords do not match";
  };

  useEffect(() => {
    if (status === "failed" && error) {
      // If API response error exists, map those errors to formError state
      const apiErrors = error.errors || {}; // Assuming error contains a field `errors` with the API validation errors
      setFormError(apiErrors);
    }
  }, [status, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    dispatch(updateFormData({ name, value }));
  };

  // const handleRoleChange = (selectedRole) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     roles: [selectedRole],
  //   }));
  //   dispatch(updateFormData({ name: "roles", value: [selectedRole] }));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = {};
    errors.email = validateEmail(formData.email);
    errors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validateConfirmPassword(formData.confirmPassword);

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== "")) {
      setFormError(errors); // Set form validation errors
      return;
    }

    // Submit form data to Redux or API

    console.log("form data log ",formData);
    
    dispatch(submitFormData(formData));
    dispatch(clearFormData());
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  if (status === "succeeded" && response) {
    return (
      <RegistrationSuccess
        message={response.message}
        email={response.data.email}
        userId={response.data.userId}
      />
    );
  }

  const handleClear = ()=>{

    dispatch(clearFormData())
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
  }

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
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                Employee Sign-Up
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Form Fields */}
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
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(formError[field.name] || null)} // Show error if custom or API error exists
                        helperText={formError[field.name] || null}
                      />
                    </Grid>
                  ))}
                  {/* Roles */}
                  {/* <Grid item xs={12}  md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="role-select-label">Role</InputLabel>
                      <Select
                        labelId="role-select-label"
                        name="roles"
                        value={formData.roles}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        label="Role"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      >
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                        <MenuItem value="SUPERADMIN">SUPERADMIN</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                  {/* Geneder fields */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="gender-select-label">Gender</InputLabel>
                      <Select
                        labelId="gender-select-label"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                    {/* joining Date */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Joining Date"
                      name="joinigDate" // Corrected the typo from "joinigData" to "joiningData"
                      type="date"
                      value={formData.joinigDate}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{
                        shrink: true, // Ensures the label is always above the date field
                      }}
                      error={!!formError.joinigDate}
                      helperText={formError.joinigDate}
                    />
                  </Grid>

                  {/* Date of Birth */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{
                        shrink: true, // Ensures the label is always above the date field
                      }}
                      error={!!formError.dob}
                      helperText={formError.dob}
                    />
                  </Grid>
                  {/* Password Fields */}
                  {[
                    {
                      label: "Password",
                      name: "password",
                      value: formData.password,
                      show: showPassword,
                      toggleShow: handleClickShowPassword,
                    },
                    {
                      label: "Confirm Password",
                      name: "confirmPassword",
                      value: formData.confirmPassword,
                      show: showConfirmPassword,
                      toggleShow: handleClickShowConfirmPassword,
                    },
                  ].map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField
                        label={field.label}
                        name={field.name}
                        type={field.show ? "text" : "password"}
                        value={field.value}
                        onChange={handleChange}
                        error={Boolean(formError[field.name] || null)} // Show error if custom or API error exists
                        helperText={formError[field.name] || ""}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={field.toggleShow} edge="end">
                                {field.show ? (
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
                  ))}
                </Grid>
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <Button type="submit" variant="contained" color="primary">
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
            variant="outlined"
            color="primary"
            onClick={() => setIsSignIn(!isSignIn)}
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: { xs: "0.8rem", sm: "1rem" },
              padding: { xs: "4px 8px", sm: "6px 12px" },
            }}
          >
            <ArrowBackIosNewIcon
              sx={{ fontSize: { xs: "14px", sm: "16px" }, marginRight: "4px" }}
            />
            {isSignIn ? "Register" : "Login"}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUpForm;
