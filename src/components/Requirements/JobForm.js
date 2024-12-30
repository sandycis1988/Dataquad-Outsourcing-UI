import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postJobRequirement,
  updateField,
  resetForm,
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
import axios from 'axios'; // Import axios for API requests
import BASE_URL from "../../redux/apiConfig";


const JobForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { formData, status, error } = useSelector((state) => state.jobForm);
  const [employeesList, setEmployeesList] = useState([]); // Local state for employees
  const [fetchStatus, setFetchStatus] = useState("idle"); // Local fetch status
  const [fetchError, setFetchError] = useState(null); // Local fetch error
  const [filterEmployees, setFilterEmployees] = useState([]); // Filtered employee list

  // Handle form field change
  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateField({ name, value }));
  };

  const filteredEmployees = useMemo(() => {
    return employeesList.filter((employee) => employee.roles === "EMPLOYEE");
  }, [employeesList]);

  useEffect(() => {
    setFilterEmployees(filteredEmployees);
    console.log("Filtered employees:", filteredEmployees);
  }, [filteredEmployees]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await dispatch(postJobRequirement(formData));
      // Optionally reset the form after success
      dispatch(resetForm());
    } catch (error) {
      // Handle error if any
    }
  };

  // Handle form reset
  const handleClear = () => {
    dispatch(resetForm());
  };

  // Fetch employees data every time component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      setFetchStatus("loading"); // Set status to loading before fetching
      try {
        const response = await axios.get(`${BASE_URL}/users/employee`);
        console.log('Employee data:', response.data);
        setEmployeesList(response.data); // Set employee data in state
        setFetchStatus("succeeded"); // Set status to succeeded after fetch
      } catch (error) {
        setFetchStatus("failed"); // Set status to failed if there is an error
        setFetchError(error.message); // Capture the error message
      }
    };

    if (fetchStatus === "idle") {
      fetchEmployees(); // Fetch employee data only if the status is idle
    }
  }, [fetchStatus]); // Dependency array: trigger when fetchStatus changes

  // Styles for form controls
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
        boxShadow: 2,
      }}
    >
      <Typography
        variant="h5"
        align="start"
        marginBottom="5vh"
        color="primary"
        gutterBottom
        sx={{
          backgroundColor: "rgba(232, 245, 233)",
          padding: 1,
          borderRadius: 1,
        }}
      >
        Post Requirement
      </Typography>

      {/* Display success message */}
      {status === "succeeded" && (
        <Typography color="success" variant="body2" textAlign="center" mt={2}>
          Requirement added successfully!
        </Typography>
      )}

      {/* Display error message */}
      {status === "failed" && error && (
        <Typography color="error" variant="body2" textAlign="center" mt={2}>
          {error}
        </Typography>
      )}

      {/* Display employee fetch error message */}
      {fetchStatus === "failed" && fetchError && (
        <Typography color="error" variant="body2" textAlign="center" mt={2}>
          {fetchError}
        </Typography>
      )}

      {/* Grid layout for form fields */}
      <Grid container spacing={3}>
        {[ 
          { name: "jobId", label: "Job ID", type: "text" },
          { name: "jobTitle", label: "Job Title", type: "text" },
          { name: "clientName", label: "Client Name", type: "text" },
          { name: "location", label: "Location", type: "text" },
          { name: "experienceRequired", label: "Experience Required", type: "number" },
          { name: "relevantExperience", label: "Relevant Experience", type: "number" },
          { name: "qualification", label: "Qualification", type: "text" },
          { name: "remark", label: "Remark", type: "text" },
        ].map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <TextField
              fullWidth
              variant="filled"
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
          { name: "jobType", label: "Job Type", options: ["Full-time", "Part-time", "Contract"] },
          { name: "jobMode", label: "Job Mode", options: ["Remote", "On-site", "Hybrid"] },
          { name: "noticePeriod", label: "Notice Period", options: ["15", "30", "45", "60", "75", "90"] },
        ].map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: "black" }}>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                label={field.label}
                variant="filled"
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

        {/* Date Time Field */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="filled"
            label="Requirement Added Timestamp"
            name="requirementAddedTimeStamp"
            type="datetime-local"
            value={formData.requirementAddedTimeStamp}
            onChange={handleChange}
            sx={commonBorderStyles}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Job Description Field */}
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Job Description"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            multiline
            rows={3}
            sx={commonBorderStyles}
          />
        </Grid>

        {/* Recruiter Select */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "black" }}>Recruiter IDs</InputLabel>
            <Select
              name="recruiterIds"
              value={Array.isArray(formData.recruiterIds) ? formData.recruiterIds : []}
              onChange={handleChange}
              label="Recruiter IDs"
              variant="filled"
              sx={{
                ...commonBorderStyles,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {fetchStatus === "loading" ? (
                <MenuItem disabled>Loading employees...</MenuItem>
              ) : filterEmployees.length > 0 ? (
                filterEmployees.map((employee) => (
                  <MenuItem key={employee.employeeId} value={employee.employeeId}>
                    {employee.employeeName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No employees available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end" spacing={2}>
        {/* Clear Button */}
        <Grid item xs={6} sm={6} md={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClear}
            sx={{
              fontWeight: "bold",
            }}
          >
            Clear
          </Button>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={6} sm={6} md={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#3f51b5", // Customize hover color if needed
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
      </Grid>
    </Box>
  );
};

export default JobForm;
