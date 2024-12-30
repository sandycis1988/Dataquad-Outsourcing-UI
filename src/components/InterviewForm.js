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
import MuiDateTimePicker from "../components/MuiComponents/MuiDatePicker"; // Import the new DateTimeField component
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

const InterviewForm = ({
  jobId,
  candidateId,
  candidateFullName,
  candidateContactNo,
  clientName,
  userId,
  emailId,
  handleCloseInterviewDialog,
}) => {
  const dispatch = useDispatch();

  const { formData, isSubmitting, submissionSuccess, error,interviewResponse } = useSelector(
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
    dispatch(updateFormField({ name: "emailId", value: emailId }));
  }, [
    jobId,
    candidateId,
    candidateFullName,
    candidateContactNo,
    clientName,
    userId,
    emailId,
    dispatch,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ name, value }));
  };

  const handleDateTimeChange = (fieldName, newValue) => {
    const now = dayjs(); // Current date and time

    if (fieldName === "interviewDateTime") {
      if (newValue && dayjs(newValue).isSameOrBefore(now, "day")) {
        setDateError("Interview Date & Time can't be in the past or today.");
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
      
      {submissionSuccess && (
        <>
          <Alert severity="success">Form submitted successfully!</Alert>
          {interviewResponse && (
            <Box mt={2}>
              <Typography variant="h6">Interview Scheduled:</Typography>
              <Typography><strong>Candidate ID:</strong> {interviewResponse.candidateId}</Typography>
              <Typography><strong>User Email:</strong> {interviewResponse.userEmail}</Typography>
              <Typography><strong>Email ID:</strong> {interviewResponse.emailId}</Typography>
              <Typography><strong>Client Email:</strong> {interviewResponse.clientEmail}</Typography>
            </Box>
          )}
        </>
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
            name="candidateEmail"
            type="email"
            value={formData.candidateEmail || ""}
            onChange={handleChange}
            fullWidth
            //disabled
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
            disabled
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
            // disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Employee ID"
            name="userId"
            type="text"
            value={formData.userId || ""}
            onChange={handleChange}
            fullWidth
            disabled
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <TextField
            label="Employee Email"
            name="userEmail"
            type="email"
            value={formData.userEmail || ""}
            onChange={handleChange}
            fullWidth
            variant="filled"
            // disabled
          />
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
            type="url"
            value={formData.zoomLink || ""}
            onChange={handleChange}
            fullWidth
            variant="filled"
          />
        </Grid>

        {/* Interview Date & Time */}
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <MuiDateTimePicker
            label="Interview Date & Time"
            variant="filled"
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
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <MuiDateTimePicker
            label="Scheduled Timestamp"
            variant="filled"
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
        <Grid item>
          <FormControl component="fieldset">
            <FormLabel component="legend">Interview Level</FormLabel>
            <RadioGroup
              row // This ensures the Radio buttons are on the same row
              name="interviewLevel"
              value={formData.interviewLevel || ""}
              onChange={handleChange}
            >
              <FormControlLabel
                value="L1"
                control={<Radio />}
                label="L1 (Internal)"
              />
              <FormControlLabel
                value="L2"
                control={<Radio />}
                label="L2 (External)"
              />
            </RadioGroup>
          </FormControl>
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
