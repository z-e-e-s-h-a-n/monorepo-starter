"use client";

import * as React from "react";
import {
  GenericTable,
  type ColumnConfig,
  type ListFilterConfig,
  type SearchByOption,
} from "./GenericTable";
import { useConfirm } from "@workspace/ui/hooks/use-confirm";

interface UseListResult<TKey extends string, TData> {
  data?:
    | (BaseQueryResponse & {
        [K in TKey]: TData[];
      })
    | null;
  isLoading: boolean;
  isFetching?: boolean;
  error?: unknown;
}

interface CreateListPageConfig<
  TData extends BaseResponse,
  TQuery extends BaseQueryType<TQuery>,
  TKey extends string,
> {
  entityType: string;
  dataKey: TKey;
  columns: ColumnConfig<TData>[];
  searchByOptions: SearchByOption[];

  useListHook: (params: TQuery) => UseListResult<TKey, TData>;
  useDeleteHook?: () => {
    remove: (args: { id: string }) => Promise<any>;
    isRemoving: boolean;
  };
  defaultSortBy: TQuery["sortBy"];
  defaultSearchBy: TQuery["searchBy"];

  onView?: (item: TData) => string;
  onEdit?: (item: TData) => string;

  filterConfig?: ListFilterConfig<TQuery>;
}

export function createListPage<
  TData extends BaseResponse,
  TQuery extends BaseQueryType<TQuery>,
  TKey extends string,
>(config: CreateListPageConfig<TData, TQuery, TKey>) {
  return function ListPage() {
    const [page, setPage] = React.useState(1);
    const [limit] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [searchBy, setSearchBy] = React.useState(config.defaultSearchBy);
    const [sortBy, setSortBy] = React.useState(config.defaultSortBy);
    const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");
    const [filter, setFilter] = React.useState<string>();

    const query = {
      page,
      limit,
      search,
      searchBy,
      sortBy,
      sortDir,
      ...(config.filterConfig && filter
        ? { [config.filterConfig.key]: filter }
        : {}),
    } as TQuery;

    const { data, isLoading } = config.useListHook(query);
    const deleteHook = config.useDeleteHook?.();
    const confirm = useConfirm();

    const handleDelete = async (row: TData) => {
      if (!deleteHook) return;
      const ok = await confirm();
      if (!ok) return;
      await deleteHook.remove({ id: row.id });
    };

    return (
      <GenericTable<TData, TQuery>
        data={data?.[config.dataKey] || []}
        totalPages={data?.totalPages || 1}
        currentPage={data?.page || 1}
        isLoading={isLoading}
        entityType={config.entityType}
        columns={config.columns}
        searchByOptions={config.searchByOptions}
        search={search}
        setSearch={setSearch}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
        onPageChange={setPage}
        onDelete={handleDelete}
        filter={filter}
        setFilter={setFilter}
        filterConfig={config.filterConfig}
      />
    );
  };
}
