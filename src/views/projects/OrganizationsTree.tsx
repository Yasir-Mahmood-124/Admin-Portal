"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BusinessIcon from "@mui/icons-material/Business";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import { theme } from "@/theme/theme";

interface Project {
  createdAt: string;
  project_name: string;
  id: string;
  organization_id: string;
}

interface Organization {
  id: string;
  organization_name: string;
  createdAt: string;
  user_id: string;
  projects: Project[];
}

interface OrganizationsTreeProps {
  organizations: Organization[];
}

const OrganizationsTree: React.FC<OrganizationsTreeProps> = ({ organizations }) => {
  const [searchText, setSearchText] = useState("");
  const [projectCountFilter, setProjectCountFilter] = useState("all");
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

  // Filter organizations
  const filteredOrganizations = useMemo(() => {
    let filtered = organizations;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (org) =>
          org.organization_name.toLowerCase().includes(searchText.toLowerCase()) ||
          org.id.toLowerCase().includes(searchText.toLowerCase()) ||
          org.projects.some((p) =>
            p.project_name.toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }

    // Project count filter
    if (projectCountFilter !== "all") {
      filtered = filtered.filter((org) => {
        const projectCount = org.projects.length;
        switch (projectCountFilter) {
          case "none":
            return projectCount === 0;
          case "1-3":
            return projectCount >= 1 && projectCount <= 3;
          case "4+":
            return projectCount >= 4;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [organizations, searchText, projectCountFilter]);

  const handleAccordionChange = (orgId: string) => {
    setExpandedPanels((prev) =>
      prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]
    );
  };

  const totalProjects = useMemo(
    () => filteredOrganizations.reduce((sum, org) => sum + org.projects.length, 0),
    [filteredOrganizations]
  );

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {/* Header with Filters */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <BusinessIcon sx={{ color: theme.colors.primary }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Organizations & Projects
          </Typography>
          <Chip
            label={`${filteredOrganizations.length} Organizations`}
            color="primary"
            size="small"
          />
          <Chip
            label={`${totalProjects} Projects`}
            color="secondary"
            size="small"
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            placeholder="Search organizations or projects..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Project Count</InputLabel>
            <Select
              value={projectCountFilter}
              label="Project Count"
              onChange={(e) => setProjectCountFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="none">No Projects</MenuItem>
              <MenuItem value="1-3">1-3 Projects</MenuItem>
              <MenuItem value="4+">4+ Projects</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Organizations Tree */}
      <Box sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        {filteredOrganizations.length > 0 ? (
          filteredOrganizations.map((org) => (
            <Accordion
              key={org.id}
              expanded={expandedPanels.includes(org.id)}
              onChange={() => handleAccordionChange(org.id)}
              sx={{
                mb: 2,
                "&:before": { display: "none" },
                boxShadow: 2,
                borderRadius: 1,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                  <BusinessIcon sx={{ color: theme.colors.primary }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {org.organization_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {org.projects.length} {org.projects.length === 1 ? "Project" : "Projects"}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<FolderIcon />}
                    label={org.projects.length}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                <Box sx={{ p: 2, backgroundColor: "rgba(0, 0, 0, 0.01)" }}>
                  <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Organization ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                      >
                        {org.id}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        User ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                      >
                        {org.user_id}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="body2">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  {org.projects.length > 0 ? (
                    <List dense disablePadding>
                      {org.projects.map((project, idx) => (
                        <Card key={project.id} sx={{ mb: 1, boxShadow: 1 }}>
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <FolderIcon sx={{ color: theme.colors.secondary }} />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {project.project_name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontFamily: "monospace", color: "text.secondary" }}
                                >
                                  {project.id}
                                </Typography>
                              </Box>
                              <Stack alignItems="flex-end">
                                <Chip
                                  icon={<CalendarTodayIcon />}
                                  label={new Date(project.createdAt).toLocaleDateString()}
                                  size="small"
                                  variant="outlined"
                                />
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
                      No projects in this organization
                    </Typography>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="body1" color="text.secondary">
              No organizations found
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default OrganizationsTree;