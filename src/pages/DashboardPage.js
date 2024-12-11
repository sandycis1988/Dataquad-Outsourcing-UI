import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { logoutAsync } from "../redux/features/authSlice";
import Requirements from "../components/Requirements/Requirements";
import Submissions from "../components/Tabs/Submissions";
import Planned from "../components/Tabs/Planned";
import Bench from "../components/Tabs/Bench";
import Assigned from "../components/Tabs/Assigned";
import AddUser from "../components/Tabs/AddUser";
import Header from "../components/Header"; // Import the separate Header
import logo from "../assets/logo-01.png";
import JobForm from "../components/Requirements/JobForm";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';




// Tabs Configured for Each Role
const TABS_BY_ROLE = {
  EMPLOYEE: [
    {
      label: "Requirements",
      value: "REQUIREMENTS",
      component: <Requirements />,
      icon: <AssignmentIcon />,
    },
    {
      label: "Assigned",
      value: "ASSIGNED",
      component: <Assigned />,
      icon: <WorkIcon />,
    },
    {
      label: "Submissions",
      value: "SUBMISSIONS",
      component: <Submissions />,
      icon: <AssignmentIcon />,
    },

    
  ],
  ADMIN: [
    {
      label: "Planned",
      value: "PLANNED",
      component: <Planned />,
      icon: <HomeIcon />,
    },
    { label: "Bench", value: "BENCH", component: <PeopleIcon /> },
    {
      label: "AddUser",
      value: "ADDUSER",
      component: <AddUser />,
      icon: <AddIcon />,
    },
  ],
  SUPERADMIN: [
    {
      label: "Requirements",
      value: "REQUIREMENTS",
      component: <Requirements />,
      icon: <AssignmentIcon />,
    },
    {
      label: "Planned",
      value: "PLANNED",
      component: <Planned />,
      icon: <HomeIcon />,
    },
    {
      label: "Bench",
      value: "BENCH",
      component: <Bench />,
      icon: <HourglassEmpty />,
    },
    {
      label: "Job Form",
      value: "jobFrom",
      component: <JobForm />,
      icon: <WorkIcon />,
    },
    {
      label: "AddUser",
      value: "ADDUSER",
      component: <AddUser />,
      icon: <AddIcon />,
    },
    {
      label: "Assigned",
      value: "ASSIGNED",
      component: <Assigned />,
      icon: <WorkIcon />,
    },
    {
      label: "Submissions",
      value: "SUBMISSIONS",
      component: <Submissions />,
      icon: <AssignmentIcon />,
    },
  ],
};

const DashboardPage = () => {
  const { roles, logInTimeStamp } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  const [selectedTab, setSelectedTab] = useState("REQUIREMENTS");
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAsync(user.userId));
    navigate("/");
  };

  const activeTabs = TABS_BY_ROLE[roles[0]] || []; // Tabs based on role
  const selectedTabComponent = activeTabs.find(
    (tab) => tab.value === selectedTab
  )?.component;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header Component */}
      <Box sx={{ flexShrink: 0, zIndex: 10 }}>
        <Header userId={user} logInTimeStamp={logInTimeStamp} orglogo={logo} />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: "flex", flex: 1, mt: 2 }}>
        {/* Sidebar - Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: "16.66%", // 2/12 of the page width
            flexShrink: 0,
            marginTop: "7%",
            maxHeight: "50%",

            "& .MuiDrawer-paper": {
              width: "16.66%",
              boxSizing: "border-box",
              marginTop: "7%",
              bgcolor: "rgba(232, 245, 233, 0.5)",
            },
          }}
        >
          <List>
            {activeTabs.map((tab) => (
              <ListItem
                button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                sx={{
                  borderRadius: "8px",
                  marginTop:'3vh',
                  borderBottom:
                    selectedTab === tab.value ? "1px solid #4B70F5" : "inherit",
                  

                  "&:hover": {
                    backgroundColor: "#4B70F5", // Background color on hover
                    color: "#fff", // Text and icon color on hover
                    borderRadius: "8px", // Apply border radius on hover
                    transform: 'scale(1.05)', 
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  },
                  "&:hover .MuiListItemIcon-root": {
                    color: "#fff", // Change icon color on hover
                  },
                  "&:hover .MuiListItemText-root": {
                    color: "#fff", // Change text color on hover
                  },
                  marginBottom: "8px", // Optional: Add spacing between items
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit", // Inherit text color for consistency
                  }}
                >
                  {tab.icon}
                </ListItemIcon>
                <ListItemText
                  primary={tab.label}
                  sx={{
                    "& .MuiTypography-root": {
                      color: "inherit", // Inherit hover color
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            width: "83.33%", // 8/12 of the page width
            display: "flex",
            flexDirection: "column",
            padding: 3,
            marginTop: "100px",
          }}
        >
          {/* Active Tab Content */}
          <Box sx={{ flex: 1 }}>{selectedTabComponent}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
