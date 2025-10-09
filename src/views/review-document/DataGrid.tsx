import React from "react";
import { Box, Paper } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GridApi } from "ag-grid-community";
import { theme } from "@/theme/theme";
import type { ReviewDocument } from "./ColumnDefinitions";

interface DataGridProps {
  gridRef: React.MutableRefObject<AgGridReact<ReviewDocument> | null>;
  apiRef: React.MutableRefObject<GridApi | null>;
  filteredData: ReviewDocument[];
  columnDefs: ColDef<ReviewDocument>[];
  defaultColDef: ColDef;
}

const DataGrid: React.FC<DataGridProps> = ({
  gridRef,
  apiRef,
  filteredData,
  columnDefs,
  defaultColDef,
}) => {
  return (
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
          theme="legacy"
          onGridReady={(params) => {
            apiRef.current = params.api;
            params.api.sizeColumnsToFit();
            window.addEventListener("resize", () => params.api.sizeColumnsToFit());
          }}
        />
      </Box>

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
    </Paper>
  );
};

export default DataGrid;