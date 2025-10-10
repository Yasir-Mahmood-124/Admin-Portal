import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { theme } from "@/theme/theme";

interface PageHeaderProps {
  totalDocs: number;
  onRefresh: () => void;
  onExportCsv: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ totalDocs, onRefresh, onExportCsv }) => {
  return (
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1.5}>
          <DescriptionIcon sx={{ color: theme.colors.primary, fontSize: 28 }} />
          <Box>
            <Typography variant="h5" fontWeight={theme.typography.fontWeight.bold}>
              Review Documents
            </Typography>
            <Typography variant="body2" color={theme.colors.text.muted}>
              Manage documents submitted for review — total{" "}
              <Box component="span" sx={{ color: theme.colors.primary, fontWeight: theme.typography.fontWeight.semibold }}>
                {totalDocs}
              </Box>
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
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
            onClick={onExportCsv}
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
    </Paper>
  );
};

export default PageHeader;