"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Typography,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridReadyEvent, IDateFilterParams } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { theme } from "@/theme/theme";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Project {
  createdAt: string;
  project_name: string;
  id: string;
  organization_id: string;
}

interface AllProjectsGridProps {
  projects: Project[];
}

const AllProjectsGrid: React.FC<AllProjectsGridProps> = ({ projects }) => {
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [gridApi, setGridApi] = useState<any>(null);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchText("");
    setDateFilter("all");
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `projects_export_${new Date().toISOString().split("T")[0]}.csv`,
      });
    }
  };

  // Filter projects based on search and date
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (p) =>
          p.project_name.toLowerCase().includes(searchText.toLowerCase()) ||
          p.id.toLowerCase().includes(searchText.toLowerCase()) ||
          p.organization_id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((p) => {
        const createdDate = new Date(p.createdAt);
        const diffTime = Math.abs(now.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "today":
            return diffDays <= 1;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          case "year":
            return diffDays <= 365;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [projects, searchText, dateFilter]);

  const columnDefs: ColDef<Project>[] = useMemo(
    () => [
      {
        headerName: "Project Name",
        field: "project_name",
        flex: 2,
        minWidth: 200,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        cellStyle: { fontWeight: 600 },
        filterParams: {
          buttons: ["reset", "apply"],
          closeOnApply: true,
        },
      },
      {
        headerName: "Project ID",
        field: "id",
        flex: 2,
        minWidth: 250,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        cellStyle: { fontFamily: "monospace", fontSize: "0.9rem" },
        filterParams: {
          buttons: ["reset", "apply"],
          closeOnApply: true,
        },
      },
      {
        headerName: "Organization ID",
        field: "organization_id",
        flex: 2,
        minWidth: 250,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        cellStyle: { fontFamily: "monospace", fontSize: "0.9rem" },
        filterParams: {
          buttons: ["reset", "apply"],
          closeOnApply: true,
        },
      },
      {
        headerName: "Created At",
        field: "createdAt",
        flex: 1.5,
        minWidth: 200,
        filter: "agDateColumnFilter",
        floatingFilter: true,
        sort: "desc",
        valueFormatter: (params) =>
          params.value ? new Date(params.value).toLocaleString() : "—",
        filterParams: {
          buttons: ["reset", "apply"],
          closeOnApply: true,
          comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
            const cellDate = new Date(cellValue);
            cellDate.setHours(0, 0, 0, 0);
            filterLocalDateAtMidnight.setHours(0, 0, 0, 0);
            
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            }
            return 0;
          },
        } as IDateFilterParams,
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    []
  );

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {/* Header with Filters */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <FilterListIcon sx={{ color: theme.colors.primary }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Projects List
          </Typography>
          <Chip
            label={`${filteredProjects.length} of ${projects.length} Projects`}
            color="primary"
            size="small"
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search by project name, project ID, or organization ID..."
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 300 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateFilter}
              label="Date Range"
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Clear all filters">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              disabled={!searchText && dateFilter === "all"}
            >
              Clear
            </Button>
          </Tooltip>

          <Tooltip title="Export to CSV">
            <Button
              variant="contained"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
            >
              Export
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      {/* AG Grid */}
      <Box className="ag-theme-quartz" sx={{ height: "65vh", width: "100%" }}>
        <AgGridReact<Project>
          rowData={filteredProjects}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows
          onGridReady={onGridReady}
          rowSelection="multiple"
          enableCellTextSelection
          ensureDomOrder
          suppressMenuHide
          suppressMovableColumns={false}
          enableRangeSelection
        />
      </Box>
    </Paper>
  );
};

export default AllProjectsGrid;