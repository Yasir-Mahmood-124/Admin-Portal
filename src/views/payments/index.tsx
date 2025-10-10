import React from "react";
import BalanceCard from "./BalanceCard";
import { Box } from "@mui/material";

const PaymentsView = () => {
  return (
    <Box sx={{ p: 4, background: "#F9FAFB", minHeight: "100vh" }}>
      <BalanceCard />
    </Box>
  );
};

export default PaymentsView;
