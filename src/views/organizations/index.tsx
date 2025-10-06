"use client";

import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  FormControl,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  BusinessRounded as BusinessIcon,
  Event as EventIcon,
  GroupWork as OrgCountIcon,
} from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { useGetAll_organizationsQuery } from "@/redux/services/organizationsApi";
import { theme } from "@/theme/theme";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Organization {
  id: string;
  organization_name: string;
  createdAt: string;
}

// ========== Organization Details Dialog ==========
const OrgDetailsDialog = ({
  open,
  org,
  onClose,
}: {
  open: boolean;
  org: Organization | null;
  onClose: () => void;
}) => {
  if (!org) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ background: theme.colors.gradients.background1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              background: theme.colors.primary,
              width: 50,
              height: 50,
            }}
          >
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {org.organization_name}
            </Typography>
            <Typography variant="body2" color={theme.colors.text.muted}>
              ID: {org.id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Created At:</Typography>
            <Typography>
              {new Date(org.createdAt).toLocaleString("en-US")}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ background: theme.colors.primary }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ========== Main Component ==========
const OrganizationsView = () => {
  const { data, error, isLoading, refetch } = useGetAll_organizationsQuery();
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const gridRef = useRef<AgGridReact<Organization>>(null);

  // ===== Search Filter (By Name) =====
  const handleSearch = useCallback(() => {
    if (!data?.organizations) return;
    const filtered = data.organizations.filter((org) =>
      org.organization_name.toLowerCase().includes(searchText.toLowerCase())
    );
    gridRef.current?.api.setGridOption("rowData", filtered);
  }, [data?.organizations, searchText]);

  // ===== Clear Filters =====
  const handleClearFilters = useCallback(() => {
    setSearchText("");
    setStartDate("");
    setEndDate("");
    if (data?.organizations)
      gridRef.current?.api.setGridOption("rowData", data.organizations);
  }, [data?.organizations]);

  // ===== View Organization Details =====
  const handleViewOrg = useCallback((org: Organization) => {
    setSelectedOrg(org);
    setDialogOpen(true);
  }, []);

  // ===== Date Filter Logic =====
  const filteredData = useMemo(() => {
    let orgs = data?.organizations || [];

    if (startDate)
      orgs = orgs.filter(
        (o) => new Date(o.createdAt) >= new Date(startDate)
      );

    if (endDate)
      orgs = orgs.filter((o) => new Date(o.createdAt) <= new Date(endDate));

    if (searchText)
      orgs = orgs.filter((o) =>
        o.organization_name.toLowerCase().includes(searchText.toLowerCase())
      );

    return orgs;
  }, [data?.organizations, startDate, endDate, searchText]);

  // ===== Column Definitions =====
  const columnDefs: ColDef<Organization>[] = useMemo(
    () => [
      {
        headerName: "Organization Name",
        field: "organization_name",
        flex: 1.5,
        minWidth: 200,
        filter: "agTextColumnFilter",
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1.2}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: theme.colors.border.gradient,
              }}
            >
              {params.value?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        headerName: "Created At",
        field: "createdAt",
        flex: 1.2,
        minWidth: 180,
        filter: "agDateColumnFilter",
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon fontSize="small" sx={{ color: theme.colors.primary }} />
            <Typography variant="body2" fontSize="0.8rem">
              {new Date(params.value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        ),
      },
      {
        headerName: "Actions",
        field: "actions",
        flex: 0.5,
        minWidth: 100,
        cellRenderer: (params: any) => (
          <IconButton
            size="small"
            onClick={() => handleViewOrg(params.data)}
            sx={{
              color: theme.colors.primary,
              "&:hover": { background: `${theme.colors.primary}15` },
            }}
          >
            <ViewIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [handleViewOrg]
  );

  // ===== Default Col Settings =====
  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    []
  );

  // ===== Loading / Error =====
  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
        flexDirection="column"
      >
        <CircularProgress sx={{ color: theme.colors.primary, mb: 2 }} />
        <Typography color={theme.colors.text.muted}>
          Loading organizations...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Typography color={theme.colors.states.error} mb={2}>
          Failed to load organizations.
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          sx={{ background: theme.colors.primary }}
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </Box>
    );

  const totalOrgs = data?.total_organizations ?? 0;

  return (
    <Box>
      {/* ===== Header ===== */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: theme.radii.xl,
          background: "#fff",
          border: `1px solid ${theme.colors.border.solid}`,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <BusinessIcon sx={{ color: theme.colors.primary, fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Organizations Management
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <OrgCountIcon sx={{ fontSize: 20, color: theme.colors.text.muted }} />
                <Typography variant="body2" color={theme.colors.text.muted}>
                  Total Organizations:{" "}
                  <strong style={{ color: theme.colors.primary }}>{totalOrgs}</strong>
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => gridRef.current?.api.exportDataAsCsv()}
              sx={{ background: theme.colors.primary }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* ===== Filters ===== */}
        <Stack direction="row" flexWrap="wrap" gap={2}>
          <TextField
            size="small"
            placeholder="Search by organization name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.colors.text.muted }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 250 }}
          />

          <TextField
            size="small"
            type="date"
            label="From"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            type="date"
            label="To"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </Stack>
      </Paper>

      {/* ===== Grid Table ===== */}
      <Paper
        sx={{
          borderRadius: theme.radii.xl,
          border: `1px solid ${theme.colors.border.solid}`,
          overflow: "hidden",
        }}
      >
        <Box
          className="custom-ag-theme ag-theme-quartz"
          sx={{
            height: "70vh",
            "& .ag-root-wrapper": { border: "none" },
          }}
        >
          <AgGridReact<Organization>
            ref={gridRef}
            rowData={filteredData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination
            paginationPageSize={10}
            rowHeight={55}
            headerHeight={50}
            animateRows
          />
        </Box>
      </Paper>

      <OrgDetailsDialog
        open={dialogOpen}
        org={selectedOrg}
        onClose={() => setDialogOpen(false)}
      />

            {/* Custom Styling */}
      <style jsx global>{`
        .custom-ag-theme {
          --ag-font-family: ${theme.typography.fontFamily};
          --ag-font-size: 14px;
          --ag-row-hover-color: rgba(62, 162, 255, 0.08);
          --ag-selected-row-background-color: rgba(62, 162, 255, 0.12);
          --ag-header-background-color: #f9fafb;
          --ag-border-color: ${theme.colors.border.solid};
          --ag-row-border-color: ${theme.colors.border.solid};
        }

        .custom-ag-theme .ag-header {
          border-bottom: 2px solid ${theme.colors.border.solid};
        }

        .custom-ag-theme .ag-header-cell {
          color: ${theme.colors.text.primary};
          font-weight: ${theme.typography.fontWeight.semibold};
          font-size: 0.875rem;
        }

        .custom-ag-theme .ag-row {
          border-bottom: 1px solid ${theme.colors.border.solid};
        }

        .custom-ag-theme .ag-row:hover {
          cursor: pointer;
        }

        .custom-ag-theme .ag-cell {
          display: flex;
          align-items: center;
        }

        .custom-ag-theme .ag-paging-panel {
          border-top: 2px solid ${theme.colors.border.solid};
          padding: 12px;
        }
      `}</style>
    </Box>
  );
};

export default OrganizationsView;
