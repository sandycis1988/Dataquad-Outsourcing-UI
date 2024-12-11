import React, { useState } from "react";
import axios from "axios";
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
} from "@mui/material";

const JobForm = () => {
  const theme = useTheme(); // Access the theme

  const initialFormData = {
    jobId: "",
    jobTitle: "",
    clientName: "",
    jobDescription: "",
    jobType: "",
    location: "",
    jobMode: "",
    experienceRequired: "",
    noticePeriod: "",
    relevantExperience: "",
    qualification: "",
    requirementAddedTimeStamp: "",
    recruiterIds: [], // Initialize as an empty array
    status: "Open", // Default value for status
    remark: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "recruiterIds") {
      setFormData((prev) => ({
        ...prev,
        [name]: typeof value === "string" ? value.split(",") : value, // Ensure recruiterIds is an array
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    axios
      .post("http://192.168.0.181:9998/requirements/add", formData, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*", // Make sure your server allows CORS
        },
      })
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
        setFormData(initialFormData); // Reset form after submission
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error submitting the form:", error);
      });
  };

  const handleClear = () => {
    setFormData(initialFormData); // Reset form fields
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

        {/* Job Type */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "black" }}>Job Type</InputLabel>
            <Select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              label="Job Type"
              sx={{
                ...commonBorderStyles,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Job Mode */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "black" }}>Job Mode</InputLabel>
            <Select
              name="jobMode"
              value={formData.jobMode}
              onChange={handleChange}
              label="Job Mode"
              sx={{
                ...commonBorderStyles,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="On-site">On-site</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "black" }}>Notice Period</InputLabel>
            <Select
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleChange}
              label="Notice Period"
              sx={{
                ...commonBorderStyles,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="15">15 days</MenuItem>
              <MenuItem value="30">30 days</MenuItem>
              <MenuItem value="45">45 days</MenuItem>
              <MenuItem value="60">60 days</MenuItem>
              <MenuItem value="75">75 days</MenuItem>
              <MenuItem value="90">90 days</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* New Fields */}
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

        {/* Recruiter Ids */}

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Job-Description"
            name="remark"
            value={formData.jobDescription}
            onChange={handleChange}
            multiline
            rows={3}
            sx={commonBorderStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "black" }}>Recruiter IDs</InputLabel>
            <Select
              multiple
              name="recruiterIds"
              value={formData.recruiterIds}
              onChange={handleChange}
              label="Recruiter IDs"
              renderValue={(selected) => selected.join(", ")}
              sx={{
                ...commonBorderStyles,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="DQIND01">DQIND01</MenuItem>
              <MenuItem value="DQIND02">DQIND02</MenuItem>
              <MenuItem value="DQIND03">DQIND03</MenuItem>
              <MenuItem value="DQIND04">DQIND04</MenuItem>
              <MenuItem value="DQIND05">DQIND05</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Status */}
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
          >
            POST REQUIREMENT
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
    </Box>
  );
};

export default JobForm;
