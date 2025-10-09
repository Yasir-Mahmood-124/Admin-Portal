import React from "react";
import { Box, Typography, Avatar, Button } from "@mui/material";
import {
  BusinessRounded as BusinessIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  GetApp as DownloadIcon,
} from "@mui/icons-material";
import type { ColDef } from "ag-grid-community";
import { theme } from "@/theme/theme";

export type ReviewDocument = {
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

export const getColumnDefinitions = (
  getReviewDoc: any,
  isDownloading: boolean,
  downloadLoadingId: string | null,
  setDownloadLoadingId: (id: string | null) => void
): ColDef<ReviewDocument>[] => [
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
    filter: "agTextColumnFilter", // Changed from agSetColumnFilter (Enterprise only)
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
          
          // Download file helper
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
];