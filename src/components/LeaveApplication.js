import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../redux/apiConfig";
import dayjs from "dayjs";

const LeaveApplication = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    days: "",
    leaveType: "",
    userId: "",
    managerId: "",
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { employeesList, fetchStatus, fetchError } = useSelector(
    (state) => state.employees || {}
  );
  const [filterEmployees, setFilterEmployees] = useState([]);
  const userId = user;

  useEffect(() => {
    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: userId,
      }));
    }
  }, [userId]);

  const filteredEmployees = useMemo(() => {
    return employeesList.filter((employee) => employee.roles === "SUPERADMIN");
  }, [employeesList]);

  useEffect(() => {
    setFilterEmployees(filteredEmployees);
    console.log("Filtered employees:", filteredEmployees);
  }, [filteredEmployees]);

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
      !formData.managerId
    ) {
      setFormError("Please fill out all required fields.");
      return;
    }
    setFormError("");

    const leaveApplicationData = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      noOfDays: formData.days,
      leaveType: formData.leaveType,
      userId: formData.userId,
      managerId: formData.managerId,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/users/save`,
        leaveApplicationData
      );
      if (response.status === 200) {
        setSuccessMessage(
          `Leave application submitted successfully from ${dayjs(
            formData.startDate
          ).format("DD MMM YYYY")} to ${dayjs(formData.endDate).format(
            "DD MMM YYYY"
          )} (${formData.days} days).`
        );
        setFormData({
          startDate: "",
          endDate: "",
          days: "",
          leaveType: "",
          userId: userId,
          managerId: "",
        });
      } else {
        setFormError("Failed to submit the leave application.");
      }
    } catch (error) {
      setFormError(error.message || "An error occurred.");
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
            label="Manager ID"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            fullWidth
            variant="filled"
            required
            select
          >
            {filterEmployees.length > 0 ? (
              filterEmployees.map((manager) => (
                <MenuItem key={manager.employeeId} value={manager.employeeId}>
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
