import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SelectDropdown = ({
  label,
  options = [],
  value,
  onChange,
  width = '100%',
  disabled = false,
  placeholder = '',
}) => {
  return (
    <FormControl fullWidth sx={{ width }} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={onChange}
        displayEmpty
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectDropdown;
