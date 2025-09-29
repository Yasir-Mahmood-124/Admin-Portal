"use client";

import React, { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { ThemeProvider } from "styled-components"; // or emotion, depending on your setup
import { theme } from "@/theme/theme";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ReduxProvider>
  );
};

export default AppProvider;
