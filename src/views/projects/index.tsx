"use client";

import React, { useMemo } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { useGetAll_projectsQuery, Project } from "@/redux/services/projectsApi";
import { theme } from "@/theme/theme";

ModuleRegistry.registerModules([AllCommunityModule]);

const ProjectsView = () => {
  const { data, error, isLoading } = useGetAll_projectsQuery();

  const columnDefs: ColDef<Project>[] = useMemo(
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
      { headerName: "🏢 Organization ID", field: "organization_id", flex: 2, minWidth: 250 },
    ],
    []
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: theme.colors.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10} color={theme.colors.states.error}>
        <Typography variant="h6">Failed to load projects.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", width: "100%", padding: theme.spacing(4) }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h5"
          sx={{ fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}
        >
          📌 Projects
        </Typography>
        <Typography variant="body1" sx={{ color: theme.colors.text.muted }}>
          Total: {data?.total_projects || 0}
        </Typography>
      </Box>

      {/* AG Grid */}
      <Box className="custom-ag-theme ag-theme-quartz" sx={{ height: "75vh", width: "100%" }}>
        <AgGridReact<Project>
          rowData={data?.projects || []}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={10}
          animateRows
        />
      </Box>
    </Box>
  );
};

export default ProjectsView;
