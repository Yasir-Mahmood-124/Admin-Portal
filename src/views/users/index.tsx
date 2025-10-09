"use client";

import React, { useMemo, useState, useCallback, useRef } from "react";
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
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  Email as EmailIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  HourglassEmpty as PendingIcon,
} from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridApi } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { useGetAll_usersQuery, User } from "@/redux/services/usersApi";
import { theme } from "@/theme/theme";

ModuleRegistry.registerModules([AllCommunityModule]);


// User Details Dialog Component
const UserDetailsDialog = ({
  open,
  user,
  onClose,
}: {
  open: boolean;
  user: User | null;
  onClose: () => void;
}) => {
  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <ActiveIcon sx={{ color: theme.colors.states.success }} />;
      case "inactive":
        return <InactiveIcon sx={{ color: theme.colors.states.error }} />;
      case "pending":
        return <PendingIcon sx={{ color: theme.colors.states.warning }} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ background: theme.colors.gradients.background1, pb: 2 }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={user.picture}
            sx={{
              width: 56,
              height: 56,
              border: `3px solid ${theme.colors.primary}`,
            }}
          >
            {user.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              fontWeight={theme.typography.fontWeight.bold}
            >
              {user.fullName}
            </Typography>
            <Typography variant="body2" color={theme.colors.text.muted}>
              {user.email}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          {/* Status */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="body2"
              fontWeight={theme.typography.fontWeight.semibold}
              color={theme.colors.text.secondary}
            >
              Status:
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {getStatusIcon(user.status)}
              <Chip
                label={
                  user.status?.charAt(0).toUpperCase() + user.status?.slice(1)
                }
                size="small"
                sx={{
                  backgroundColor:
                    user.status === "active"
                      ? theme.colors.states.success
                      : user.status === "inactive"
                      ? theme.colors.states.error
                      : theme.colors.states.warning,
                  color: theme.colors.text.inverse,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              />
            </Box>
          </Box>

          {/* User ID */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="body2"
              fontWeight={theme.typography.fontWeight.semibold}
              color={theme.colors.text.secondary}
            >
              User ID:
            </Typography>
            <Typography
              variant="body2"
              fontFamily="monospace"
              color={theme.colors.text.muted}
            >
              {user.id}
            </Typography>
          </Box>

          {/* Onboarding Status */}
          {user.onboarding_status !== undefined && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                fontWeight={theme.typography.fontWeight.semibold}
                color={theme.colors.text.secondary}
              >
                Onboarding:
              </Typography>
              <Chip
                label={user.onboarding_status ? "Completed" : "Pending"}
                size="small"
                color={user.onboarding_status ? "success" : "warning"}
                variant="outlined"
              />
            </Box>
          )}

          {/* Locale */}
          {user.locale && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                fontWeight={theme.typography.fontWeight.semibold}
                color={theme.colors.text.secondary}
              >
                Locale:
              </Typography>
              <Typography variant="body2">{user.locale}</Typography>
            </Box>
          )}

          {/* Created At */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="body2"
              fontWeight={theme.typography.fontWeight.semibold}
              color={theme.colors.text.secondary}
            >
              Created At:
            </Typography>
            <Typography variant="body2">
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
            </Typography>
          </Box>

          {/* Expiry */}
          {user.expiry && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                fontWeight={theme.typography.fontWeight.semibold}
                color={theme.colors.text.secondary}
              >
                Token Expiry:
              </Typography>
              <Typography variant="body2">
                {new Date(user.expiry).toLocaleString()}
              </Typography>
            </Box>
          )}

          {/* Session ID */}
          {user.session_id && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                fontWeight={theme.typography.fontWeight.semibold}
                color={theme.colors.text.secondary}
              >
                Session ID:
              </Typography>
              <Typography
                variant="body2"
                fontFamily="monospace"
                fontSize="0.75rem"
                color={theme.colors.text.muted}
              >
                {user.session_id.substring(0, 20)}...
              </Typography>
            </Box>
          )}
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

const UsersView = () => {
  const { data, error, isLoading, refetch } = useGetAll_usersQuery();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [onboardingFilter, setOnboardingFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const gridRef = useRef<AgGridReact<User>>(null);

  const handleSearch = useCallback(() => {
    gridRef.current?.api?.setGridOption("quickFilterText", searchText);
  }, [searchText]);

  const handleClearFilters = useCallback(() => {
    setSearchText("");
    setStatusFilter("all");
    setOnboardingFilter("all");
    gridRef.current?.api?.setGridOption("quickFilterText", "");
    gridRef.current?.api?.setFilterModel(null);
  }, []);

  const handleViewUser = useCallback((user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  }, []);

  // Filter data based on filters
  const filteredData = useMemo(() => {
    let filtered = data?.users || [];

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.status?.toLowerCase() === statusFilter
      );
    }

    if (onboardingFilter !== "all") {
      const isCompleted = onboardingFilter === "completed";
      filtered = filtered.filter(
        (user) => Boolean(user.onboarding_status) === isCompleted
      );
    }

    return filtered;
  }, [data?.users, statusFilter, onboardingFilter]);

  // Column Definitions
  const columnDefs: ColDef<User>[] = useMemo(
    () => [
      {
        headerName: "User",
        field: "fullName",
        flex: 1.5,
        minWidth: 220,
        filter: "agTextColumnFilter",
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              src={params.data.picture}
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.875rem",
                background: theme.colors.border.gradient,
              }}
            >
              {params.value?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                fontWeight={theme.typography.fontWeight.medium}
              >
                {params.value}
              </Typography>
              <Typography
                variant="caption"
                color={theme.colors.text.muted}
                fontSize="0.7rem"
              >
                ID: {params.data?.id ? params.data.id.substring(0, 8) : "—"}...
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        headerName: "Email",
        field: "email",
        flex: 2,
        minWidth: 250,
        filter: "agTextColumnFilter",
        cellRenderer: (params: any) => (
          <Tooltip title={params.value || ""}>
            <Box display="flex" alignItems="center" gap={1}>
              <EmailIcon
                fontSize="small"
                sx={{ color: theme.colors.secondary }}
              />
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
        minWidth: 120,
        // filter: "agSetColumnFilter",
        cellRenderer: (params: any) => {
          const status = params.value?.toLowerCase() || "unknown";
          const colorMap: Record<string, string> = {
            active: theme.colors.states.success,
            inactive: theme.colors.states.error,
            pending: theme.colors.states.warning,
          };
          const IconMap: Record<string, any> = {
            active: ActiveIcon,
            inactive: InactiveIcon,
            pending: PendingIcon,
          };
          const Icon = IconMap[status];

          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              {Icon && (
                <Icon sx={{ fontSize: "1rem", color: colorMap[status] }} />
              )}
              <Chip
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                size="small"
                sx={{
                  backgroundColor: colorMap[status] || theme.colors.states.info,
                  color: theme.colors.text.inverse,
                  fontWeight: theme.typography.fontWeight.medium,
                  fontSize: "0.75rem",
                  height: "24px",
                }}
              />
            </Box>
          );
        },
      },
      {
        headerName: "Onboarding",
        field: "onboarding_status",
        flex: 1,
        minWidth: 130,
        // filter: "agSetColumnFilter",
        cellRenderer: (params: any) => {
          const isCompleted = Boolean(params.value);
          return (
            <Chip
              label={isCompleted ? "Completed" : "Pending"}
              size="small"
              variant="outlined"
              sx={{
                borderColor: isCompleted
                  ? theme.colors.states.success
                  : theme.colors.states.warning,
                color: isCompleted
                  ? theme.colors.states.success
                  : theme.colors.states.warning,
                fontWeight: theme.typography.fontWeight.medium,
                fontSize: "0.7rem",
              }}
            />
          );
        },
      },
      {
        headerName: "Locale",
        field: "locale",
        flex: 0.8,
        minWidth: 100,
        filter: "agTextColumnFilter",
        cellRenderer: (params: any) => (
          <Typography variant="body2" fontSize="0.8rem">
            {params.value || "—"}
          </Typography>
        ),
      },
      {
        headerName: "Created At",
        field: "createdAt",
        flex: 1.3,
        minWidth: 180,
        filter: "agDateColumnFilter",
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon fontSize="small" sx={{ color: theme.colors.primary }} />
            <Typography variant="body2" fontSize="0.8rem">
              {params.value
                ? new Date(params.value).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </Typography>
          </Box>
        ),
      },
      {
        headerName: "Actions",
        field: "id",
        flex: 0.8,
        minWidth: 100,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <IconButton
            size="small"
            onClick={() => handleViewUser(params.data)}
            sx={{
              color: theme.colors.primary,
              "&:hover": {
                background: `${theme.colors.primary}15`,
              },
            }}
          >
            <ViewIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [handleViewUser]
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress
          sx={{ color: theme.colors.primary, mb: 2 }}
          size={50}
        />
        <Typography variant="body1" color={theme.colors.text.muted}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color={theme.colors.states.error} mb={2}>
          Failed to load users.
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: theme.colors.primary,
            "&:hover": { background: theme.colors.secondary },
          }}
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const totalUsers = data?.users?.length || 0;
  const activeUsers =
    data?.users?.filter((u) => u.status?.toLowerCase() === "active").length ||
    0;
  const pendingUsers =
    data?.users?.filter((u) => u.status?.toLowerCase() === "pending").length ||
    0;
  const inactiveUsers =
    data?.users?.filter((u) => u.status?.toLowerCase() === "inactive").length ||
    0;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: theme.radii.xl,
          background: "#FFFFFF",
          border: `1px solid ${theme.colors.border.solid}`,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                mb: 0.5,
              }}
            >
              👥 Users Management
            </Typography>
            <Typography variant="body2" color={theme.colors.text.muted}>
              Manage and monitor all system users
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              sx={{
                borderColor: theme.colors.border.solid,
                color: theme.colors.text.primary,
                "&:hover": {
                  borderColor: theme.colors.primary,
                  background: `${theme.colors.primary}10`,
                },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                background: theme.colors.border.gradient,
                color: theme.colors.text.inverse,
                fontWeight: theme.typography.fontWeight.medium,
                "&:hover": {
                  opacity: 0.9,
                },
              }}
              onClick={() => gridRef.current?.api?.exportDataAsCsv()}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box display="flex" gap={2} mb={3}>
          <Box
            flex={1}
            p={2}
            borderRadius={theme.radii.lg}
            sx={{
              background: `${theme.colors.primary}10`,
              border: `1px solid ${theme.colors.primary}30`,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={theme.typography.fontWeight.bold}
              color={theme.colors.primary}
            >
              {totalUsers}
            </Typography>
            <Typography variant="caption" color={theme.colors.text.muted}>
              Total Users
            </Typography>
          </Box>
          <Box
            flex={1}
            p={2}
            borderRadius={theme.radii.lg}
            sx={{
              background: `${theme.colors.states.success}10`,
              border: `1px solid ${theme.colors.states.success}30`,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={theme.typography.fontWeight.bold}
              color={theme.colors.states.success}
            >
              {activeUsers}
            </Typography>
            <Typography variant="caption" color={theme.colors.text.muted}>
              Active Users
            </Typography>
          </Box>
          <Box
            flex={1}
            p={2}
            borderRadius={theme.radii.lg}
            sx={{
              background: `${theme.colors.states.warning}10`,
              border: `1px solid ${theme.colors.states.warning}30`,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={theme.typography.fontWeight.bold}
              color={theme.colors.states.warning}
            >
              {pendingUsers}
            </Typography>
            <Typography variant="caption" color={theme.colors.text.muted}>
              Pending Users
            </Typography>
          </Box>
          <Box
            flex={1}
            p={2}
            borderRadius={theme.radii.lg}
            sx={{
              background: `${theme.colors.states.error}10`,
              border: `1px solid ${theme.colors.states.error}30`,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={theme.typography.fontWeight.bold}
              color={theme.colors.states.error}
            >
              {inactiveUsers}
            </Typography>
            <Typography variant="caption" color={theme.colors.text.muted}>
              Inactive Users
            </Typography>
          </Box>
        </Box>

        {/* Filters Section */}
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search by name, email, or ID..."
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
            sx={{ flex: 1, minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Onboarding</InputLabel>
            <Select
              value={onboardingFilter}
              label="Onboarding"
              onChange={(e) => setOnboardingFilter(e.target.value)}
            >
              <MenuItem value="all">All Onboarding</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{
              borderColor: theme.colors.border.solid,
              color: theme.colors.text.muted,
              "&:hover": {
                borderColor: theme.colors.states.error,
                color: theme.colors.states.error,
              },
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Table */}
<Paper
  elevation={0}
  sx={{
    borderRadius: theme.radii.xl,
    border: `1px solid ${theme.colors.border.solid}`,
    overflow: "hidden",
    pb: 1,
    display: "flex",
    flexDirection: "column",
     height: "100%", 
  }}
>
  <Box
    className="custom-ag-theme ag-theme-quartz"
    sx={{
      flex: 1,
      height: "70vh",
      width: "100%",
      "& .ag-root-wrapper": {
        border: "none",
      },
      "& .ag-header": {
        backgroundColor: "#f9fafb",
        borderBottom: `2px solid ${theme.colors.border.solid}`,
      },
      "& .ag-row": {
        borderBottom: `1px solid ${theme.colors.border.solid}`,
        "&:hover": {
          backgroundColor: "rgba(62, 162, 255, 0.08)",
          cursor: "pointer",
        },
      },
      "& .ag-cell": {
        display: "flex",
        alignItems: "center",
      },
      "& .ag-paging-panel": {
        borderTop: `2px solid ${theme.colors.border.solid}`,
        padding: "12px",
      },
    }}
  >
    <AgGridReact<User>
      ref={gridRef}
      rowData={filteredData}
      columnDefs={columnDefs}
      theme="legacy"
      pagination
      paginationPageSize={15}
      paginationPageSizeSelector={[10, 15, 25, 50]}
      animateRows
      rowHeight={60}
      headerHeight={56}
      defaultColDef={{
        sortable: true,
        resizable: true,
      }}
    />
  </Box>
</Paper>


      {/* User Details Dialog */}
      <UserDetailsDialog
        open={dialogOpen}
        user={selectedUser}
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

export default UsersView;
