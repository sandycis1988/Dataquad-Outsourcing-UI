import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tab,
  Tabs,
  Box,
  Button,
} from "@mui/material";
import logo from "../assets/logo-01.png";
import Requirements from "../components/Requirements/Requirements";
import Submissions from "../components/Tabs/Submissions";
import Planned from "../components/Tabs/Planned";
import Bench from "../components/Tabs/Bench";
import Assigned from "../components/Tabs/Assigned";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { logoutAsync } from "../redux/features/authSlice";

const DashboardPage = () => {
  // const { user } = useSelector((state) => state.auth);
  // const { logInTimeStamp } = useSelector((state) => state.auth);

  const user = { role: "ADMIN", userId: "1234" }; 
  const logInTimeStamp = "2024-12-05 08:30:00"; // Demo timestamp


  const [selectedTab, setSelectedTab] = useState("REQUIREMENTS");
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme
  const dispatch = useDispatch();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleLogout = () => {
    dispatch(logoutAsync(user.userId));
    navigate("/");
  };

  // Logic to conditionally render tabs based on role
  const getTabsBasedOnRole = () => {
    const commonTabs = [
      <Tab label="REQUIREMENTS" value="REQUIREMENTS" />,
    ];

    if (user.role === "SUPERADMIN") {
      return [
        ...commonTabs,
        <Tab label="SUBMISSIONS" value="SUBMISSIONS" />,
        <Tab label="ASSIGNED" value="ASSIGNED" />,
      ];
    }

    if (user.role === "ADMIN") {
      return [
        ...commonTabs,
        <Tab label="PLANNED" value="PLANNED" />,
        <Tab label="BENCH" value="BENCH" />,
      ];
    }

    // Default for employees
    return [
      ...commonTabs,
      <Tab label="PLANNED" value="PLANNED" />,
      <Tab label="BENCH" value="BENCH" />,
    ];
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header Section */}
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", width: "100%" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <img src={logo} alt="Logo" style={{ width: "20vh", marginRight: 10 }} />

          {/* Wrapper for the timestamp and logout button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, marginRight: 2 }}>
              LogIn at - {logInTimeStamp}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  color: "#fff",
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content Section */}
      <Box sx={{ flex: 1, padding: { xs: 2, sm: 3 }, mt: 10 }}>
        {/* Tabs Section */}
        <Box sx={{ top: 0, zIndex: 1, backgroundColor: "#fff", display: "flex", justifyContent: "flex-start" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            centered
            indicatorColor="primary"
            textColor="primary"
            sx={{
              borderBottom: 2,
              borderColor: "divider",
              "& .MuiTab-root": {
                borderBottom: 2,
                borderColor: "transparent",
              },
              "& .Mui-selected": {
                borderBottom: 2,
                borderColor: "#3f51b5",
              },
            }}
          >
            {getTabsBasedOnRole()}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ paddingTop: 3 }}>
          {selectedTab === "REQUIREMENTS" && <Requirements />}
          {selectedTab === "SUBMISSIONS" && <Submissions />}
          {selectedTab === "PLANNED" && <Planned />}
          {selectedTab === "BENCH" && <Bench />}
          {selectedTab === "ASSIGNED" && <Assigned />}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
