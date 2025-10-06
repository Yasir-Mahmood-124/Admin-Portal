"use client";

import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { theme } from "@/theme/theme";
import { useGetAdminAnalyticsQuery } from "@/redux/services/get_admin_analytics";

// --------------------------------------------
// Stat Card Component
// --------------------------------------------
const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <Card
    sx={{
      background: "#FFFFFF",
      borderRadius: theme.radii.xl,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      border: `1px solid ${theme.colors.border.solid}`,
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: theme.shadows.md,
        transform: "translateY(-2px)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="start" justifyContent="space-between">
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.muted,
              fontWeight: theme.typography.fontWeight.medium,
              mb: 1,
              fontSize: "0.875rem",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              fontSize: "2rem",
              mb: 1,
            }}
          >
            {value.toLocaleString()}
          </Typography>
          {trend && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <TrendingUpIcon
                sx={{ fontSize: "1rem", color: theme.colors.states.success }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: theme.colors.states.success,
                  fontWeight: theme.typography.fontWeight.semibold,
                  fontSize: "0.75rem",
                }}
              >
                {trend}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.colors.text.muted,
                  fontSize: "0.75rem",
                  ml: 0.5,
                }}
              >
                vs last month
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: theme.radii.lg,
            background: `${color}15`,
          }}
        >
          <Icon sx={{ fontSize: "1.5rem", color }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// --------------------------------------------
// Recent Activity Component
// --------------------------------------------
const RecentActivityItem = ({ icon: Icon, action, time, color }: any) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "start",
      gap: 2,
      p: 2,
      borderRadius: theme.radii.lg,
      transition: "all 0.2s ease",
      "&:hover": {
        background: `${theme.colors.primary}05`,
      },
    }}
  >
    <Box
      sx={{
        p: 1,
        borderRadius: theme.radii.md,
        background: `${color}15`,
      }}
    >
      <Icon sx={{ fontSize: "1.25rem", color }} />
    </Box>
    <Box flex={1}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.text.primary,
          fontSize: "0.875rem",
        }}
      >
        {action}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: theme.colors.text.muted,
          fontSize: "0.75rem",
          mt: 0.5,
          display: "block",
        }}
      >
        {time}
      </Typography>
    </Box>
  </Box>
);

// --------------------------------------------
// Dashboard Page Component
// --------------------------------------------
export default function DashboardPage() {
  const { data, error, isLoading } = useGetAdminAnalyticsQuery();

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress sx={{ color: theme.colors.primary }} />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography color="error" textAlign="center" variant="h6">
          Failed to load analytics. Please try again.
        </Typography>
      </Box>
    );

  const barChartData = [
    { category: "Users", count: data?.users_count ?? 0 },
    { category: "Organizations", count: data?.organizations_count ?? 0 },
    { category: "Projects", count: data?.projects_count ?? 0 },
    { category: "Documents", count: data?.reviewDocuments_count ?? 0 },
  ];

  const trendData = [
    { month: "Jan", users: 40, projects: 25 },
    { month: "Feb", users: 55, projects: 35 },
    { month: "Mar", users: 65, projects: 50 },
    { month: "Apr", users: 80, projects: 70 },
    { month: "May", users: 100, projects: 90 },
  ];

  const documentStatusData = [
    { name: "Pending", value: 25, color: theme.colors.secondary },
    { name: "Approved", value: 60, color: theme.colors.states.success },
    { name: "Rejected", value: 15, color: theme.colors.states.error },
  ];

  const recentActivities = [
    { icon: PeopleIcon, action: "New user registration", time: "2 minutes ago", color: theme.colors.primary },
    { icon: WorkIcon, action: "Project created", time: "15 minutes ago", color: theme.colors.states.success },
    { icon: DescriptionIcon, action: "Document reviewed", time: "1 hour ago", color: theme.colors.secondary },
    { icon: BusinessIcon, action: "Organization verified", time: "3 hours ago", color: theme.colors.states.info },
  ];

  return (
    <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, mb: 1 }}>
          Welcome to the Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
          Here's a comprehensive overview of your system analytics and recent activity.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={4} flexWrap="wrap" useFlexGap>
        <StatCard title="Total Users" value={data?.users_count ?? 0} icon={PeopleIcon} trend="+12.5%" color={theme.colors.primary} />
        <StatCard title="Organizations" value={data?.organizations_count ?? 0} icon={BusinessIcon} trend="+8.2%" color={theme.colors.secondary} />
        <StatCard title="Active Projects" value={data?.projects_count ?? 0} icon={WorkIcon} trend="+15.3%" color={theme.colors.states.success} />
        <StatCard title="Documents" value={data?.reviewDocuments_count ?? 0} icon={DescriptionIcon} trend="+22.1%" color={theme.colors.states.warning} />
      </Stack>

      {/* Charts Section */}
      <Stack direction={{ xs: "column", lg: "row" }} spacing={3} mb={4}>
        {/* Bar Chart */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: theme.radii.xl,
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: `1px solid ${theme.colors.border.solid}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, mb: 3 }}>
            System Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fill: theme.colors.text.muted, fontSize: 12 }} />
              <YAxis tick={{ fill: theme.colors.text.muted, fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "white", border: `1px solid ${theme.colors.border.solid}`, borderRadius: theme.radii.md, boxShadow: theme.shadows.md }} />
              <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.colors.primary} />
                  <stop offset="100%" stopColor={theme.colors.secondary} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Line Chart */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: theme.radii.xl,
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: `1px solid ${theme.colors.border.solid}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, mb: 3 }}>
            Growth Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fill: theme.colors.text.muted, fontSize: 12 }} />
              <YAxis tick={{ fill: theme.colors.text.muted, fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "white", border: `1px solid ${theme.colors.border.solid}`, borderRadius: theme.radii.md, boxShadow: theme.shadows.md }} />
              <Legend />
              <Line type="monotone" dataKey="users" stroke={theme.colors.primary} strokeWidth={3} dot={{ fill: theme.colors.primary, r: 4 }} />
              <Line type="monotone" dataKey="projects" stroke={theme.colors.secondary} strokeWidth={3} dot={{ fill: theme.colors.secondary, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Stack>

      {/* Bottom Section */}
      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        {/* Document Status */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: theme.radii.xl,
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: `1px solid ${theme.colors.border.solid}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, mb: 3 }}>
            Document Status
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={documentStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {documentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <Box mt={3}>
            {documentStatusData.map((item) => (
              <Box key={item.name} display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Box display="flex" alignItems="center">
                  <FiberManualRecordIcon sx={{ fontSize: "0.75rem", color: item.color, mr: 1 }} />
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary, fontSize: "0.875rem" }}>
                    {item.name}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, fontSize: "0.875rem" }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Recent Activity */}
        <Paper
          sx={{
            flex: 2,
            p: 3,
            borderRadius: theme.radii.xl,
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: `1px solid ${theme.colors.border.solid}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, mb: 2 }}>
            Recent Activity
          </Typography>
          <Box>
            {recentActivities.map((activity, index) => (
              <RecentActivityItem key={index} {...activity} />
            ))}
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}
