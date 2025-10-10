"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Search, FileDownload, FilterList } from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, ColDef } from "ag-grid-community";
import { useGetPaymentHistoryQuery } from "@/redux/services/payment-history";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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
};

const PaymentHistory: React.FC = () => {
  const { data, error, isLoading } = useGetPaymentHistoryQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const rowData = useMemo<PaymentRow[]>(() => {
    if (!data?.data) return [];
    const all: PaymentRow[] = [];
    Object.values(data.data).forEach((user: any) => {
      user.records.forEach((r: PaymentRow) => all.push(r));
    });
    return all;
  }, [data]);

  const filteredData = useMemo(() => {
    return rowData.filter((row) => {
      const matchesSearch =
        row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.plan_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || row.payment_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rowData, searchTerm, statusFilter]);

  const StatusRenderer = (props: any) => {
    const status = props.value;
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
  };

  const AmountRenderer = (props: any) => {
    const amount = parseFloat(props.value) / 100;
    return (
      <Typography
        sx={{
          fontWeight: 600,
          color: "#111827",
          fontSize: "0.875rem",
        }}
      >
        ${amount.toFixed(2)}
      </Typography>
    );
  };

  const columnDefs = useMemo<ColDef<PaymentRow>[]>(
    () => [
      {
        headerName: "Customer",
        field: "name",
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => (
          <Box>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
              {params.data.name || "—"}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#6B7280" }}>
              {params.data.email}
            </Typography>
          </Box>
        ),
      },
      {
        headerName: "Plan",
        field: "plan_name",
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: "Amount",
        field: "amount_total",
        filter: "agNumberColumnFilter",
        flex: 0.8,
        minWidth: 100,
        cellRenderer: AmountRenderer,
      },
      {
        headerName: "Credits",
        field: "credits",
        filter: "agNumberColumnFilter",
        flex: 0.8,
        minWidth: 100,
        cellRenderer: (params: any) => (
          <Chip
            label={params.value}
            size="small"
            variant="outlined"
            sx={{
              borderColor: "#3EA2FF",
              color: "#3EA2FF",
              fontWeight: 500,
            }}
          />
        ),
      },
      {
        headerName: "Status",
        field: "payment_status",
        filter: "agTextColumnFilter",
        flex: 0.8,
        minWidth: 100,
        cellRenderer: StatusRenderer,
      },
      {
        headerName: "Date",
        field: "payment_at",
        filter: "agDateColumnFilter",
        flex: 1,
        minWidth: 180,
      },
      {
        headerName: "Country",
        field: "country",
        filter: "agTextColumnFilter",
        flex: 0.6,
        minWidth: 100,
      },
    ],
    []
  );

  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Plan", "Amount", "Credits", "Status", "Date", "Country"],
      ...filteredData.map((row) => [
        row.name || "",
        row.email,
        row.plan_name,
        (parseFloat(row.amount_total) / 100).toFixed(2),
        row.credits,
        row.payment_status,
        row.payment_at,
        row.country,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-history-${Date.now()}.csv`;
    a.click();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "1rem",
        border: "1px solid #E5E7EB",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        background: "#fff",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        mb={3}
        spacing={2}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#111827", mb: 0.5 }}
          >
            Payment History
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            {filteredData.length} transactions found
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#6B7280" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            onClick={handleExport}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            <FileDownload />
          </IconButton>
        </Stack>
      </Stack>

      {isLoading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="#6B7280">Loading payment history...</Typography>
        </Box>
      )}

      {error && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            background: "#FEF2F2",
            borderRadius: "12px",
          }}
        >
          <Typography color="#DC2626" fontWeight={500}>
            Failed to load payment history. Please try again.
          </Typography>
        </Box>
      )}

      {!isLoading && !error && (
        <Box
          className="ag-theme-alpine"
          sx={{
            height: 600,
            width: "100%",
            "& .ag-header": {
              backgroundColor: "#F9FAFB",
              borderBottom: "2px solid #E5E7EB",
            },
            "& .ag-header-cell-label": {
              fontWeight: 600,
              color: "#374151",
            },
            "& .ag-row": {
              borderBottom: "1px solid #F3F4F6",
            },
            "& .ag-row:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          <AgGridReact<PaymentRow>
            rowData={filteredData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50, 100]}
            modules={[AllCommunityModule]}
            rowHeight={60}
            defaultColDef={{
              sortable: true,
              filter: false,
              resizable: true,
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default PaymentHistory;