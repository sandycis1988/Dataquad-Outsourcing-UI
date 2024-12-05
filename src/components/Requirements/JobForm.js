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
    jobType: "", // Set default value
    location: "",
    jobMode: "", // Set default value
    experienceRequired: "",
    noticePeriod: "", // Set default value
    relevantExperience: "",
    qualification: "",
  };

  const [formData, setFormData] = useState( {
    jobId: "",
    jobTitle: "",
    clientName: "",
    jobDescription: "",
    jobType: "", // Set default value
    location: "",
    jobMode: "", // Set default value
    experienceRequired: "",
    noticePeriod: "", // Set default value
    relevantExperience: "",
    qualification: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    fetch("http://192.168.0.148:9998/requirements/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset:UTF-8",
        "Access-Control-Allow-Origin":"*"
      },
      mode:'no-cors',
      body: JSON.stringify(formData), // Convert the formData object to JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        console.log("Form submitted successfully:", data);
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error("Error submitting the form:", error);
        
      });
  };
  

  const handleClear = () => {
    setFormData(initialFormData);
  };

  const commonBorderStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "transparent",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
      borderWidth: "2px",
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
          { name: "jobId", label: "Job ID" },
          { name: "jobTitle", label: "Job Title" },
          { name: "clientName", label: "Client Name" },
          { name: "location", label: "Location" },
        ].map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <TextField
              fullWidth
              variant="outlined"
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              sx={commonBorderStyles}
            />
          </Grid>
        ))}

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
          <TextField
            fullWidth
            variant="outlined"
            label="Qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            sx={commonBorderStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            label="Experience Required"
            name="experienceRequired"
            value={formData.experienceRequired}
            onChange={handleChange}
            sx={commonBorderStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            label="Relevant Experience"
            name="relevantExperience"
            value={formData.relevantExperience}
            onChange={handleChange}
            sx={commonBorderStyles}
          />
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
              <MenuItem value="1 month">1 month</MenuItem>
              <MenuItem value="2 months">2 months</MenuItem>
              <MenuItem value="3 months">3 months</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Job Description"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            multiline
            rows={4}
            sx={commonBorderStyles}
          />
        </Grid>
      </Grid>

      {/* Submit and Clear Buttons */}
      <Grid container sx={{ marginTop: 3, justifyContent: "flex-end", alignItems: "end" }}>
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
