import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  updateField,
  resetForm,
  postJobRequirement,
  postJobRequirementSuccess,
} from "../../redux/features/jobFormSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useTheme,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const JobForm = () => {
  const theme = useTheme();
  const [employeesData, setEmployeesData] = useState([]);
  const dispatch = useDispatch();
  const { formData, status, error, jobPostings } = useSelector(
    (state) => state.jobForm
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateField({ name, value }));
  };

  const handleSubmit = () => {
    dispatch(postJobRequirement(formData))
      .then((response) => {
        // Dispatch success message along with job details
        dispatch(
          postJobRequirementSuccess({
            jobId: formData.jobId,
            jobTitle: formData.jobTitle,
            successMessage: "Requirement Added Successfully",
          })
        );
      })
      .catch((error) => {
        // Handle error
      });
  };

  useEffect(() => {
    const fetchEmployeesData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.162:8080/users/employee` // Replace userId as necessary
        );
        setEmployeesData(response.data);
      } catch (err) {
        console.log("Failed to load job requirements");
      }
    };

    fetchEmployeesData();
  }, []);

  const handleClear = () => {
    dispatch(resetForm());
  };

  const commonBorderStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "transparent",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
      borderWidth: "0.3px",
      backgroundColor: "transparent",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2,
        backgroundColor: "#FBFBFB",
        margin: { xs: 2, sm: 3, md: "auto" },
        border: 1,
        boxShadow: 2,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        paddingBottom={2}
        sx={{
          color: theme.palette.primary.main,
          fontWeight: "600",
          textAlign: "start",
        }}
      >
        Job Post
      </Typography>

      {status === "succeeded" && jobPostings && (
        <Box alignItems={"center"}>
          <Box
            sx={{
              maxWidth: "500px",
              padding: 2,
              marginBottom: 2,
              backgroundColor: "#d4edda", // Light green background (for success alert)
              border: "1px solid #c3e6cb", // Light green border
              borderRadius: 2,
              color: "#155724", // Dark green text (for better contrast)
              boxShadow: 1,
              display: "flex", // Use flexbox for alignment
              alignItems: "center", // Vertically align items
              justifyContent: "space-between", // Space between the text and icon
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                flex: 1,
                color: "green",
                fontFamily: "monospace",
              }}
            >
              {jobPostings.jobId} - {jobPostings.jobTitle} -{" "}
              {jobPostings.successMessage}
            </Typography>
            <CheckCircleIcon fontSize="small" sx={{ color: "green" }} />
          </Box>
        </Box>
      )}

      {/* Grid layout for form fields */}
      <Grid container spacing={3}>
        {[
          { name: "jobId", label: "Job ID", type: "text" },
          { name: "jobTitle", label: "Job Title", type: "text" },
          { name: "clientName", label: "Client Name", type: "text" },
          { name: "location", label: "Location", type: "text" },
          {
            name: "experienceRequired",
            label: "Experience Required",
            type: "number",
          },
          {
            name: "relevantExperience",
            label: "Relevant Experience",
            type: "number",
          },
          { name: "qualification", label: "Qualification", type: "text" },
          { name: "remark", label: "Remark", type: "text" },
        ].map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <TextField
              fullWidth
              variant="outlined"
              type={field.type}
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              sx={commonBorderStyles}
            />
          </Grid>
        ))}

        {/* Dropdown Fields */}
        {[
          {
            name: "jobType",
            label: "Job Type",
            options: ["Full-time", "Part-time", "Contract"],
          },
          {
            name: "jobMode",
            label: "Job Mode",
            options: ["Remote", "On-site", "Hybrid"],
          },
          {
            name: "noticePeriod",
            label: "Notice Period",
            options: ["15", "30", "45", "60", "75", "90"],
          },
        ].map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: "black" }}>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                label={field.label}
                sx={{
                  ...commonBorderStyles,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                {field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}

        {/* DateTime Field */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            label="Requirement Added Timestamp"
            name="requirementAddedTimeStamp"
            type="datetime-local"
            value={formData.requirementAddedTimeStamp}
            onChange={handleChange}
            sx={commonBorderStyles}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} key="jobDescription">
          <TextField
            fullWidth
            variant="outlined"
            type="text"
            label="Job Description"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            multiline
            rows={4} // Adjust the number of rows based on your preference
            sx={commonBorderStyles}
          />
        </Grid>

        {/* Multi-select Field */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "black" }}>Recruiter IDs</InputLabel>
            <Select
              name="recruiterIds"
              value={formData.recruiterIds}
              onChange={handleChange}
              label="Recruiter IDs"
              sx={{
                ...commonBorderStyles,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {employeesData.map((employee) => (
                <MenuItem key={employee.employeeId} value={employee.employeeId}>
                  {employee.employeeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Status Field */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "black" }}>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
              sx={{
                ...commonBorderStyles,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Submit and Clear Buttons */}
      <Grid
        container
        sx={{ marginTop: 3, justifyContent: "flex-end", alignItems: "end" }}
      >
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              backgroundColor: theme.palette.primary.main,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <CircularProgress size={24} />
            ) : (
              "POST REQUIREMENT"
            )}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="outlined"
            onClick={handleClear}
            fullWidth
            sx={{
              fontWeight: "bold",
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            CLEAR
          </Button>
        </Grid>
      </Grid>
      {status === "failed" && (
        <Typography color="error" variant="body2" textAlign={"center"} mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default JobForm;
