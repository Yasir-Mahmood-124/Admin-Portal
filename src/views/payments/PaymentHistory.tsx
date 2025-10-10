"use client";

import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  Email as EmailIcon,
  Event as EventIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, ColDef } from "ag-grid-community";
import { useGetPaymentHistoryQuery } from "@/redux/services/payment-history";
import { theme } from "@/theme/theme";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

type PaymentRow = {
  index_id: string;
  currency: string;
  amount_total: string;
  plan_name: string;
  credits: string;
  payment_at: string;
  payment_status: string;
  email: string;
  country: string;
  name?: string;
  lookup_key?: string;
};

// ========== Payment Details Dialog ==========
const PaymentDetailsDialog = ({
  open,
  payment,
  onClose,
}: {
  open: boolean;
  payment: PaymentRow | null;
  onClose: () => void;
}) => {
  if (!payment) return null;

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
            <ReceiptIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Payment Details
            </Typography>
            <Typography variant="body2" color={theme.colors.text.muted}>
              ID: {payment.index_id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Customer Name:</Typography>
            <Typography>{payment.name || "—"}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Email:</Typography>
            <Typography>{payment.email}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Plan:</Typography>
            <Typography>{payment.plan_name}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Amount:</Typography>
            <Typography fontWeight={700} color={theme.colors.primary}>
              ${(parseFloat(payment.amount_total) / 100).toFixed(2)} {payment.currency.toUpperCase()}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Credits:</Typography>
            <Typography>{payment.credits}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Status:</Typography>
            <Chip
              label={payment.payment_status.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: payment.payment_status === "paid" ? "#16A34A15" : "#CA8A0415",
                color: payment.payment_status === "paid" ? "#16A34A" : "#CA8A04",
                fontWeight: 600,
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Country:</Typography>
            <Typography>{payment.country}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Date:</Typography>
            <Typography>
              {new Date(payment.payment_at).toLocaleString("en-US")}
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
const PaymentHistory: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetPaymentHistoryQuery();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const gridRef = useRef<AgGridReact<PaymentRow>>(null);

  // Flatten records from API
  const rowData = useMemo<PaymentRow[]>(() => {
    if (!data?.data) return [];
    const all: PaymentRow[] = [];
    Object.values(data.data).forEach((user: any) => {
      user.records.forEach((r: PaymentRow) => all.push(r));
    });
    return all;
  }, [data]);

  // Get unique values for filters
  const { plans, countries } = useMemo(() => {
    const plans = [...new Set(rowData.map((r) => r.plan_name))].sort();
    const countries = [...new Set(rowData.map((r) => r.country))].sort();
    return { plans, countries };
  }, [rowData]);

  // Apply all filters
  const filteredData = useMemo(() => {
    let filtered = rowData;

    if (searchText) {
      filtered = filtered.filter(
        (row) =>
          row.email.toLowerCase().includes(searchText.toLowerCase()) ||
          row.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          row.plan_name.toLowerCase().includes(searchText.toLowerCase()) ||
          row.index_id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((row) => row.payment_status === statusFilter);
    }

    if (planFilter !== "all") {
      filtered = filtered.filter((row) => row.plan_name === planFilter);
    }

    if (countryFilter !== "all") {
      filtered = filtered.filter((row) => row.country === countryFilter);
    }

    if (startDate) {
      filtered = filtered.filter(
        (row) => new Date(row.payment_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (row) => new Date(row.payment_at) <= new Date(endDate)
      );
    }

    return filtered;
  }, [rowData, searchText, statusFilter, planFilter, countryFilter, startDate, endDate]);

  const handleClearFilters = useCallback(() => {
    setSearchText("");
    setStatusFilter("all");
    setPlanFilter("all");
    setCountryFilter("all");
    setStartDate("");
    setEndDate("");
  }, []);

  const handleViewPayment = useCallback((payment: PaymentRow) => {
    setSelectedPayment(payment);
    setDialogOpen(true);
  }, []);

  // Column Definitions
  const columnDefs = useMemo<ColDef<PaymentRow>[]>(
    () => [
      {
        headerName: "Customer",
        field: "name",
        flex: 1.5,
        minWidth: 220,
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: theme.colors.border.gradient,
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {params.data.name?.charAt(0)?.toUpperCase() || params.data.email.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                {params.data.name || "—"}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: theme.colors.text.muted }}>
                {params.data.email}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        headerName: "Plan",
        field: "plan_name",
        flex: 1,
        minWidth: 140,
        cellRenderer: (params: any) => (
          <Chip
            label={params.value}
            size="small"
            sx={{
              background: `${theme.colors.primary}15`,
              color: theme.colors.primary,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        ),
      },
      {
        headerName: "Amount",
        field: "amount_total",
        flex: 0.8,
        minWidth: 120,
        cellRenderer: (params: any) => {
          const amount = parseFloat(params.value) / 100;
          return (
            <Box display="flex" alignItems="center" gap={0.8}>
              <CreditCardIcon fontSize="small" sx={{ color: theme.colors.primary }} />
              <Typography
                sx={{
                  fontWeight: 600,
                  color: theme.colors.text.primary,
                  fontSize: "0.875rem",
                }}
              >
                ${amount.toFixed(2)}
              </Typography>
            </Box>
          );
        },
      },
      {
        headerName: "Credits",
        field: "credits",
        flex: 0.7,
        minWidth: 100,
        cellRenderer: (params: any) => (
          <Chip
            label={params.value}
            size="small"
            variant="outlined"
            sx={{
              borderColor: theme.colors.secondary,
              color: theme.colors.secondary,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        ),
      },
      {
        headerName: "Status",
        field: "payment_status",
        flex: 0.8,
        minWidth: 110,
        cellRenderer: (params: any) => {
          const status = params.value;
          const chipColor =
            status === "paid"
              ? "#16A34A"
              : status === "pending"
              ? "#CA8A04"
              : "#DC2626";

          return (
            <Chip
              label={status.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: `${chipColor}15`,
                color: chipColor,
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "24px",
              }}
            />
          );
        },
      },
      {
        headerName: "Date",
        field: "payment_at",
        flex: 1.2,
        minWidth: 200,
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
        headerName: "Country",
        field: "country",
        flex: 0.6,
        minWidth: 100,
        cellRenderer: (params: any) => (
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
            {params.value}
          </Typography>
        ),
      },
      {
        headerName: "Actions",
        flex: 0.5,
        minWidth: 90,
        cellRenderer: (params: any) => (
          <IconButton
            size="small"
            onClick={() => handleViewPayment(params.data)}
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
    [handleViewPayment]
  );

  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  if (error) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: theme.radii.xl,
          border: `1px solid ${theme.colors.border.solid}`,
        }}
      >
        <Typography color={theme.colors.states.error} mb={2}>
          Failed to load payment history.
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          sx={{ background: theme.colors.primary }}
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Header & Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: theme.radii.xl,
          background: "#fff",
          border: `1px solid ${theme.colors.border.solid}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <ReceiptIcon sx={{ color: theme.colors.primary, fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Payment History
              </Typography>
              <Typography variant="body2" color={theme.colors.text.muted}>
                {filteredData.length} transactions found
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              disabled={isLoading}
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

        {/* Filters */}
        <Stack direction="row" flexWrap="wrap" gap={2} mb={2}>
          <TextField
            size="small"
            placeholder="Search by name, email, plan, or ID..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.colors.text.muted }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 280 }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Plan</InputLabel>
            <Select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              label="Plan"
            >
              <MenuItem value="all">All Plans</MenuItem>
              {plans.map((plan) => (
                <MenuItem key={plan} value={plan}>
                  {plan}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              label="Country"
            >
              <MenuItem value="all">All Countries</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="date"
            label="From"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 160 }}
          />

          <TextField
            size="small"
            type="date"
            label="To"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 160 }}
          />

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        </Stack>
      </Paper>

      {/* Grid Table */}
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
          <AgGridReact<PaymentRow>
            ref={gridRef}
            rowData={filteredData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination
            paginationPageSize={10}
            rowHeight={60}
            headerHeight={50}
            theme="legacy"
            animateRows
            loading={isLoading}
          />
        </Box>
      </Paper>

      <PaymentDetailsDialog
        open={dialogOpen}
        payment={selectedPayment}
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

export default PaymentHistory;