"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
} from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import {
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community"; // ✅ import modules

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { useGetAll_usersQuery, User } from "@/redux/services/usersApi";
import { theme } from "@/theme/theme";

// ✅ Register all community modules once
ModuleRegistry.registerModules([AllCommunityModule]);

const UsersView = () => {
  const { data, error, isLoading, refetch } = useGetAll_usersQuery();
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback(() => {
    gridApi?.setQuickFilter(searchText);
  }, [searchText]);

  let gridApi: any;
  const onGridReady = (params: any) => {
    gridApi = params.api;
  };

  // Column Definitions
  const columnDefs: ColDef<User>[] = useMemo(
    () => [
      {
        headerName: "Full Name",
        field: "fullName",
        flex: 1.5,
        minWidth: 200,
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" sx={{ color: theme.colors.primary }} />
            <Typography variant="body2" sx={{ color: theme.colors.text.primary }}>
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        headerName: "Email",
        field: "email",
        flex: 2,
        minWidth: 250,
        cellRenderer: (params: any) => (
          <Tooltip title={params.value || ""}>
            <Box display="flex" alignItems="center" gap={1}>
              <EmailIcon fontSize="small" sx={{ color: theme.colors.secondary }} />
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                {params.value}
              </span>
            </Box>
          </Tooltip>
        ),
      },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        minWidth: 140,
        cellRenderer: (params: any) => {
          const status = params.value || "unknown";
          const colorMap: Record<string, string> = {
            active: theme.colors.states.success,
            inactive: theme.colors.states.error,
            pending: theme.colors.states.warning,
          };
          return (
            <Chip
              label={status.charAt(0).toUpperCase() + status.slice(1)}
              size="small"
              sx={{
                backgroundColor: colorMap[status] || theme.colors.states.info,
                color: theme.colors.text.inverse,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            />
          );
        },
      },
      {
        headerName: "Created At",
        field: "createdAt",
        flex: 1.5,
        minWidth: 180,
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon fontSize="small" sx={{ color: theme.colors.primary }} />
            <Typography variant="body2">
              {params.value ? new Date(params.value).toLocaleString() : "—"}
            </Typography>
          </Box>
        ),
      },
    ],
    []
  );

  const rowData = data?.users || [];

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: theme.colors.primary, mb: 2 }} />
        <Typography variant="body1" color={theme.colors.text.muted}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10} color={theme.colors.states.error}>
        <Typography variant="h6">Failed to load users.</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2, borderColor: theme.colors.primary, color: theme.colors.primary }}
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", width: "100%", padding: theme.spacing(4) }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
          }}
        >
          👥 Users Management
        </Typography>

        {/* Actions */}
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.colors.text.muted }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
          <IconButton onClick={handleSearch} sx={{ color: theme.colors.primary }}>
            <SearchIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              background: theme.colors.primary,
              color: theme.colors.text.inverse,
              fontWeight: theme.typography.fontWeight.medium,
              "&:hover": {
                background: theme.colors.secondary,
              },
            }}
            onClick={() => gridApi?.exportDataAsCsv()}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Box
        className="custom-ag-theme ag-theme-quartz"
        sx={{
          height: "75vh",
          width: "100%",
          border: theme.colors.border.solid,
          borderRadius: theme.radii.lg,
          boxShadow: theme.shadows.md,
          overflow: "hidden",
        }}
      >
        <AgGridReact<User>
          rowData={rowData}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={10}
          animateRows
          rowHeight={55}
          headerHeight={60}
          onGridReady={onGridReady}
        />
      </Box>

      {/* 🎨 Custom Styling for Header */}
      <style jsx global>{`
        .custom-ag-theme .ag-header {
          background: ${theme.colors.gradients.background1} !important;
          backdrop-filter: blur(6px);
        }

        .custom-ag-theme .ag-header-cell {
          color: ${theme.colors.text.primary};
          font-weight: ${theme.typography.fontWeight.semibold};
          font-size: ${theme.typography.fontSize.sm};
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .custom-ag-theme .ag-row:hover {
          background-color: rgba(62, 162, 255, 0.08) !important;
          cursor: pointer;
        }
      `}</style>
    </Box>
  );
};

export default UsersView;