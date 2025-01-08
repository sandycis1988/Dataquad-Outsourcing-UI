import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField } from "@mui/material";

const MuiDateTimePicker = ({ label, value, onChange, required, variant }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={onChange}
        variant={variant} 
        renderInput={(params) => (
          <TextField
            {...params}                                                                                                                       
            required={required}
            fullWidth
            InputLabelProps={{
              shrink: true, // Ensure the label displays correctly
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default MuiDateTimePicker;
