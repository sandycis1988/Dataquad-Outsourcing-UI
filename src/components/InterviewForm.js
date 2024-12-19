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
} from "@mui/material";
import MuiDateTimePicker from "../components/MuiComponents/MuiDatePicker"; // Import the new DateTimeField component
import dayjs from "dayjs";

const InterviewForm = ({
  jobId,
  candidateId,
  candidateFullName,
  candidateContactNo,
  clientName,
  userId,
  handleCloseInterviewDialog,
}) => {
  const dispatch = useDispatch();

  const { formData, isSubmitting, submissionSuccess, error } = useSelector(
    (state) => state.interviewForm
  );

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
  }, [
    jobId,
    candidateId,
    candidateFullName,
    candidateContactNo,
    clientName,
    userId,
    dispatch,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ name, value }));
  };

  const handleDateTimeChange = (fieldName, newValue) => {
    const now = dayjs(); // Current date and time

    if (fieldName === "interviewDateTime") {
      if (newValue && dayjs(newValue).isBefore(now)) {
        setDateError("Interview Date & Time cannot be in the past.");
        return;
      } else {
        setDateError("");
      }

      // Automatically set interviewScheduledTimestamp to current time when interviewDateTime is set
      if (newValue) {
        dispatch(
          updateFormField({
            name: "interviewScheduledTimestamp",
            value: now.toISOString(),
          })
        );
      }
    }

    // Update the target field
    dispatch(
      updateFormField({
        name: fieldName,
        value: newValue ? newValue.toISOString() : null,
      })
    );
  };

  const validateForm = () => {
    // Check if required fields are empty
    if (
      !formData.interviewDateTime ||
      !formData.duration ||
      !formData.zoomLink
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

    // Add the timestamp field at submission
    const currentTimestamp = new Date().toISOString();
    dispatch(
      updateFormField({
        name: "interviewScheduledTimestamp",
        value: currentTimestamp,
      })
    );

    dispatch(submitInterviewForm(formData));
  };

  useEffect(() => {
    if (submissionSuccess) {
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
      <Typography variant="h5" gutterBottom>
        Schedule Interview
      </Typography>
      {submissionSuccess && (
        <Alert severity="success">Form submitted successfully!</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {formError && <Alert severity="error">{formError}</Alert>}

      <Grid container spacing={2}>
        {/* Separate field for each input */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Job ID"
            name="jobId"
            type="text"
            value={formData.jobId || ""}
            onChange={handleChange}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Candidate ID"
            name="candidateId"
            type="text"
            value={formData.candidateId || ""}
            onChange={handleChange}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Candidate Full Name"
            name="candidateFullName"
            type="text"
            value={formData.candidateFullName || ""}
            onChange={handleChange}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Candidate Contact No"
            name="candidateContactNo"
            type="tel"
            value={formData.candidateContactNo || ""}
            onChange={handleChange}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Client Name"
            name="clientName"
            type="text"
            value={formData.clientName || ""}
            onChange={handleChange}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="User ID"
            name="userId"
            type="text"
            value={formData.userId || ""}
            onChange={handleChange}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Duration (Minutes)"
            name="duration"
            type="number"
            value={formData.duration || ""}
            onChange={handleChange}
            fullWidth
            
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Zoom Link"
            name="zoomLink"
            type="url"
            value={formData.zoomLink || ""}
            onChange={handleChange}
            fullWidth
            
          />
        </Grid>

        {/* Interview Date & Time */}
        <Grid item xs={12} sm={6} md={4}>
          <MuiDateTimePicker
            label="Interview Date & Time"
            value={
              formData.interviewDateTime
                ? dayjs(formData.interviewDateTime)
                : null
            }
            onChange={(newValue) =>
              handleDateTimeChange("interviewDateTime", newValue)
            }
            required
          />
          {dateError && <Typography color="error">{dateError}</Typography>}
        </Grid>

        {/* Scheduled Timestamp */}
        <Grid item xs={12} sm={6} md={4}>
          <MuiDateTimePicker
            label="Scheduled Timestamp"
            value={
              formData.interviewScheduledTimestamp
                ? dayjs(formData.interviewScheduledTimestamp)
                : null
            }
            onChange={(newValue) =>
              handleDateTimeChange("interviewScheduledTimestamp", newValue)
            }
            disabled={!formData.interviewDateTime} // Disable until interviewDateTime is set
            required
          />
        </Grid>
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
