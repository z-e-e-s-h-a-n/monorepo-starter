"use client";

import * as React from "react";
import type { ApiException } from "@workspace/sdk";
import { useConfirm } from "@workspace/ui/hooks/use-confirm";
import GenericTable, { type ColumnConfig } from "./GenericTable";
import type { ListFilterConfig, SearchByOption } from "./SearchToolbar";

interface UseListResult<TKey extends string, TData> {
  data?: BaseQueryResponse & {
    [K in TKey]: TData[];
  };

  isLoading?: boolean;
  fetchError?: unknown;
}

interface ListPageConfig<
  TData extends BaseResponse,
  TQuery extends BaseQueryType,
  TKey extends string,
> {
  entityKey: TKey;
  canEdit?: boolean;
  columns: ColumnConfig<TData, TQuery>[];
  searchByOptions: SearchByOption<TQuery>[];

  defaultParams?: TQuery;
  useListHook: (params: TQuery) => UseListResult<TKey, TData>;
  useDeleteHook?: () => {
    deleteAsync: (args: { id: string; force?: boolean }) => Promise<unknown>;
    isDeleting: boolean;
    deleteError: ApiException | null;
  };

  defaultSortBy: TQuery["sortBy"];
  defaultSearchBy: TQuery["searchBy"];

  filterConfig?: ListFilterConfig<TQuery>;
}

function ListPage<
  TData extends BaseResponse,
  TQuery extends BaseQueryType,
  TKey extends string,
>({
  entityKey,
  canEdit,
  columns,
  defaultSearchBy,
  defaultSortBy,
  searchByOptions,
  useListHook,
  useDeleteHook,
  defaultParams,
  filterConfig,
}: ListPageConfig<TData, TQuery, TKey>) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [searchBy, setSearchBy] =
    React.useState<TQuery["searchBy"]>(defaultSearchBy);
  const [sortBy, setSortBy] = React.useState<TQuery["sortBy"]>(defaultSortBy);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [filter, setFilter] = React.useState<string>();

  const query = {
    ...defaultParams,
    page,
    limit,
    search,
    searchBy,
    sortBy,
    sortOrder,
    ...(filterConfig
      ? { [filterConfig.key]: filter ?? filterConfig.default }
      : {}),
  } as unknown as TQuery;

  const { data, isLoading } = useListHook(query);
  const deleteHook = useDeleteHook?.();
  const { confirm } = useConfirm();

  const handleDelete = async (row: TData) => {
    if (!deleteHook) return;
    const ok = await confirm();
    if (!ok) return;
    await deleteHook.deleteAsync({ id: row.id, force: false });
  };

  const entityTitle = entityKey.split("/").pop();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold capitalize">
          {entityTitle} Management
        </h1>
        <p className="text-muted-foreground">
          Manage your {entityTitle} here. View, edit, or delete existing
          records.
        </p>
      </div>
      <GenericTable
        entityType={entityKey}
        canEdit={canEdit}
        data={data?.[entityKey] || []}
        total={data?.total || 0}
        limit={data?.limit || 10}
        currentPage={data?.page || 1}
        totalPages={data?.totalPages || 1}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        setPage={setPage}
        setLimit={setLimit}
        onDelete={deleteHook ? handleDelete : undefined}
        filter={filter}
        setFilter={setFilter}
        filterConfig={filterConfig}
        columns={columns}
        searchByOptions={searchByOptions}
      />
    </div>
  );
}

export default ListPage;
