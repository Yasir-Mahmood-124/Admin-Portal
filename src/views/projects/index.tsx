"use client";

import React, { useMemo } from "react";
import { Box, CircularProgress, Typography, Divider } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import {
  useGetAll_projectsQuery,
  Project,
} from "@/redux/services/projectsApi";
import {
  useGetOrganizationProjectsQuery,
  Organization,
} from "@/redux/services/get_organization_projects";
import { theme } from "@/theme/theme";

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

  // Column defs for All Projects
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

  // Column defs for Organizations (with projects directly listed)
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

  // Loading State
  if (allProjectsLoading || orgProjectsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: theme.colors.primary }} />
      </Box>
    );
  }

  // Error State
  if (allProjectsError || orgProjectsError) {
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
      <Box className="ag-theme-quartz" sx={{ height: "70vh" }}>
        <AgGridReact<Organization>
          rowData={orgProjectsData?.organizations || []}
          columnDefs={orgCols}
          pagination
          paginationPageSize={10}
          animateRows
        />
      </Box>
    </Box>
  );
};

export default ProjectsView;


