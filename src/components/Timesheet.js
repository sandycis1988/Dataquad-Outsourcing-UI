import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";

const Timesheet = () => {
  const [entries, setEntries] = useState([
    { date: "2024-01-28", day: "Sunday", hoursWorked: 9 },
    { date: "2024-01-27", day: "Saturday", hoursWorked: 12 },
  ]);

  const [form, setForm] = useState({
    date: "",
    day: "",
    hoursWorked: "",
  });

  const [error, setError] = useState(""); // Error message state

  // Get the day name for a given date
  const getDayName = (dateString) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      // Automatically calculate the day when the date is selected
      const dayName = getDayName(value);
      setForm((prev) => ({ ...prev, date: value, day: dayName }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error if user edits inputs
    setError("");
  };

  // Add a single day's entry to the timesheet and send to the API
  const handleAddEntry = async () => {
    if (!form.date || !form.day || !form.hoursWorked) {
      setError("Please fill all fields.");
      return;
    }

    // Check if the date already exists
    const isDuplicateDate = entries.some((entry) => entry.date === form.date);

    if (isDuplicateDate) {
      setError("This date has already been added. Please select another date.");
      return;
    }

    // Add the single entry to the state
    const newEntry = { ...form, hoursWorked: Number(form.hoursWorked) };
    setEntries([...entries, newEntry]);

    // Send the single entry to the backend API via PUT request
    try {
      const userId = "DQIND009"; // Replace with dynamic userId if needed
      const response = await axios.put(
        `http://192.168.29.186:8082/api/timesheets/entries?userId=${userId}&date=${form.date}`,
        { date: form.date, day: form.day, hoursWorked: form.hoursWorked }
      );

      // Handle successful response
      console.log("Timesheet entry updated:", response.data);
      setForm({ date: "", day: "", hoursWorked: "" }); // Reset the form
      setError(""); // Clear error
    } catch (err) {
      console.error("Error updating timesheet:", err);
      setError("Failed to update timesheet. Please try again.");
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Add leading 0
    const dd = String(today.getDate()).padStart(2, "0"); // Add leading 0
    return `${yyyy}-${mm}-${dd}`;
  };

  // Calculate total hours worked
  const calculateTotalHours = () => {
    return entries.reduce((total, entry) => total + entry.hoursWorked, 0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Timesheet
      </Typography>

      {/* Form Section */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: getTodayDate(), // Restrict to today or future dates
          }}
        />
        <TextField
          label="Day"
          name="day"
          value={form.day}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Hours Worked"
          name="hoursWorked"
          type="number"
          value={form.hoursWorked}
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={handleAddEntry}>
          Add Entry
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Timesheet Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Hours Worked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.day}</TableCell>
                <TableCell>{entry.hoursWorked}</TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No entries yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Total Hours Worked */}
      {entries.length > 0 && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Hours Worked: {calculateTotalHours()}
        </Typography>
      )}
    </Box>
  );
};

export default Timesheet;
