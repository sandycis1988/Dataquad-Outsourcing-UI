import React from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";            
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

const DateField = ({ label, name, value, onChange, required, fullWidth }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        name={name}
        value={value}
        onChange={(newValue) => onChange({ target: { name, value: newValue } })}
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            fullWidth={fullWidth}
            inputProps={{
              ...params.inputProps,
              type: "datetime-local", // Use datetime-local if you need time as well
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateField;
