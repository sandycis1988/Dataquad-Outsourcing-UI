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
import { toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  submitFormData,
  updateFormData,
  clearFormData,
} from "../../redux/features/formSlice";
import "react-toastify/dist/ReactToastify.css";

const RegistrationForm = () => {
  const [showAlert, setShowAlert] = useState(false);
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
    joiningDate: "",
    dob: "",
    roles: ["EMPLOYEE"],
  });

  const [touchedFields, setTouchedFields] = useState({});
  const [formError, setFormError] = useState({});

  // Validation regex
  const personalEmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@dataqinc\.com$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validation functions
  const validateUserId = (userId) => {
    const userIdRegex = /^DQIND\d{2,4}$/;
    return userIdRegex.test(userId) ? "" : "User ID must start with 'DQIND' followed by 2 to 4 digits";
  };

  const validateUserName = (userName) =>
    userName.length <= 20 ? "" : "User Name must not exceed 20 characters";

  const validateEmail = (email) =>
    emailRegex.test(email) ? "" : "Please enter a valid email (example@dataqinc.com)";

  const validatePhoneNumber = (phoneNumber) => {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
    return cleanedPhoneNumber.length === 10 ? "" : "Phone number must be exactly 10 digits.";
  };

  const validatePersonalEmail = (personalemail) =>
    personalEmailRegex.test(personalemail) ? "" : "Please enter a valid personal email like example@gmail.com";

  const validateGender = (gender) => (gender ? "" : "Please select a gender");

  const validateDOB = (dob) => {
    if (!dob) return "Date of birth is required";
    let today = new Date();
    let birthDate = new Date(dob);
    if (birthDate > today) return "Date of birth cannot be in the future";
    return "";
  };

  const validateJoiningDate = (joiningDate, dob) => {
    if (!joiningDate) return "Joining date is required";
    const birthDate = new Date(dob);
    const joinDate = new Date(joiningDate);
    const currentDate = new Date();

    if (joinDate <= birthDate) {
      return "Joining date must be after date of birth";
    }

    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(currentDate.getMonth() - 1);
    const oneMonthAfter = new Date();
    oneMonthAfter.setMonth(currentDate.getMonth() + 1);

    if (joinDate < oneMonthBefore || joinDate > oneMonthAfter) {
      return "Joining date must be within one month before or after today's date";
    }
    return "";
  };

  const validatePassword = (password) =>
    passwordRegex.test(password) ? "" : "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character";

  const validateConfirmPassword = (confirmPassword) =>
    confirmPassword === formData.password ? "" : "Passwords do not match";

  const validateField = (name, value) => {
    switch (name) {
      case "userId": return validateUserId(value);
      case "userName": return validateUserName(value);
      case "email": return validateEmail(value);
      case "personalemail": return validatePersonalEmail(value);
      case "phoneNumber": return validatePhoneNumber(value);
      case "gender": return validateGender(value);
      case "dob": return validateDOB(value);
      case "joiningDate": return validateJoiningDate(value, formData.dob);
      case "password": return validatePassword(value);
      case "confirmPassword": return validateConfirmPassword(value);
      default: return "";
    }
  };

  useEffect(() => {
    if (status === "failed" && error) {
      const apiErrors = {};
      if (error.message === "userId already exists") {
        apiErrors.userId = "User ID already exists";
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {
      userId: validateUserId(formData.userId),
      userName: validateUserName(formData.userName),
      email: validateEmail(formData.email),
      personalemail: validatePersonalEmail(formData.personalemail),
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
  };

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
      roles: ["EMPLOYEE"],
    });
    setFormError({});
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const isFormValid = Object.values(formError).every((error) => error === "");

  return (
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
      {showAlert && response && (
        <Alert severity={status === "succeeded" ? "success" : "error"} sx={{ mb: 2 }}>
          {status === "succeeded" ? (
            <>
              Registration Successful! <br />
              <strong>User ID:</strong> {response?.data?.userId}, <strong>Email:</strong> {response?.data?.email}
            </>
          ) : (
            <>
              Registration Failed: {response?.error?.errormessage || "An unknown error occurred."}
              <br />
              <strong>Error Code:</strong> {response?.error?.errorcode}
            </>
          )}
        </Alert>
      )}

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="left"
        sx={{
          color: theme.palette.text.primary,
          fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
          backgroundColor: "rgba(232, 245, 233)",
          padding: "0.5rem",
          borderRadius: 2,
        }}
      >
        Registration
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              label="Employee ID"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!formError.userId}
              helperText={formError.userId}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              label="Employee Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!formError.userName}
              helperText={formError.userName}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              label="Company Email"
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

          <Grid item xs={12} sm={6} md={4} lg={3}>
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

          <Grid item xs={12} sm={6} md={4} lg={3}>
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

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!formError.designation}
              helperText={formError.designation}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
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
              {formError.gender && (
                <Typography variant="caption" color="error">
                  {formError.gender}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              error={!!formError.joiningDate}
              helperText={formError.joiningDate}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: {
                  min: new Date(new Date().setMonth(new Date().getMonth() - 1))
                    .toISOString()
                    .split("T")[0],
                  max: new Date(new Date().setMonth(new Date().getMonth() + 1))
                    .toISOString()
                    .split("T")[0],
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                    <IconButton onClick={handleClickShowConfirmPassword}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          
          <Button
            type="button"
            variant="outlined"
            onClick={handleClear}
            color="primary"
            sx={{width:'15%'}}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid}
            sx={{width:'15%'}}
          >
            Register
          </Button>
        </Box>
      </form>
      <ToastContainer />
    </Box>
  );
};

export default RegistrationForm;