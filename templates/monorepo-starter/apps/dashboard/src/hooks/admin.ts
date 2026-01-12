"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { findAllUsers, createCustomer } from "@workspace/sdk/admin";
import { parseExpiry } from "@workspace/ui/lib/utils";

const STALE_TIME = parseExpiry("15m");
const GC_TIME = parseExpiry("30m");

const useAdmin = (params?: UserQueryType) => {
  const queryClient = useQueryClient();

  /* -------------------------------------------
   * FETCH USERS
   * ------------------------------------------- */
  const usersQuery = useQuery({
    queryKey: ["users", params],
    queryFn: () => findAllUsers(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  /* -------------------------------------------
   * CREATE CUSTOMER
   * ------------------------------------------- */
  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    data: usersQuery.data,
    isLoading: usersQuery.isLoading,
    isFetching: usersQuery.isFetching,
    isError: usersQuery.isError,
    error: usersQuery.error,
    createCustomer: createCustomerMutation.mutateAsync,
    isCreatingCustomer: createCustomerMutation.isPending,
  };
};

export default useAdmin;
