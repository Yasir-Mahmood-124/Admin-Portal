"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { theme } from "@/theme/theme";

const drawerWidth = 260;

const menuItems = [
  { name: "Dashboard", route: "/dashboard", icon: <DashboardIcon /> },
  { name: "Users", route: "/dashboard/users", icon: <PeopleIcon /> },
  { name: "Organizations", route: "/dashboard/organizations", icon: <BusinessIcon /> },
  { name: "Projects", route: "/dashboard/projects", icon: <WorkIcon /> },
  { name: "Review Documents", route: "/dashboard/review-documents", icon: <DescriptionIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname() || "";
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 80 : drawerWidth,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: collapsed ? 80 : drawerWidth,
          boxSizing: "border-box",
          background: "#FFFFFF",
          color: theme.colors.text.primary,
          borderRight: `1px solid ${theme.colors.border.solid}`,
          paddingTop: theme.spacing(3),
          transition: "width 0.3s ease",
          boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        },
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          px: theme.spacing(3), 
          mb: theme.spacing(4),
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between"
        }}
      >
        {!collapsed && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                background: theme.colors.border.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.4px",
              }}
            >
              Admin Panel
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.muted,
                fontSize: "0.7rem",
              }}
            >
              Management Dashboard
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          size="small"
          sx={{
            color: theme.colors.primary,
            "&:hover": {
              background: `${theme.colors.primary}15`,
            },
          }}
        >
          {collapsed ? <MenuIcon /> : <CloseIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Menu Items */}
      <List sx={{ px: collapsed ? 1 : 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.route || (item.route !== "/dashboard" && pathname.startsWith(item.route));

          return (
            <ListItemButton
              key={item.name}
              component={Link}
              href={item.route}
              sx={{
                borderRadius: theme.radii.lg,
                marginBottom: theme.spacing(1),
                transition: "all 0.2s ease",
                color: isActive ? theme.colors.text.inverse : theme.colors.text.primary,
                background: isActive ? theme.colors.border.gradient : "transparent",
                boxShadow: isActive ? theme.shadows.sm : "none",
                minHeight: "48px",
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 2 : 2,
                "&:hover": {
                  background: isActive ? theme.colors.border.gradient : `${theme.colors.primary}10`,
                  transform: collapsed ? "scale(1.05)" : "translateX(4px)",
                  "& .MuiListItemIcon-root": {
                    color: isActive ? theme.colors.text.inverse : theme.colors.primary,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? theme.colors.text.inverse : theme.colors.primary,
                  minWidth: collapsed ? "auto" : "44px",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && (
                <>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: theme.typography.fontSize.base,
                      fontWeight: isActive
                        ? theme.typography.fontWeight.semibold
                        : theme.typography.fontWeight.medium,
                    }}
                  />
                  {isActive && (
                    <ChevronRightIcon sx={{ fontSize: "1rem", opacity: 0.8 }} />
                  )}
                </>
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Help Section */}
      {!collapsed && (
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: 16,
            right: 16,
            background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.secondary}10)`,
            borderRadius: theme.radii.lg,
            p: 2,
            border: `1px solid ${theme.colors.border.solid}`,
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <HelpOutlineIcon sx={{ fontSize: "1rem", color: theme.colors.primary, mr: 1 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                fontSize: "0.75rem",
              }}
            >
              Need Help?
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: theme.colors.text.muted,
              fontSize: "0.7rem",
              display: "block",
            }}
          >
            Check our documentation
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}