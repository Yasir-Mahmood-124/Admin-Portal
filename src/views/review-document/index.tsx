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
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  BusinessRounded as BusinessIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Clear as ClearIcon,
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

// register modules once
ModuleRegistry.registerModules([AllCommunityModule]);

type ReviewDocument = {
  user_id?: string;
  project_name?: string;
  document_type?: string;
  document_type_uuid?: string;
  status?: string;
  organization_name?: string;
  createdAt?: string;
  project_id?: string;
  email?: string;
  s3_url?: string;
};

export default function ReviewDocumentsView() {
  const { data, error, isLoading, refetch } = useGetAll_review_documentsQuery();
  const [getReviewDoc, { isLoading: isDownloading }] = useGet_review_documentMutation();

  // filter states
  const [searchText, setSearchText] = useState("");
  const [orgFilter, setOrgFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [docTypeFilter, setDocTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [downloadLoadingId, setDownloadLoadingId] = useState<string | null>(null);

  const gridRef = useRef<AgGridReact<ReviewDocument> | null>(null);
  const apiRef = useRef<GridApi | null>(null); // GridApi saved on grid ready

  // helper: safe quick-filter setter supporting newer AG Grid API
  const setQuickFilterSafe = useCallback((value: string) => {
    const api = apiRef.current;
    if (!api) return;

    // Prefer setGridOption (newer versions). Fallback to setQuickFilter if present.
    if (typeof (api as any).setGridOption === "function") {
      (api as any).setGridOption("quickFilterText", value);
      // notify grid of change so it applies filters immediately
      if (typeof (api as any).onFilterChanged === "function") {
        (api as any).onFilterChanged();
      } else {
        // ensure rows update
        api.refreshClientSideRowModel?.("filter");
      }
    } else if (typeof (api as any).setQuickFilter === "function") {
      (api as any).setQuickFilter(value);
    } else {
      // last resort: setFilterModel(null) / rely on client-side filtering
      // nothing to do here
    }
  }, []);

  // helper to clear all ag-grid internal filters + quick filter
  const clearGridFilters = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    api.setFilterModel?.(null);
    setQuickFilterSafe("");
  }, [setQuickFilterSafe]);

  // helper lists for dropdowns
  const orgList = useMemo(() => {
    const arr = (data?.documents || []).map((d) => d.organization_name || "");
    return Array.from(new Set(arr)).filter(Boolean).sort();
  }, [data?.documents]);

  const projectList = useMemo(() => {
    const arr = (data?.documents || []).map((d) => d.project_name || "");
    return Array.from(new Set(arr)).filter(Boolean).sort();
  }, [data?.documents]);

  const docTypeList = useMemo(() => {
    const arr = (data?.documents || []).map((d) => d.document_type || "");
    return Array.from(new Set(arr)).filter(Boolean).sort();
  }, [data?.documents]);

  const statusList = useMemo(() => {
    const arr = (data?.documents || []).map((d) => (d.status || "").toLowerCase());
    return Array.from(new Set(arr)).filter(Boolean).sort();
  }, [data?.documents]);

  // Combined filtering (client-side)
  const filteredData = useMemo(() => {
    const rows: ReviewDocument[] = data?.documents || [];

    return rows.filter((r) => {
      // search across organization, project, email, document_type, status
      if (searchText) {
        const q = searchText.trim().toLowerCase();
        const haystack =
          `${r.organization_name ?? ""} ${r.project_name ?? ""} ${r.email ?? ""} ${r.document_type ?? ""} ${r.status ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (orgFilter !== "all" && (r.organization_name ?? "") !== orgFilter) return false;
      if (projectFilter !== "all" && (r.project_name ?? "") !== projectFilter) return false;
      if (docTypeFilter !== "all" && (r.document_type ?? "") !== docTypeFilter) return false;
      if (statusFilter !== "all" && ((r.status ?? "").toLowerCase() !== statusFilter)) return false;

      if (startDate) {
        const sd = new Date(startDate);
        const created = r.createdAt ? new Date(r.createdAt) : null;
        if (!created || created < sd) return false;
      }

      if (endDate) {
        const ed = new Date(endDate);
        ed.setHours(23, 59, 59, 999);
        const created = r.createdAt ? new Date(r.createdAt) : null;
        if (!created || created > ed) return false;
      }

      return true;
    });
  }, [data?.documents, searchText, orgFilter, projectFilter, docTypeFilter, statusFilter, startDate, endDate]);

  // column definitions
  const columnDefs: ColDef<ReviewDocument>[] = useMemo(
    () => [
      {
        headerName: "Organization",
        field: "organization_name",
        flex: 1.2,
        minWidth: 180,
        filter: "agTextColumnFilter",
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.colors.border.gradient,
                color: theme.colors.text.inverse,
              }}
            >
              <BusinessIcon fontSize="small" />
            </Avatar>
            <Typography variant="body2">{params.value ?? "—"}</Typography>
          </Box>
        ),
      },
      {
        headerName: "Project",
        field: "project_name",
        flex: 1,
        minWidth: 160,
        filter: "agTextColumnFilter",
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <WorkIcon fontSize="small" sx={{ color: theme.colors.secondary }} />
            <Typography variant="body2">{params.value ?? "—"}</Typography>
          </Box>
        ),
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1.5,
        minWidth: 220,
        filter: "agTextColumnFilter",
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon fontSize="small" sx={{ color: theme.colors.text.muted }} />
            <Typography variant="body2" noWrap sx={{ maxWidth: 260 }}>
              {params.value ?? "—"}
            </Typography>
          </Box>
        ),
      },
      {
        headerName: "Document Type",
        field: "document_type",
        flex: 1,
        minWidth: 140,
        filter: "agTextColumnFilter",
        cellRenderer: (params: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <DescriptionIcon fontSize="small" sx={{ color: theme.colors.primary }} />
            <Typography variant="body2">{params.value ?? "—"}</Typography>
          </Box>
        ),
      },
      {
        headerName: "Status",
        field: "status",
        flex: 0.8,
        minWidth: 120,
        filter: "agSetColumnFilter",
        cellRenderer: (params: any) => {
          const v = (params.value ?? "").toLowerCase();
          const color =
            v === "pending"
              ? theme.colors.states.warning
              : v === "approved"
              ? theme.colors.states.success
              : theme.colors.states.error;
          return (
            <Box
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: theme.radii.md,
                background: `${color}15`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" sx={{ color, fontWeight: theme.typography.fontWeight.semibold }}>
                {params.value ?? "—"}
              </Typography>
            </Box>
          );
        },
      },
      {
        headerName: "Created At",
        field: "createdAt",
        flex: 1.2,
        minWidth: 170,
        filter: "agDateColumnFilter",
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
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const uuid = params.data?.document_type_uuid ?? "";
          const project_id = params.data?.project_id ?? "";
          const filenameLabel = `${params.data?.document_type ?? "document"}`;

          const onClickDownload = async () => {
            try {
              setDownloadLoadingId(uuid || project_id || "dl");
              const res = await getReviewDoc({
                project_id,
                document_type_uuid: params.data.document_type_uuid,
              }).unwrap();
              // download file helper:
              const byteCharacters = atob(res.docxBase64);
              const byteNumbers = Array.from({ length: byteCharacters.length }).map((_, i) =>
                byteCharacters.charCodeAt(i)
              );
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = res.filename ?? `${filenameLabel}.docx`;
              link.click();
              link.remove();
            } catch (err) {
              console.error("Download failed:", err);
            } finally {
              setDownloadLoadingId(null);
            }
          };

          const loading = isDownloading && downloadLoadingId === uuid;

          return (
            <Button
              variant="contained"
              size="small"
              startIcon={<DownloadIcon />}
              sx={{
                background: theme.colors.primary,
                color: theme.colors.text.inverse,
                fontWeight: theme.typography.fontWeight.medium,
                "&:hover": { background: theme.colors.secondary },
                textTransform: "none",
              }}
              onClick={onClickDownload}
              disabled={Boolean(loading)}
            >
              {loading ? "Downloading..." : "Download"}
            </Button>
          );
        },
      },
    ],
    [getReviewDoc, isDownloading, downloadLoadingId]
  );

  // default column def (no floating filters)
  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    []
  );

  // handlers
  const handleClearFilters = useCallback(() => {
    setSearchText("");
    setOrgFilter("all");
    setProjectFilter("all");
    setDocTypeFilter("all");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    // clear ag-grid internal filters too
    clearGridFilters();
  }, [clearGridFilters]);

  const handleRefresh = useCallback(() => {
    refetch();
    // also clear grid internals to reflect fresh data
    clearGridFilters();
  }, [refetch, clearGridFilters]);

  const handleSearch = useCallback(() => {
    // apply quick filter to AG Grid (so its internal filters also reflect the search)
    setQuickFilterSafe(searchText);
  }, [searchText, setQuickFilterSafe]);

  const totalDocs = data?.documents?.length ?? 0;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: theme.radii.xl,
          background: "#ffffff",
          border: `1px solid ${theme.colors.border.solid}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <DescriptionIcon sx={{ color: theme.colors.primary, fontSize: 28 }} />
            <Box>
              <Typography variant="h5" fontWeight={theme.typography.fontWeight.bold}>
                Review Documents
              </Typography>
              <Typography variant="body2" color={theme.colors.text.muted}>
                Manage documents submitted for review — total{" "}
                <strong style={{ color: theme.colors.primary }}>{totalDocs}</strong>
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{
                borderColor: theme.colors.border.solid,
                color: theme.colors.text.primary,
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => apiRef.current?.exportDataAsCsv()}
              sx={{
                background: theme.colors.border.gradient,
                color: theme.colors.text.inverse,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
          <TextField
            size="small"
            placeholder="Search by organization, project, email, doc type, status..."
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
            sx={{ minWidth: 300, flex: 1 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Organization</InputLabel>
            <Select value={orgFilter} label="Organization" onChange={(e) => setOrgFilter(e.target.value)}>
              <MenuItem value="all">All Organizations</MenuItem>
              {orgList.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Project</InputLabel>
            <Select value={projectFilter} label="Project" onChange={(e) => setProjectFilter(e.target.value)}>
              <MenuItem value="all">All Projects</MenuItem>
              {projectList.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Document Type</InputLabel>
            <Select value={docTypeFilter} label="Document Type" onChange={(e) => setDocTypeFilter(e.target.value)}>
              <MenuItem value="all">All Types</MenuItem>
              {docTypeList.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="all">All Status</MenuItem>
              {statusList.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
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
            sx={{ minWidth: 150 }}
          />
          <TextField
            size="small"
            type="date"
            label="To"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{
              borderColor: theme.colors.border.solid,
              color: theme.colors.text.muted,
            }}
          >
            Clear Filters
          </Button>
        </Stack>
      </Paper>

      {/* Grid */}
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
            width: "100%",
            "& .ag-root-wrapper": { border: "none" },
            "& .ag-header": {
              backgroundColor: "#f9fafb",
              borderBottom: `2px solid ${theme.colors.border.solid}`,
            },
            "& .ag-row:hover": {
              backgroundColor: "rgba(62, 162, 255, 0.08)",
              cursor: "pointer",
            },
            "& .ag-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
        >
          <AgGridReact<ReviewDocument>
            ref={gridRef}
            rowData={filteredData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination
            paginationPageSize={10}
            rowHeight={60}
            headerHeight={56}
            animateRows
            onGridReady={(params) => {
              apiRef.current = params.api;
              params.api.sizeColumnsToFit();
              // keep columns responsive on resize
              window.addEventListener("resize", () => params.api.sizeColumnsToFit());
            }}
          />
        </Box>
      </Paper>

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
}