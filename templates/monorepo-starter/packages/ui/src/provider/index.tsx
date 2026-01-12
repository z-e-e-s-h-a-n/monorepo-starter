"use client";

import React from "react";
import ThemeProvider from "./theme";
import ReactQueryProvider from "./react-query";
import { SdkProvider } from "./sdk-provider";
import { AlertDialogProvider } from "./alert-dialog";

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <SdkProvider />
      <ThemeProvider>
        <AlertDialogProvider>{children}</AlertDialogProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};

export default ProviderWrapper;
