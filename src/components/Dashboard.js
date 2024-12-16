import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  IconButton,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Dashboard = ({ userRole }) => {
  const roleTabs = [
    {
      role: "employee",
      tabs: [
        { name: "Home", content: "Welcome to the Employee Dashboard" },
        { name: "Profile", content: "Manage your profile here." },
        { name: "Tasks", content: "View and manage your tasks." },
      ],
    },
    {
      role: "admin",
      tabs: [
        { name: "Home", content: "Welcome to the Admin Dashboard" },
        { name: "Profile", content: "Manage your profile here." },
        { name: "Manage Users", content: "Add, edit, or delete users." },
        { name: "Reports", content: "Generate and view reports." },
      ],
    },
  ];

  // Filter tabs based on userRole
  const userTabs = roleTabs.find((item) => item.role === userRole)?.tabs || [
    { name: "Home", content: "Default Dashboard Content" },
  ];

  const [selectedTab, setSelectedTab] = useState(userTabs[0]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false); // Close mobile drawer when switching to desktop view
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 220;
  const appBarHeight = 74; // Default AppBar height in Material-UI

  const drawerContent = (
    <Box sx={{ overflow: "auto" }}>
      <List>
        {userTabs.map((tab, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={selectedTab?.name === tab.name}
              onClick={() => setSelectedTab(tab)}
              sx={{
                "&.Mui-selected": { backgroundColor: "primary.light" },
              }}
            >
              <ListItemText primary={tab.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ marginRight: 2  ,color:'white'}}>
            user123
          </Typography>
          <Avatar src="https://via.placeholder.com/150" alt="Profile Icon" />
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={!isMobile || mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: appBarHeight, // Push Drawer below the AppBar
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` }, // Adjust margin-left for larger screens
          mt: `${appBarHeight}px`, // Push main content below the AppBar
        }}
      >
        {selectedTab ? (
          <>
            <Typography variant="h4">{selectedTab.name}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {selectedTab.content}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">
            Please select an option from the side menu.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

Dashboard.propTypes = {
  userRole: PropTypes.string.isRequired,
};

export default Dashboard;
