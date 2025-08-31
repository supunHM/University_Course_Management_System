import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  InputBase,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 280;

const SidebarLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Courses", icon: <SchoolIcon />, path: "/courses" },
    { text: "Students", icon: <GroupIcon />, path: "/students" },
    { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Section */}
      <Box
        sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #e2e8f0" }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary">
          University
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Course Management
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                backgroundColor:
                  location.pathname === item.path ? "#4f46e5" : "transparent",
                color:
                  location.pathname === item.path ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor:
                    location.pathname === item.path ? "#4338ca" : "#f1f5f9",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? "white" : "#6b7280",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User Profile Section */}
      <Box sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: "#4f46e5" }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="600">
              Admin User
            </Typography>
            <Typography variant="caption" color="text.secondary">
              System Administrator
            </Typography>
          </Box>
        </Box>

        <ListItemButton
          sx={{
            borderRadius: 2,
            minHeight: 40,
            color: "#ef4444",
            "&:hover": {
              backgroundColor: "#fef2f2",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#ef4444", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}
    >
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 400,
              backgroundColor: "#f1f5f9",
              boxShadow: "none",
              border: "1px solid #e2e8f0",
            }}
          >
            <IconButton sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search courses, students..."
              inputProps={{ "aria-label": "search courses" }}
            />
          </Paper>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notifications */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <Avatar sx={{ width: 35, height: 35, bgcolor: "#4f46e5" }}>
            <PersonIcon />
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "white",
              borderRight: "1px solid #e2e8f0",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "white",
              borderRight: "1px solid #e2e8f0",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SidebarLayout;
