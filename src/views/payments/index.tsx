"use client";

import React from "react";
import { Box, Container, Typography, Breadcrumbs, Link } from "@mui/material";
import { NavigateNext, Dashboard } from "@mui/icons-material";
import BalanceCard from "./BalanceCard";
import PaymentHistory from "./PaymentHistory";

const PaymentsView: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(235.78% 49.76% at -12.5% 110.55%, rgba(251, 86, 145, 0.08) 0%, rgba(255, 255, 255, 0) 100%),
          radial-gradient(150.9% 61.56% at 89.65% -24.61%, rgba(95, 176, 254, 0.08) 0%, rgba(255, 255, 255, 0) 100%),
          #FFFFFF
        `,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            underline="hover"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#6B7280",
              fontSize: "0.875rem",
            }}
            href="/admin"
          >
            <Dashboard sx={{ mr: 0.5, fontSize: 18 }} />
            Dashboard
          </Link>
          <Typography
            sx={{
              color: "#111827",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Payments
          </Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Payment Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              fontSize: "1rem",
            }}
          >
            Monitor your revenue, track transactions, and manage your financial
            operations
          </Typography>
        </Box>

        {/* Balance Cards */}
        <BalanceCard />

        {/* Payment History Table */}
        <PaymentHistory />
      </Container>
    </Box>
  );
};

export default PaymentsView;