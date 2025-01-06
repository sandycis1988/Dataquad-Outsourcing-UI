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
import axios from "axios";
import BASE_URL from "../../redux/apiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = ({ title, jobTitle, jobId }) => (
  <Box>
    <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
      {title}
    </Typography>
    {jobTitle && (
      <Typography sx={{ color: "#fff" }}>Job Title: {jobTitle}</Typography>
    )}
    {jobId && <Typography sx={{ color: "#fff" }}>Job ID: {jobId}</Typography>}
  </Box>
);

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const successToastStyle = {
  background: "#4CAF50",
  color: "#fff",
  borderRadius: "8px",
  padding: "16px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const errorToastStyle = {
  background: "#f44336",
  color: "#fff",
  borderRadius: "8px",
  padding: "16px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const JobForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { formData, status, error, jobPostingSuccessResponse } = useSelector(
    (state) => state.jobForm
  );
  const [employeesList, setEmployeesList] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [fetchError, setFetchError] = useState(null);
  const [filterEmployees, setFilterEmployees] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateField({ name, value }));
  };

  const filteredEmployees = useMemo(() => {
    return employeesList.filter((employee) => employee.roles === "EMPLOYEE");
  }, [employeesList]);

  useEffect(() => {
    setFilterEmployees(filteredEmployees);
  }, [filteredEmployees]);

  useEffect(() => {
    if (status === "succeeded" && jobPostingSuccessResponse) {
      toast.success(
        <ToastMessage
          title="Job Created Successfully!"
          jobTitle={jobPostingSuccessResponse.jobTitle}
          jobId={jobPostingSuccessResponse.jobId}
        />,
        { ...toastConfig, style: successToastStyle }
      );
    }

    if (status === "failed" && error) {
      toast.error(<ToastMessage title={error || "An error occurred"} />, {
        ...toastConfig,
        style: errorToastStyle,
      });
    }
  }, [status, jobPostingSuccessResponse, error]);

  const handleSubmit = async () => {
    try {
      const response = await dispatch(postJobRequirement(formData));
      if (!response.payload?.successMessage) {
        toast.error(<ToastMessage title="Failed to create job posting" />, {
          ...toastConfig,
          style: errorToastStyle,
        });
      }
    } catch (error) {
      toast.error(<ToastMessage title="Unexpected error occurred" />, {
        ...toastConfig,
        style: errorToastStyle,
      });
    }
  };

  const handleClear = () => {
    dispatch(resetForm());
    toast.info(<ToastMessage title="Form cleared successfully" />, {
      ...toastConfig,
      style: { ...successToastStyle, background: "#2196f3" },
    });
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setFetchStatus("loading");
      try {
        const response = await axios.get(`${BASE_URL}/users/employee`);
        setEmployeesList(response.data);
        setFetchStatus("succeeded");
      } catch (error) {
        setFetchStatus("failed");
        setFetchError(error.message);
        toast.error(
          <ToastMessage
            title={`Failed to fetch employees: ${error.message}`}
          />,
          { ...toastConfig, style: errorToastStyle }
        );
      }
    };

    if (fetchStatus === "idle") {
      fetchEmployees();
    }
  }, [fetchStatus]);

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

  const isFormValid = () => {
    return Object.values(formData).every((value) => value !== "");
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

      <Grid container spacing={3}>
        {/* Text fields */}
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

        {/* Dropdown fields */}
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
            options: [
              "Immediate",
              "15 days",
              "30 days",
              "45 days",
              "60 days",
              "75 days",
              "90 days",
            ],
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
                variant="filled"
                sx={{
                  ...commonBorderStyles,
                  "&:hover": { borderColor: theme.palette.primary.main },
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

        {/* Recruiter Select */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "black" }}>Select Recruiter</InputLabel>
            <Select
              name="recruiterIds"
              value={
                Array.isArray(formData.recruiterIds)
                  ? formData.recruiterIds
                  : []
              }
              onChange={handleChange}
              label="Recruiter IDs"
              variant="filled"
              sx={{
                ...commonBorderStyles,
                "&:hover": { borderColor: theme.palette.primary.main },
                "& .MuiSelect-icon": { color: theme.palette.primary.main }, // Customize the dropdown arrow color
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200, // Fix dropdown height
                    overflowY: "auto", // Enable vertical scrolling
                    backgroundColor: "#f7f7f7", // Background for dropdown
                    borderRadius: 1, // Rounded corners for the dropdown
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow
                    "& .MuiMenuItem-root": {
                      padding: "10px 16px", // Adjust padding for each option
                      fontSize: "0.9rem", // Adjust font size
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover, // Highlight on hover
                      },
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.light, // Highlight for selected option
                        color: theme.palette.primary.contrastText, // Text color for selected option
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main, // Darker shade when hovering over selected
                        },
                      },
                    },
                  },
                },
              }}
            >
              {fetchStatus === "loading" ? (
                <MenuItem disabled>Loading employees...</MenuItem>
              ) : filterEmployees.length > 0 ? (
                filterEmployees.map((employee) => (
                  <MenuItem
                    key={employee.employeeId}
                    value={employee.employeeId}
                  >
                    {employee.employeeName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No employees available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Job Description Field */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="filled"
            label="Job Description"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            sx={commonBorderStyles}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      {/* Action buttons */}
      <Box
        sx={{
          marginTop: "3vh",
          display: "flex",
          justifyContent: "flex-end",
          gap: 3,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClear}
          disabled={status === "loading"}
          sx={{ width: "15%" }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={status === "loading" || !isFormValid()}
          sx={{ width: "15%" }}
        >
          {status === "loading" ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default JobForm;
