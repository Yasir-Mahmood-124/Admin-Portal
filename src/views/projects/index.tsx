"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import {
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-theme-quartz.css"; // ✅ only Quartz theme

import {
  useGetAll_projectsQuery,
  Project,
} from "@/redux/services/projectsApi";
import {
  useGetOrganizationProjectsQuery,
  Organization,
} from "@/redux/services/get_organization_projects";
import {
  useGetUserOrganizationProjectsQuery,
} from "@/redux/services/get_user_organization_project";

import { theme } from "@/theme/theme";

// ✅ Only community module
ModuleRegistry.registerModules([AllCommunityModule]);

const ProjectsView = () => {
  // Queries
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

  // ✅ Columns for All Projects
  const allProjectsCols: ColDef<Project>[] = useMemo(
    () => [
      { headerName: "📌 Project Name", field: "project_name", flex: 2, minWidth: 200 },
      {
        headerName: "📅 Created At",
        field: "createdAt",
        flex: 1.5,
        minWidth: 200,
        valueFormatter: (params) =>
          params.value ? new Date(params.value).toLocaleString() : "—",
      },
      {
        headerName: "🏢 Organization ID",
        field: "organization_id",
        flex: 2,
        minWidth: 250,
      },
    ],
    []
  );

  // ✅ Columns for Organizations
  const orgCols: ColDef<Organization>[] = useMemo(
    () => [
      {
        headerName: "🏢 Organization Name",
        field: "organization_name",
        flex: 2,
        minWidth: 200,
      },
      {
        headerName: "👤 User ID",
        field: "user_id",
        flex: 1.5,
        minWidth: 200,
      },
      {
        headerName: "📅 Created At",
        field: "createdAt",
        flex: 1.5,
        minWidth: 200,
        valueFormatter: (params) =>
          params.value ? new Date(params.value).toLocaleString() : "—",
      },
      {
        headerName: "📌 Projects",
        field: "projects",
        flex: 3,
        minWidth: 300,
        valueFormatter: (params) =>
          params.value && params.value.length > 0
            ? params.value.map((p: Project) => p.project_name).join(", ")
            : "—",
      },
    ],
    []
  );

  // ✅ Loading State
  if (allProjectsLoading || orgProjectsLoading || userOrgProjectsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: theme.colors.primary }} />
      </Box>
    );
  }

  // ✅ Error State
  if (allProjectsError || orgProjectsError || userOrgProjectsError) {
    return (
      <Box textAlign="center" mt={10} color={theme.colors.states.error}>
        <Typography variant="h6">⚠ Failed to load data.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", width: "100%", padding: theme.spacing(4) }}>
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text.primary,
          mb: 2,
        }}
      >
        📂 Projects Dashboard
      </Typography>

      {/* All Projects Section */}
      <Typography
        variant="h6"
        sx={{ color: theme.colors.primary, fontWeight: "bold", mb: 1 }}
      >
        📌 All Projects ({allProjectsData?.total_projects || 0})
      </Typography>
      <Box className="ag-theme-quartz" sx={{ height: "60vh", mb: 4 }}>
        <AgGridReact<Project>
          rowData={allProjectsData?.projects || []}
          columnDefs={allProjectsCols}
          pagination
          paginationPageSize={10}
          animateRows
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Organizations with Projects Section */}
      <Typography
        variant="h6"
        sx={{ color: theme.colors.primary, fontWeight: "bold", mb: 1 }}
      >
        🏢 Organizations and Their Projects (
        {orgProjectsData?.total_organizations || 0})
      </Typography>
      <Box className="ag-theme-quartz" sx={{ height: "70vh", mb: 4 }}>
        <AgGridReact<Organization>
          rowData={orgProjectsData?.organizations || []}
          columnDefs={orgCols}
          pagination
          paginationPageSize={10}
          animateRows
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Users → Organizations → Projects (Accordion version) */}
      <Typography
        variant="h6"
        sx={{ color: theme.colors.primary, fontWeight: "bold", mb: 2 }}
      >
        👤 Users → Organizations → Projects (
        {userOrgProjectsData?.total_users || 0})
      </Typography>

      {userOrgProjectsData?.users && userOrgProjectsData.users.length > 0 ? (
  <Box>
    {userOrgProjectsData.users.map((user: any, uIndex: number) => {
      const userLabel =
        user.name ||
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
        user.email;

      return (
        <Accordion key={user.id ?? `user-${uIndex}`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{userLabel}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {user.organizations.map((org: any) => (
              <Box key={org.id} mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Organization: {org.organization_name}
                </Typography>
                <List dense>
                  {org.projects.map((proj: any) => (
                    <ListItem key={proj.id}>
                      <ListItemText primary={`Project: ${proj.project_name}`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      );
    })}
  </Box>
) : (
  <Typography variant="body2" color="text.secondary">
    No users available
  </Typography>
)}

    </Box>
  );
};

export default ProjectsView;



