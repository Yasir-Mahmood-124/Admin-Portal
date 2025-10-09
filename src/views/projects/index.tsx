"use client";

import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Tab,
  Tabs,
  Paper,
  Alert,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  useGetAll_projectsQuery,
} from "@/redux/services/projectsApi";
import {
  useGetOrganizationProjectsQuery,
} from "@/redux/services/get_organization_projects";
import {
  useGetUserOrganizationProjectsQuery,
} from "@/redux/services/get_user_organization_project";
import { theme } from "@/theme/theme";



// Import child components
import AllProjectsGrid from "./AllProjectsGrid";
import OrganizationsTree from "./OrganizationsTree";
import UsersTree from "./UsersTree";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ProjectsView = () => {
  const [activeTab, setActiveTab] = useState(0);

  // API Queries
  const {
    data: allProjectsData,
    error: allProjectsError,
    isLoading: allProjectsLoading,
  } = useGetAll_projectsQuery();

  const {
    data: orgProjectsData,
    error: orgProjectsError,
    isLoading: orgProjectsLoading,
  } = useGetOrganizationProjectsQuery();

  const {
    data: userOrgProjectsData,
    error: userOrgProjectsError,
    isLoading: userOrgProjectsLoading,
  } = useGetUserOrganizationProjectsQuery();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Loading State
  if (allProjectsLoading || orgProjectsLoading || userOrgProjectsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: theme.colors.primary }} />
      </Box>
    );
  }

  // Error State
  if (allProjectsError || orgProjectsError || userOrgProjectsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load data. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <DashboardIcon sx={{ fontSize: 32, color: "#fff", mr: 2 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: theme.typography.fontWeight.bold,
              color: "#fff",
            }}
          >
            Projects Management Dashboard
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
          Manage and view all projects, organizations, and users
        </Typography>
      </Paper>

      {/* Tabs Navigation */}
      <Paper elevation={1} sx={{ borderRadius: 2, mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              minHeight: 64,
            },
          }}
        >
          <Tab
            icon={<FolderIcon />}
            iconPosition="start"
            label={`All Projects (${allProjectsData?.total_projects || 0})`}
          />
          <Tab
            icon={<BusinessIcon />}
            iconPosition="start"
            label={`Organizations (${orgProjectsData?.total_organizations || 0})`}
          />
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label={`Users (${userOrgProjectsData?.total_users || 0})`}
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        <AllProjectsGrid projects={allProjectsData?.projects || []} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <OrganizationsTree organizations={orgProjectsData?.organizations || []} />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <UsersTree users={userOrgProjectsData?.users || []} />
      </TabPanel>
    </Box>
  );
};

export default ProjectsView;