"use client";

import * as React from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  ArrowUpDown,
  Trash2,
  Eye,
  Edit,
  Plus,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export interface ColumnConfig<TData> {
  header: string;
  accessor: keyof TData | ((row: TData) => React.ReactNode);
  sortKey?: string;
  className?: string;
}

export interface ListFilterConfig<TQuery> {
  key: keyof TQuery;
  label: string;
  options: string[];
}

export interface SearchByOption {
  value: string;
  label: string;
}

interface GenericTableProps<
  TData extends BaseResponse,
  TQuery extends BaseQueryType<TQuery>,
> {
  // data
  data: TData[];
  totalPages: number;
  currentPage: number;
  isLoading?: boolean;

  // config
  entityType: string;
  columns: ColumnConfig<TData>[];
  searchByOptions: SearchByOption[];

  // state
  search: string;
  setSearch: (v: string) => void;
  searchBy: TQuery["searchBy"];
  setSearchBy: (v: TQuery["searchBy"]) => void;
  sortBy: TQuery["sortBy"];
  setSortBy: (v: TQuery["sortBy"]) => void;
  sortDir: sortDirType;
  setSortDir: (v: sortDirType) => void;

  // paging
  onPageChange: (page: number) => void;

  // routes
  onView?: (row: TData) => string;
  onEdit?: (row: TData) => string;

  // delete
  onDelete?: (row: TData) => Promise<void> | void;

  filter?: string;
  setFilter?: (v?: string) => void;
  filterConfig?: ListFilterConfig<TQuery>;
}

export function GenericTable<
  TData extends BaseResponse,
  TQuery extends BaseQueryType<TQuery>,
>({
  data,
  totalPages,
  currentPage,
  isLoading = false,
  entityType,
  columns,
  searchByOptions,
  search,
  setSearch,
  searchBy,
  setSearchBy,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  onPageChange,
  onView = (row) => `/${entityType}/${row.id}`,
  onEdit = (row) => `/${entityType}/${row.id}/edit`,
  onDelete,
  filter,
  setFilter,
  filterConfig,
}: GenericTableProps<TData, TQuery>) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleSort = (col: ColumnConfig<TData>) => {
    if (!col.sortKey) return;

    if (sortBy === col.sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col.sortKey as any);
      setSortDir("desc");
    }
  };

  const handleDelete = async (row: TData) => {
    if (!onDelete) return;
    try {
      setDeletingId(row.id);
      await onDelete(row);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-4">
      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              onPageChange(1);
              setSearch(e.target.value);
            }}
            className="w-64"
          />

          <Select
            value={searchBy as string}
            onValueChange={(v) => {
              onPageChange(1);
              setSearch("");
              setSearchBy(v);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {searchByOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          {filterConfig && setFilter && (
            <Select
              value={filter ?? "all"}
              onValueChange={(v) => {
                onPageChange(1);
                setFilter(v === "all" ? undefined : v);
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder={filterConfig.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterConfig.options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button href={`/${entityType}/new`} className="capitalize">
            <Plus /> New {entityType.replace(/s$/, "")}
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c, i) => (
              <TableHead key={i} className={c.className}>
                {c.sortKey ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(c)}
                    className="px-0"
                  >
                    {c.header}
                    <ArrowUpDown className="ml-1 size-4" />
                  </Button>
                ) : (
                  c.header
                )}
              </TableHead>
            ))}
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length ? (
            data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c, i) => (
                  <TableCell key={i} className={c.className}>
                    {typeof c.accessor === "function"
                      ? c.accessor(row)
                      : (row as any)[c.accessor]}
                  </TableCell>
                ))}

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={onView(row)}>
                          <Eye className="mr-2 size-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={onEdit(row)}>
                          <Edit className="mr-2 size-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => handleDelete(row)}
                          disabled={deletingId === row.id}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          {deletingId === row.id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
