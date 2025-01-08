import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import BASE_URL from "../redux/apiConfig"; // Import your base URL for API requests
import dayjs from "dayjs";
import { toast } from "react-toastify"; // Import toast for notifications
import { useSelector } from "react-redux";

const LeaveApplication = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    days: "",
    leaveType: "",
    userId: "",
    managerEmail: "",
    description: "", // New field added here
  });
  const { user } = useSelector((state) => state.auth);

  console.log('userId from the leave application ',user)

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [employeesList, setEmployeesList] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    // Update userId if user changes
    setFormData((prevData) => ({
      ...prevData,
      userId: user||'',
    }));
  }, [user]);

 

  useEffect(() => {
    const fetchEmployees = async () => {
      setFetchStatus("loading");
      try {
        const response = await axios.get(`${BASE_URL}/users/employee`);
        setEmployeesList(response.data);
        console.log('manager data log ---------',response.data);
        
        setFetchStatus("succeeded");
      } catch (error) {
        setFetchStatus("failed");
        setFetchError(error.message);
        toast.error("Error fetching employee data.");
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employeesList.filter(
    (employee) => employee.roles === "SUPERADMIN"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (updatedData.startDate && updatedData.endDate) {
        const start = dayjs(updatedData.startDate);
        const end = dayjs(updatedData.endDate);

        if (end.isBefore(start)) {
          updatedData.days = "";
        } else {
          const daysDifference = end.diff(start, "day") + 1;
          updatedData.days = daysDifference > 0 ? daysDifference : "";
        }
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.leaveType ||
      !formData.managerEmail ||
      !formData.description // Ensure this field is validated
    ) {
      setFormError("Please fill out all required fields.");
      return;
    }
    setFormError("");

    const leaveApplicationData = {
      ...formData,
      noOfDays: formData.days,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/users/save`,
        leaveApplicationData
      );
      if (response.status === 201) {
        const successData = response.data; // Assuming the API returns a success message in the response data

        // Update success message with API response
        setSuccessMessage(
          `Leave application submitted successfully from ${dayjs(formData.startDate).format(
            "DD MMM YYYY"
          )} to ${dayjs(formData.endDate).format("DD MMM YYYY")} (${formData.days} days).`
        );
        setFormData({
          startDate: "",
          endDate: "",
          days: "",
          leaveType: "",
          userId:"",
          managerEmail: "",
          description: "", // Reset the description field
        });
        toast.success(successData.message );
      } 
    } catch (error) {
      setFormError(error.message || "An error occurred.");
      toast.error("An error occurred while submitting your leave.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" color="primary" gutterBottom>
        Apply Leave
      </Typography>
      {formError && <Alert severity="error">{formError}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {fetchStatus === "failed" && fetchError && (
        <Alert severity="error">Error fetching employees: {fetchError}</Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Employee ID"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            fullWidth
            variant="filled"
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Reporting Manager"
            name="managerEmail"
            value={formData.managerEmail}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            select
          >
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((manager) => (
                
                <MenuItem key={manager.employeeId} value={manager.email}>
                  {manager.employeeName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No managers available</MenuItem>
            )}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Number of Days"
            name="days"
            value={formData.days}
            fullWidth
            variant="filled"
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Type of Leave"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            select
          >
            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
            <MenuItem value="Paid Leave">Paid Leave</MenuItem>
            <MenuItem value="Casual Leave">Casual Leave</MenuItem>
            <MenuItem value="Annual">Annual</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Leave Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setFormData({})}
        >
          Clear
        </Button>

        <Button type="submit" variant="contained" color="primary">
          Apply Leave
        </Button>
      </Box>
    </Box>
  );
};

export default LeaveApplication;
