import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { logoutAsync } from "../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = ({ userId, logInTimeStamp, orglogo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState(null); // Local state for the profile image
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor element


  

  // Handle profile image upload (locally)
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Convert the image to base64
      reader.onloadend = () => {
        const base64Image = reader.result.split(",")[1]; // Remove the 'data:image/jpeg;base64,' part of the string
        setImage(base64Image); // Store the base64 image locally
      };

      reader.readAsDataURL(file); // Start reading the file as Base64
    }
  };


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element for the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const onLogout = async () => {
    try {
      // Wait for the logoutAsync action to complete
      await dispatch(logoutAsync(userId)).unwrap();   
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar
      sx={{
        backgroundColor: "rgba(232, 245, 233, 0.5)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it's above other elements
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            // flex: 1,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <img
            src={orglogo}
            alt="Logo"
            style={{ width: "26vh", maxWidth: "100%" }}
          />
        </Box>

        {/* User Info, Profile Image, and Logout */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.75rem", md: "0.85rem" },
                color: "#000000",
                fontWeight: "bold",
              }}
            >
              {userId }
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.65rem", md: "0.75rem" },
                color: "#000000",
              }}
            >
              Logged in at: {logInTimeStamp || "13:30 PM - 10-12-2024"}
            </Typography>
          </Box>
          <Box
            sx={{
              position: "relative",
              "&:hover > #profile-menu": { display: "block" }, // Show menu on hover
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                marginLeft: 1.5, // Move avatar to the end
                border: "2px solid #000",
                cursor: "pointer",
                backgroundColor: "#f0f0f0", // Optional background for icon
                color: "#4B70F5", // Icon color
              }}
              onMouseEnter={handleMenuOpen} // Open menu on hover
            >
              {image ? (
                <img
                  src={`data:image/png;base64,${image}`}
                  alt="User Profile"
                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                />
              ) : (
                <AccountCircleIcon fontSize="large" /> // Display profile icon
              )}
            </Avatar>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              onMouseLeave={handleMenuClose} // Close menu when the mouse leaves
              MenuListProps={{
                onMouseEnter: () => setAnchorEl(anchorEl), // Keep menu open on hover
                onMouseLeave: handleMenuClose,
              }}
              sx={{
                "& .MuiMenuItem-root": {
                  color: "#333333",
                  fontSize: "0.85rem",
                  bgcolor:'#fff',
                  "&:hover": {
                    backgroundColor: "#4B70F5",
                    color: "#F7F9F2", // Light gray background on hover
                    borderRadius: "8px", 
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/timesheet");
                }}
              >
                Timesheet
              </MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
