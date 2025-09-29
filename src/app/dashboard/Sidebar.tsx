// src/app/dashboard/Sidebar.tsx
"use client";

import React from "react";
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
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description"; // <-- Added for Review Documents
import { theme } from "@/theme/theme";

const drawerWidth = 260;

const menuItems = [
  { name: "Users", route: "/dashboard/users", icon: <PeopleIcon /> },
  { name: "Organizations", route: "/dashboard/organizations", icon: <BusinessIcon /> },
  { name: "Projects", route: "/dashboard/projects", icon: <WorkIcon /> },
  { name: "Review Documents", route: "/dashboard/review-documents", icon: <DescriptionIcon /> }, // <-- Updated
];

export default function Sidebar() {
  const pathname = usePathname() || "";

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: theme.colors.gradients.ill,
          color: theme.colors.text.primary,
          borderRight: `2px solid transparent`,
          borderImage: theme.colors.border.gradient,
          borderImageSlice: 1,
          paddingTop: theme.spacing(6),
        },
      }}
    >
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary,
            letterSpacing: "0.4px",
          }}
        >
          Admin Panel
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.route);

          return (
            <ListItemButton
              key={item.name}
              component={Link}
              href={item.route}
              sx={{
                borderRadius: theme.radii.lg,
                marginX: theme.spacing(2),
                marginY: theme.spacing(1),
                transition: "all 0.25s ease",
                color: isActive ? theme.colors.text.inverse : theme.colors.text.primary,
                background: isActive ? theme.colors.border.gradient : "transparent",
                boxShadow: isActive ? theme.shadows.sm : "none",
                "&:hover": {
                  transform: "translateX(4px)",
                  background: theme.colors.border.gradient,
                  color: theme.colors.text.inverse,
                  "& .MuiListItemIcon-root": {
                    color: theme.colors.text.inverse,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? theme.colors.text.inverse : theme.colors.primary,
                  minWidth: "44px",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: isActive
                    ? theme.typography.fontWeight.semibold
                    : theme.typography.fontWeight.medium,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
