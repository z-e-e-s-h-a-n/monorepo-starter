"use client";

import type { ColumnConfig } from "@/components/GenericTable";
import { createListPage } from "@/components/ListPage";
import useAdmin from "@/hooks/admin";
import { UserRoleEnum } from "@workspace/contracts/lib/enums";
import { Badge } from "@workspace/ui/components/badge";

const userColumns: ColumnConfig<UserResponse>[] = [
  {
    header: "Name",
    accessor: (u) => (
      <div className="font-medium max-w-30 truncate" title={u.displayName}>
        {u.displayName}
      </div>
    ),
    sortKey: "name",
  },
  {
    header: "Roles",
    accessor: (u) => (
      <div className="flex items-center gap-2">
        {u.roles.map((r) => (
          <Badge variant="outline">{r}</Badge>
        ))}
      </div>
    ),
    sortKey: "name",
  },
  {
    header: "Email",
    accessor: "email",
    sortKey: "email",
  },
  {
    header: "Phone",
    accessor: (u) => u.phone ?? "—",
    sortKey: "phone",
  },
  {
    header: "Last Login",
    accessor: (user) => new Date(user.lastLoginAt!).toLocaleDateString(),
  },
  {
    header: "Created",
    accessor: (user) => new Date(user.createdAt!).toLocaleDateString(),
    sortKey: "createdAt",
  },
];

const userSearchByOptions = [
  { value: "id", label: "userId" },
  { value: "displayName", label: "Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];

const UserPage = createListPage<UserResponse, UserQueryType, "users">({
  entityType: "users",
  dataKey: "users",
  columns: userColumns,
  searchByOptions: userSearchByOptions,
  useListHook: useAdmin,
  defaultSortBy: "createdAt",
  defaultSearchBy: "displayName",
  filterConfig: {
    key: "role",
    label: "Roles",
    options: UserRoleEnum.options,
  },
});

export default UserPage;
