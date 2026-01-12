"use client";

import { useEffect } from "react";
import { setClientUrl } from "@workspace/sdk/lib/api-client";

export function SdkProvider() {
  useEffect(() => {
    setClientUrl(window.location.origin);
  }, []);

  return null;
}
