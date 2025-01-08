import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormField,
  resetForm,
  submitInterviewForm,
  clearError,
} from "../redux/features/interviewSheduleSlice";
import {
  Button,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
// import MuiDateTimePicker from "../components/MuiComponents/MuiDatePicker"; // Import the new DateTimeField component
import dayjs from "dayjs";

const InterviewForm = ({
  jobId,
  candidateId,
  candidateFullName,
  candidateContactNo,
  clientName,
  userId,
  candidateEmailId,
  userEmail,
  handleCloseInterviewDialog,
}) => {
  const dispatch = useDispatch();

  const { formData, isSubmitting, submissionSuccess, error ,interviewResponse} = useSelector(
    (state) => state.interviewForm
  );

  console.log('interview response ',interviewResponse)

  const [dateError, setDateError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Prepopulate form fields with the provided values
    dispatch(updateFormField({ name: "jobId", value: jobId }));
    dispatch(updateFormField({ name: "candidateId", value: candidateId }));
    dispatch(
      updateFormField({ name: "candidateFullName", value: candidateFullName })
    );
    dispatch(
      updateFormField({ name: "candidateContactNo", value: candidateContactNo })
    );
    dispatch(updateFormField({ name: "clientName", value: clientName }));
    dispatch(updateFormField({ name: "userId", value: userId }));
    dispatch(
      updateFormField({ name: "candidateEmailId", value: candidateEmailId })
    );
    dispatch(updateFormField({ name: "userEmail", value: userEmail }));
  }, [
    jobId,
    candidateId,
    candidateFullName,
    candidateContactNo,
    clientName,
    userId,
    userEmail,
    candidateEmailId,
    dispatch,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ name, value }));
  };

  const handleDateTimeChange = (fieldName, newValue) => {
    const now = dayjs(); // Current date and time

    if (newValue && !dayjs(newValue).isValid()) {
      setDateError("Invalid date/time selected.");
      return;
    }

    if (fieldName === "interviewDateTime") {
      if (newValue && dayjs(newValue).isBefore(now, "day")) {
        setDateError("Interview Date can't be in the past.");
        return;
      } else {
        setDateError(""); // Clear any previous error
      }

      // Save the exact date as interviewDateTime
      dispatch(updateFormField({ name: "interviewDateTime", value: newValue }));

      // Save the timestamp (Unix) as interviewScheduledTimestamp
      const timestamp = newValue ? dayjs(newValue).valueOf() : null; // Convert to Unix timestamp
      dispatch(
        updateFormField({
          name: "interviewScheduledTimestamp",
          value: timestamp,
        })
      );
    } else {
      // Update other fields if needed
      dispatch(
        updateFormField({
          name: fieldName,
          value: newValue,
        })
      );
    }
  };

  const validateForm = () => {
    // Check if required fields are empty
    if (
      !formData.interviewDateTime ||
      !formData.duration ||
      !formData.zoomLink ||
      !formData.interviewLevel
    ) {
      setFormError("All required fields must be filled.");
      return false;
    }
    if (dateError) {
      setFormError(dateError);
      return false;
    }
    setFormError(""); // Clear any previous errors
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    // Send the form data with interviewDateTime exactly as it is selected
    const formDataToSubmit = {
      ...formData,
    };

    dispatch(submitInterviewForm(formDataToSubmit));
  };

  useEffect(() => {
    if (submissionSuccess) {
      // Show success alert
      dispatch(resetForm());
    }
  }, [submissionSuccess, dispatch]);

  const handleDialogClose = () => {
    // Clear error when the dialog is closed
    dispatch(clearError());
    handleCloseInterviewDialog();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {submissionSuccess && (
        <Alert severity="success">Form submitted successfully!</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {formError && <Alert severity="error">{formError}</Alert>}

      <Grid container spacing={2}>
        {/* Separate field for each input */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Job ID"
            name="jobId"
            type="text"
            value={formData.jobId || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Candidate ID"
            name="candidateId"
            type="text"
            value={formData.candidateId || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Candidate Full Name"
            name="candidateFullName"
            type="text"
            value={formData.candidateFullName || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Candidate Contact No"
            name="candidateContactNo"
            type="number"
            value={formData.candidateContactNo || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Candidate Email"
            name="candidateEmailId"
            type="email"
            value={formData.candidateEmailId || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Client Name"
            name="clientName"
            type="text"
            value={formData.clientName || ""}
            onChange={handleChange}
            fullWidth
            autoComplete="off"
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Client Email"
            name="clientEmail"
            type="text"
            value={formData.clientEmail || ""}
            onChange={handleChange}
            fullWidth
            variant="filled"
          />
        </Grid>
        {/* Interview Date & Time */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          {/* <MuiDateTimePicker
            label="Interview Date & Time"
            variant="filled"
            value={formData.interviewDateTime || null}
            onChange={(newValue) =>
              handleDateTimeChange("interviewDateTime", newValue)
            }
            required
            TextFieldProps={{
              size: "small", // Makes the input smaller
            }}
          /> */}

          <TextField
            label="Interview Date & Time"
            name="interviewDateTime"
            type="datetime-local"
            fullWidth
            variant="filled"
            value={formData.interviewDateTime || ""}
            onChange={(e) =>
              handleDateTimeChange("interviewDateTime", e.target.value)
            }
            required
            InputLabelProps={{
              shrink: true, // Keeps the label above the input field
            }}
            InputProps={{
              size: "large", // Makes the input smaller
            }}
          />
          {dateError && <Typography color="error">{dateError}</Typography>}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Duration (Minutes)"
            name="duration"
            type="number"
            value={formData.duration || ""}
            onChange={handleChange}
            fullWidth
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Zoom Link"
            name="zoomLink"
            type="text"
            value={formData.zoomLink || ""}
            onChange={handleChange}
            fullWidth
            variant="filled"
          />
        </Grid>

        {/* Interview Level Radio Buttons */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Interview Level</FormLabel>
            <RadioGroup
              row
              name="interviewLevel"
              value={formData.interviewLevel || ""}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Internal"
                control={<Radio />}
                label="Internal"
              />
              <FormControlLabel
                value="External"
                control={<Radio />}
                label="External"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Conditional TextField for External Interview */}
        {formData.interviewLevel === "External" && (
          <Grid item xs={12}>
            <TextField
              label="External Interview Details"
              name="externalInterviewDetails"
              value={formData.externalInterviewDetails || ""}
              onChange={handleChange}
              fullWidth
              variant="filled"
            />
          </Grid>
        )}
      </Grid>

      <Box
        mt={2}
        textAlign="end"
        justifyContent="flex-end"
        display="flex"
        gap={2}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
        </Button>
        <Button variant="outlined" color="primary" onClick={handleDialogClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default InterviewForm;
