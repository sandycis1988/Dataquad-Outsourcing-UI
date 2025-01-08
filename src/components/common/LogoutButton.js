import React from "react";
import { Button, useTheme } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const LogoutButton = ({ handleLogout }) => {
  const theme = useTheme(); // Access the theme

  return (
    <Button
      variant="outlined"
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
      sx={{
        borderColor: theme.palette.primary.main, // Use primary color for the border
        color: theme.palette.primary.main,        // Use primary color for text
        "&:hover": {
          borderColor: theme.palette.primary.main, // Border color on hover remains the same
          color: "#fff", // Text color turns white on hover
          backgroundColor: theme.palette.primary.main, // Background turns to primary color on hover
        },
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
