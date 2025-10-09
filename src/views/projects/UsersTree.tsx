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
  Card,
  CardContent,
  Divider,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import FolderIcon from "@mui/icons-material/Folder";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { theme } from "@/theme/theme";


interface Project {
  createdAt: string | null;
  project_name: string | null;
  id: string;
  organization_id: string;
}

interface Organization {
  id: string;
  organization_name: string;
  createdAt: string | null;
  projects: Project[];
}

interface User {
  email: string;
  id: string | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string | null;
  organizations: Organization[];
}

interface UsersTreeProps {
  users: User[];
}

const UsersTree: React.FC<UsersTreeProps> = ({ users }) => {
  const [searchText, setSearchText] = useState("");
  const [orgCountFilter, setOrgCountFilter] = useState("all");
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);
  const [expandedOrgs, setExpandedOrgs] = useState<string[]>([]);

  // Get user display name
  const getUserDisplayName = (user: User) => {
    if (user.name) return user.name;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.email;
  };

  // Get user initials
  const getUserInitials = (user: User) => {
    const displayName = getUserDisplayName(user);
    const parts = displayName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search filter
    if (searchText) {
      filtered = filtered.filter((user) => {
        const displayName = getUserDisplayName(user).toLowerCase();
        const email = user.email.toLowerCase();
        const search = searchText.toLowerCase();
        
        return (
          displayName.includes(search) ||
          email.includes(search) ||
          user.organizations.some(
            (org) =>
              org.organization_name.toLowerCase().includes(search) ||
              org.projects.some((p) => p.project_name && p.project_name.toLowerCase().includes(search))
          )
        );
      });
    }

    // Organization count filter
    if (orgCountFilter !== "all") {
      filtered = filtered.filter((user) => {
        const orgCount = user.organizations.length;
        switch (orgCountFilter) {
          case "none":
            return orgCount === 0;
          case "1":
            return orgCount === 1;
          case "2+":
            return orgCount >= 2;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [users, searchText, orgCountFilter]);

  const handleUserAccordionChange = (userId: string) => {
    setExpandedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleOrgAccordionChange = (orgId: string) => {
    setExpandedOrgs((prev) =>
      prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]
    );
  };

  const totalOrganizations = useMemo(
    () => filteredUsers.reduce((sum, user) => sum + user.organizations.length, 0),
    [filteredUsers]
  );

  const totalProjects = useMemo(
    () =>
      filteredUsers.reduce(
        (sum, user) =>
          sum + user.organizations.reduce((orgSum, org) => orgSum + org.projects.length, 0),
        0
      ),
    [filteredUsers]
  );

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {/* Header with Filters */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <PersonIcon sx={{ color: theme.colors.primary }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Users, Organizations & Projects
          </Typography>
          <Chip label={`${filteredUsers.length} Users`} color="primary" size="small" />
          <Chip label={`${totalOrganizations} Organizations`} color="secondary" size="small" />
          <Chip label={`${totalProjects} Projects`} color="info" size="small" />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            placeholder="Search users, organizations, or projects..."
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
            <InputLabel>Organization Count</InputLabel>
            <Select
              value={orgCountFilter}
              label="Organization Count"
              onChange={(e) => setOrgCountFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="none">No Organizations</MenuItem>
              <MenuItem value="1">1 Organization</MenuItem>
              <MenuItem value="2+">2+ Organizations</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Users Tree */}
      <Box sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Accordion
              key={user.id || user.email}
              expanded={expandedUsers.includes(user.id || user.email)}
              onChange={() => handleUserAccordionChange(user.id || user.email)}
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
                  <Avatar
                    sx={{
                      bgcolor: theme.colors.primary,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getUserInitials(user)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {getUserDisplayName(user)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<BusinessIcon />}
                      label={user.organizations.length}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<FolderIcon />}
                      label={user.organizations.reduce(
                        (sum, org) => sum + org.projects.length,
                        0
                      )}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                <Box sx={{ p: 2, backgroundColor: "rgba(0, 0, 0, 0.01)" }}>
                  <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        User ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                      >
                        {user.id || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2">{user.email}</Typography>
                    </Box>
                    {user.createdAt && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Created At
                        </Typography>
                        <Typography variant="body2">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  {user.organizations.length > 0 ? (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 2, color: theme.colors.primary }}
                      >
                        Organizations
                      </Typography>
                      {user.organizations.map((org) => (
                        <Card key={org.id} sx={{ mb: 2, boxShadow: 1 }}>
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <Accordion
                              expanded={expandedOrgs.includes(org.id)}
                              onChange={() => handleOrgAccordionChange(org.id)}
                              sx={{ boxShadow: 0 }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ p: 0, minHeight: "auto", "& .MuiAccordionSummary-content": { my: 1 } }}
                              >
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
                                  <BusinessIcon sx={{ color: theme.colors.secondary }} />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {org.organization_name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ fontFamily: "monospace", color: "text.secondary" }}
                                    >
                                      {org.id}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    icon={<FolderIcon />}
                                    label={`${org.projects.length} Projects`}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                  />
                                </Stack>
                              </AccordionSummary>

                              <AccordionDetails sx={{ p: 0, pt: 2 }}>
                                <Box
                                  sx={{
                                    pl: 2,
                                    borderLeft: `2px solid ${theme.colors.primary}`,
                                    ml: 2,
                                  }}
                                >
                                  {org.projects.length > 0 ? (
                                    <List dense disablePadding>
                                      {org.projects.map((project) => (
                                        <ListItem
                                          key={project.id}
                                          sx={{
                                            mb: 1,
                                            p: 1.5,
                                            backgroundColor: "rgba(0, 0, 0, 0.02)",
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <FolderIcon
                                            sx={{ mr: 2, color: theme.colors.primary }}
                                          />
                                          <Box sx={{ flex: 1 }}>
                                            <Typography
                                              variant="body2"
                                              sx={{ fontWeight: 600 }}
                                            >
                                              {project.project_name}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontFamily: "monospace",
                                                color: "text.secondary",
                                              }}
                                            >
                                              {project.id}
                                            </Typography>
                                          </Box>
                                          <Chip
                                            icon={<CalendarTodayIcon />}
                                            label={
                                              project.createdAt
                                                ? new Date(project.createdAt).toLocaleDateString()
                                                : "N/A"
                                            }
                                            size="small"
                                            variant="outlined"
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ py: 2, textAlign: "center" }}
                                    >
                                      No projects in this organization
                                    </Typography>
                                  )}
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ p: 2, textAlign: "center" }}
                    >
                      No organizations for this user
                    </Typography>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="body1" color="text.secondary">
              No users found
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default UsersTree;