
"use client";

import React, { useMemo, useState, useCallback, useRef } from "react";
import { Box } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridApi } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import {
  useGetAll_review_documentsQuery,
  useGet_review_documentMutation,
} from "@/redux/services/reviewDocumentsApi";

// Import sub-components
import PageHeader from "./PageHeader";
import FilterBar from "./FilterBar";
import DataGrid from "./DataGrid";
import { getColumnDefinitions, type ReviewDocument } from "./ColumnDefinitions";

// Register modules once
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ReviewDocumentsView() {
  const { data, error, isLoading, refetch } = useGetAll_review_documentsQuery();
  const [getReviewDoc, { isLoading: isDownloading }] = useGet_review_documentMutation();

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [orgFilter, setOrgFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [docTypeFilter, setDocTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [downloadLoadingId, setDownloadLoadingId] = useState<string | null>(null);

  const gridRef = useRef<AgGridReact<ReviewDocument> | null>(null);
  const apiRef = useRef<GridApi | null>(null);

  // Helper: safe quick-filter setter
  const setQuickFilterSafe = useCallback((value: string) => {
    const api = apiRef.current;
    if (!api) return;

    if (typeof (api as any).setGridOption === "function") {
      (api as any).setGridOption("quickFilterText", value);
      if (typeof (api as any).onFilterChanged === "function") {
        (api as any).onFilterChanged();
      } else {
        api.refreshClientSideRowModel?.("filter");
      }
    } else if (typeof (api as any).setQuickFilter === "function") {
      (api as any).setQuickFilter(value);
    }
  }, []);

  // Helper to clear all ag-grid internal filters
  const clearGridFilters = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    api.setFilterModel?.(null);
    setQuickFilterSafe("");
  }, [setQuickFilterSafe]);

  // Filter lists for dropdowns
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

  // Column definitions with download handler
  const columnDefs = useMemo(
    () => getColumnDefinitions(getReviewDoc, isDownloading, downloadLoadingId, setDownloadLoadingId),
    [getReviewDoc, isDownloading, downloadLoadingId]
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    []
  );

  // Handlers
  const handleClearFilters = useCallback(() => {
    setSearchText("");
    setOrgFilter("all");
    setProjectFilter("all");
    setDocTypeFilter("all");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    clearGridFilters();
  }, [clearGridFilters]);

  const handleRefresh = useCallback(() => {
    refetch();
    clearGridFilters();
  }, [refetch, clearGridFilters]);

  const handleSearch = useCallback(() => {
    setQuickFilterSafe(searchText);
  }, [searchText, setQuickFilterSafe]);

  const totalDocs = data?.documents?.length ?? 0;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <PageHeader
        totalDocs={totalDocs}
        onRefresh={handleRefresh}
        onExportCsv={() => apiRef.current?.exportDataAsCsv()}
      />

      <FilterBar
        searchText={searchText}
        setSearchText={setSearchText}
        orgFilter={orgFilter}
        setOrgFilter={setOrgFilter}
        projectFilter={projectFilter}
        setProjectFilter={setProjectFilter}
        docTypeFilter={docTypeFilter}
        setDocTypeFilter={setDocTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        orgList={orgList}
        projectList={projectList}
        docTypeList={docTypeList}
        statusList={statusList}
        onClearFilters={handleClearFilters}
        onSearch={handleSearch}
      />

      <DataGrid
        gridRef={gridRef}
        apiRef={apiRef}
        filteredData={filteredData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </Box>
  );
}