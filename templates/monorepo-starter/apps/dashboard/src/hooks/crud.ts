import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@workspace/sdk/lib/types";
import { parseExpiry } from "@workspace/ui/lib/utils";

/* -------------------------------------------
 * Helpers
 * ------------------------------------------- */
type ApiFn = (...args: any[]) => Promise<ApiResponse<any>>;
type ExtractData<T extends ApiFn> = Awaited<ReturnType<T>>["data"];

const STALE_TIME = parseExpiry("1h");

/* -------------------------------------------
 * CRUD Factory
 * ------------------------------------------- */
export const createCrudHooks = <
  TFindOne extends ApiFn,
  TFindAll extends ApiFn,
  TCreate extends ApiFn,
  TUpdate extends ApiFn,
  TRemove extends ApiFn,
  TRestore extends ApiFn,
>(
  api: {
    findOne: TFindOne;
    findAll: TFindAll;
    create: TCreate;
    update: TUpdate;
    remove: TRemove;
    restore: TRestore;
  },
  keys: {
    single: string;
    list: string;
  }
) => {
  type SingleData = ExtractData<TFindOne>;
  type ListData = ExtractData<TFindAll>;
  type CreateUpdatePayload = Parameters<TCreate>[0];

  /* =========================================================
   * SINGLE (create / update / find one)
   * ======================================================= */
  const useEntity = (id?: string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
      queryKey: [keys.single, id],
      queryFn: () => api.findOne(id!),
      enabled: !!id,
      select: (res) => res.data as SingleData,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: STALE_TIME,
      gcTime: STALE_TIME,
    });

    const mutation = useMutation({
      mutationFn: (data: CreateUpdatePayload) =>
        id ? api.update(id, data) : api.create(data),
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: [keys.list] });

        if (id) {
          queryClient.setQueryData([keys.single, id], res.data);
        }
      },
    });

    return {
      data: query.data,
      isLoading: query.isLoading || mutation.isPending,
      isFetching: query.isFetching,
      error: query.error,
      mutateAsync: mutation.mutateAsync,
    };
  };

  /* =========================================================
   * LIST
   * ======================================================= */
  const useEntities = (...args: Parameters<TFindAll>) => {
    const query = useQuery({
      queryKey: [keys.list, ...args],
      queryFn: () => api.findAll(...args),
      select: (res) => res.data as ListData,
      placeholderData: (prev) => prev,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: STALE_TIME,
      gcTime: STALE_TIME,
    });

    return {
      data: query.data,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error,
    };
  };

  /* =========================================================
   * REMOVE
   * ======================================================= */
  const useRemoveEntity = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, force }: { id: string; force?: boolean }) =>
        api.remove(id, force),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [keys.list] }),
    });

    return {
      remove: mutation.mutateAsync,
      isRemoving: mutation.isPending,
    };
  };

  /* =========================================================
   * RESTORE
   * ======================================================= */
  const useRestoreEntity = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: (id: string) => api.restore(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [keys.list] }),
    });

    return {
      restore: mutation.mutateAsync,
      isRestoring: mutation.isPending,
    };
  };

  return {
    useEntity,
    useEntities,
    useRemoveEntity,
    useRestoreEntity,
  };
};
