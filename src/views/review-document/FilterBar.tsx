import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { theme } from "@/theme/theme";

interface FilterBarProps {
  searchText: string;
  setSearchText: (value: string) => void;
  orgFilter: string;
  setOrgFilter: (value: string) => void;
  projectFilter: string;
  setProjectFilter: (value: string) => void;
  docTypeFilter: string;
  setDocTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  orgList: string[];
  projectList: string[];
  docTypeList: string[];
  statusList: string[];
  onClearFilters: () => void;
  onSearch: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchText,
  setSearchText,
  orgFilter,
  setOrgFilter,
  projectFilter,
  setProjectFilter,
  docTypeFilter,
  setDocTypeFilter,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  orgList,
  projectList,
  docTypeList,
  statusList,
  onClearFilters,
  onSearch,
}) => {
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
      <Stack spacing={2}>
        {/* First Row - Search */}
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search by organization, project, email, doc type, status..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.colors.text.muted }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300, flex: 1 }}
          />
        </Box>

        {/* Second Row - Filters */}
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
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
            onClick={onClearFilters}
            sx={{
              borderColor: theme.colors.border.solid,
              color: theme.colors.text.muted,
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default FilterBar;