import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
  Paper,
} from "@mui/material";
import InputField from "./MuiComponents/InputField";
import {
  updateFormData,
  submitFormData,
  resetForm,
} from "../redux/features/candidateSubmissionSlice";
import { useDispatch, useSelector } from "react-redux";
import SelectDropdown from "./MuiComponents/SelectDropdown";

const CandidateSubmissionForm = ({ jobId, userId }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.candidateSubmission.formData);
  const successMessage = useSelector((state) => state.candidateSubmission.successMessage);
  const candidateId = useSelector((state) => state.candidateSubmission.candidateId);
  const employeeId = useSelector((state) => state.candidateSubmission.employeeId);

  const errorMessage = useSelector(
    (state) => state.candidateSubmission.errorMessage
  );
  const loading = useSelector((state) => state.candidateSubmission.loading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills") {
      const skillsArray = value.split(",").map((skill) => skill.trim());
      dispatch(updateFormData({ [name]: skillsArray }));
    } else {
      dispatch(updateFormData({ [name]: value }));
    }
  };

  // const dropdownOptions = [
  //   { value: "15", label: "15-Days" },
  //   { value: "30", label: "30-Days" },
  //   { value: "45", label: "45-Days" },
  //   { value: "60", label: "60-Days" },
  //   { value: "75", label: "75-Days" },
  //   { value: "90", label: "90-Days" },
  // ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    const submissionPayload = {
      formData,
      userId,
      jobId,
    };
    dispatch(submitFormData(submissionPayload));
  };
  useEffect(() => {
    dispatch(updateFormData({ userId, jobId }));
  }, [userId, jobId, dispatch]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        dispatch(resetForm()); // Reset the form and clear the messages
      }, 5000); // Clear messages after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [successMessage, errorMessage, dispatch]);



  return (
    <Paper
      elevation={3}
      sx={{ padding: 4, maxWidth: 800, margin: "auto", marginTop: 4 }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Personal Details */}
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Job Id"
              name="jobId"
              value={formData.jobId}
              onChange={handleChange}
              required
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Employee Id"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Email ID"
              name="emailId"
              type="email"
              value={formData.emailId}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              type="number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Current Organization"
              name="currentOrganization"
              value={formData.currentOrganization}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
            />
          </Grid>

          {/* Experience and CTC */}
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Total Experience (years)"
              name="totalExperience"
              type="number"
              value={formData.totalExperience}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Relevant Experience"
              name="relevantExperience"
              value={formData.relevantExperience}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Current CTC"
              name="currentCTC"
              type="number"
              value={formData.currentCTC}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Expected CTC"
              name="expectedCTC"
              type="number"
              value={formData.expectedCTC}
              onChange={handleChange}
            />
          </Grid>

          {/* Location and Skills */}
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Notice Period"
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleChange}
            />
            {/* <SelectDropdown
              fullWidth
              label="Notice Period"
              name="noticePeriod"
              options={dropdownOptions}
              value={formData.noticePeriod}
              onChange={handleChange}
            /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Current Location"
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Preferred Location"
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Skills (comma separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
            />
          </Grid>

          {/* Feedback Section */}
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Communication Skills"
              name="communicationSkills"
              value={formData.communicationSkills}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Technologies Rating (1-5)"
              name="requiredTechnologiesRating"
              type="number"
              value={formData.requiredTechnologiesRating}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Overall Feedback"
              name="overallFeedback"
              multiline
              rows={1}
              value={formData.overallFeedback}
              onChange={handleChange}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4}>
            <InputField
              fullWidth
              label="Zoom Link"
              name="zoomLink"
              value={formData.zoomLink}
              onChange={handleChange}
            />
          </Grid> */}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={() => {
                  dispatch(resetForm());
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      {/* Display Success/Error Messages */}
      {successMessage && (
        <Typography color="green">{successMessage} - {candidateId}-{employeeId}-{jobId}</Typography>
      )}
      {errorMessage && <Typography color="red">{errorMessage}</Typography>}
    </Paper>
  );
};

export default CandidateSubmissionForm;
