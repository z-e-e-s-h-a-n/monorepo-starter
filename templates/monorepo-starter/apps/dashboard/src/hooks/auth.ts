"use client";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@workspace/sdk/auth";
import { parseExpiry } from "@workspace/ui/lib/utils";

const SLATE_TIME = parseExpiry("15m");

const useAuth = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    select: (res) => res.data,
    staleTime: SLATE_TIME,
    gcTime: SLATE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return { currentUser: data, isLoading, isError };
};

export default useAuth;
