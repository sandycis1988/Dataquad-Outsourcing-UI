import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  Input,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // FormHelperText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  submitFormData,
  resetForm,
} from "../redux/features/candidateSubmissionSlice";

const CandidateSubmissionForm = ({ jobId, userId, userEmail }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.candidateSubmission.formData);
  const successMessage = useSelector(
    (state) => state.candidateSubmission.successMessage
  );
  const errorMessage = useSelector(
    (state) => state.candidateSubmission.errorMessage
  );
  const loading = useSelector((state) => state.candidateSubmission.loading);
  const candidateId = useSelector(
    (state) => state.candidateSubmission.candidateId
  );
  const employeeId = useSelector(
    (state) => state.candidateSubmission.employeeId
  );
  const submittedJobId = useSelector(
    (state) => state.candidateSubmission.jobId
  );

  const [formError, setFormError] = useState({
    contactNumber: "",
    currentCTC: "",
    expectedCTC: "",
    totalExperience: "",
    relevantExperience: "",
    noticePeriod: "",
    communicationSkills: "",
    requiredTechnologiesRating: "",
    resumeFile: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormError((prev) => ({
        ...prev,
        resumeFile: "Please select a file.",
      }));
      dispatch(updateFormData({ resumeFile: null, resumeFilePath: "" }));
      return;
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setFormError((prev) => ({
        ...prev,
        resumeFile: "Invalid file type. Only PDF and DOCX are allowed.",
      }));
      dispatch(updateFormData({ resumeFile: null, resumeFilePath: "" }));
      return;
    }

    setFormError((prev) => ({ ...prev, resumeFile: "" }));
    dispatch(updateFormData({ resumeFile: file, resumeFilePath: file.name }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError((prev) => ({ ...prev, [name]: validateField(name, value) }));
    // if (name === "skills") {
    //   dispatch(
    //     updateFormData({
    //       [name]: value.split(",").map((skill) => skill.trim()),
    //     })
    //   );
    // } else {
    dispatch(updateFormData({ [name]: value }));
    //}
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "contactNumber":
        if (value && !/^\d{10}$/.test(value))
          error = "Contact number must be exactly 10 digits.";
        break;
      case "currentCTC":
      case "expectedCTC":
        if (value && value < 0) error = "CTC cannot be negative.";
        break;
      case "totalExperience":
      case "relevantExperience":
        if (value && (value < 0 || value > 50))
          error = "Experience must be between 0 and 50 years.";
        break;
      case "requiredTechnologiesRating":
        if (value && (value < 1 || value > 5))
          error = "Rating must be between 1 and 5.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formError).some((error) => error !== "")) {
      setAlert({
        open: true,
        message: "Please fix the errors before submitting the form.",
        severity: "error",
      });
      return;
    }
    dispatch(submitFormData({ formData, userId, jobId, userEmail }));
  };

  useEffect(() => {
    dispatch(updateFormData({ userId, jobId, userEmail }));
  }, [userId, jobId, userEmail, dispatch]);

  useEffect(() => {
    if (successMessage) {
      setAlert({
        open: true,
        message: `${successMessage} Candidate ID: ${candidateId}, Employee ID: ${employeeId}, Job ID: ${submittedJobId}`,
        severity: "success",
      });

      setTimeout(() => {
        dispatch(resetForm());
      }, 5000);
    }

    if (errorMessage) {
      setAlert({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  }, [
    successMessage,
    errorMessage,
    candidateId,
    employeeId,
    submittedJobId,
    dispatch,
  ]);

  const renderTextField = (name, label, options = {}) => (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={formData[name] || ""}
      onChange={handleChange}
      error={!!formError[name]}
      helperText={formError[name]}
      variant="outlined"
      margin="normal"
      {...options}
    />
  );

  const RenderedSelectDropdown = ({
    name,
    label,
    value,
    onChange,
    options,
    error,
  }) => {
    return (
      <FormControl fullWidth margin="normal" error={!!error}>
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          id={name}
          value={value || ""}
          onChange={onChange}
          label={label}
        >
          {options.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 1200, margin: "auto", marginTop: 4 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("fullName", "Full Name", { required: true })}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("candidateEmailId", "Candidate Email ID", {
              required: true,
            })}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("contactNumber", "Contact Number", {
              required: true,
            })}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("currentOrganization", "Current Organization")}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("qualification", "Qualification")}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("totalExperience", "Total Experience (in years)", {
              type: "number",
            })}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField(
              "relevantExperience",
              "Relevant Experience (in years)",
              { type: "number" }
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("currentCTC", "Current CTC", { type: "number" })}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("expectedCTC", "Expected CTC", { type: "number" })}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <RenderedSelectDropdown
              name="noticePeriod"
              label="Notice Period (in days)"
              value={formData.noticePeriod} // Assuming formData holds your form state
              onChange={handleChange} // Your function to handle state change
              options={[
                { value: "Immediate", label: "Immediate" },
                { value: "15 days", label: "15 days" },
                { value: "30 days", label: "30 days" },
                { value: "45 days", label: "45 days" },
                { value: "60 days", label: "60 days" },
              ]}
              error={formError.noticePeriod} // Assuming formError holds your error messages
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("currentLocation", "Current Location")}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("preferredLocation", "Preferred Location")}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("skills", "Skills (comma-separated)")}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField(
              "communicationSkills",
              "Communication Skills (rating out of 5)",
              { type: "number" }
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField(
              "requiredTechnologiesRating",
              "Required Technologies Rating (1 to 5)",
              { type: "number" }
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            {renderTextField("overallFeedback", "Overall Feedback", {
              multiline: true,
              rows: 2,
            })}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Input
              type="file"
              onChange={handleFileChange}
              inputProps={{ accept: ".pdf, .docx" }}
            />
            {formError.resumeFile && (
              <FormHelperText error>{formError.resumeFile}</FormHelperText>
            )}
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CandidateSubmissionForm;
