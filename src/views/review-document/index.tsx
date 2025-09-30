"use client";

import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridApi } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import {
  useGetAll_review_documentsQuery,
  useGet_review_documentMutation,
} from "@/redux/services/reviewDocumentsApi";
import { theme } from "@/theme/theme";

// ✅ Register ag-grid modules once
ModuleRegistry.registerModules([AllCommunityModule]);

type ReviewDocument = {
  user_id: string;
  project_name: string;
  document_type: string;
  document_type_uuid: string;
  status: string;
  organization_name: string;
  createdAt: string;
  project_id: string;
  email: string;
  s3_url: string;
};

const ReviewDocumentsView = () => {
  const { data, error, isLoading, refetch } = useGetAll_review_documentsQuery();
  const [getReviewDoc, { isLoading: isDownloading }] = useGet_review_documentMutation();
  const [searchText, setSearchText] = useState("");

  const gridRef = useRef<AgGridReact<ReviewDocument>>(null);
  const apiRef = useRef<GridApi | null>(null); // ✅ Holds GridApi safely

const handleSearch = useCallback(() => {
  if (apiRef.current) {
    apiRef.current.setGridOption("quickFilterText", searchText);
  }
}, [searchText]);


  // ✅ File download helper
  const downloadFile = (filename: string, base64Data: string) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // ✅ Column Definitions
  const columnDefs: ColDef<ReviewDocument>[] = useMemo(
    () => [
      {
        headerName: "Organization",
        field: "organization_name",
        flex: 1.2,
        minWidth: 180,
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <BusinessIcon fontSize="small" sx={{ color: theme.colors.primary }} />
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        ),
      },
      {
        headerName: "Project",
        field: "project_name",
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <WorkIcon fontSize="small" sx={{ color: theme.colors.secondary }} />
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        ),
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1.5,
        minWidth: 200,
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon fontSize="small" sx={{ color: theme.colors.text.muted }} />
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        ),
      },
      {
        headerName: "Document Type",
        field: "document_type",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        minWidth: 120,
        cellRenderer: (params: any) => (
          <Typography
            sx={{
              fontWeight: theme.typography.fontWeight.medium,
              color:
                params.value === "pending"
                  ? theme.colors.states.warning
                  : params.value === "approved"
                  ? theme.colors.states.success
                  : theme.colors.states.error,
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        headerName: "CreatedAt",
        field: "createdAt",
        flex: 1.2,
        minWidth: 170,
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon fontSize="small" sx={{ color: theme.colors.primary }} />
            <Typography variant="body2">
              {params.value ? new Date(params.value).toLocaleString() : "—"}
            </Typography>
          </Box>
        ),
      },
      {
        headerName: "Actions",
        field: "document_type_uuid",
        flex: 1,
        minWidth: 140,
        cellRenderer: (params: any) => (
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            sx={{
              background: theme.colors.primary,
              color: theme.colors.text.inverse,
              fontWeight: theme.typography.fontWeight.medium,
              "&:hover": { background: theme.colors.secondary },
            }}
            disabled={isDownloading}
            onClick={async () => {
              try {
                const res = await getReviewDoc({
                  project_id: params.data.project_id,
                  document_type_uuid: params.data.document_type_uuid,
                }).unwrap();

                downloadFile(res.filename, res.docxBase64);
              } catch (err) {
                console.error("Download failed:", err);
              }
            }}
          >
            {isDownloading ? "..." : "Download"}
          </Button>
        ),
      },
    ],
    [getReviewDoc, isDownloading]
  );

  const rowData = data?.documents || [];

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: theme.colors.primary, mb: 2 }} />
        <Typography variant="body1" color={theme.colors.text.muted}>
          Loading review documents...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10} color={theme.colors.states.error}>
        <Typography variant="h6">Failed to load review documents.</Typography>
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
          📑 Review Documents
        </Typography>

        {/* Actions */}
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search documents..."
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
        <AgGridReact<ReviewDocument>
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={10}
          animateRows
          rowHeight={55}
          headerHeight={60}
          domLayout="autoHeight"
          onGridReady={(params) => {
            apiRef.current = params.api; // ✅ Save GridApi here
            params.api.sizeColumnsToFit();
            window.addEventListener("resize", () => params.api.sizeColumnsToFit());
          }}
        />
      </Box>

      {/* 🎨 Custom Styling */}
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

export default ReviewDocumentsView;
