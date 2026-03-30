import {
  IconDashboard,
  IconUsers,
  IconPhoto,
  IconHistory,
  IconUserCircle,
  IconNotification,
} from "@tabler/icons-react";
import type { NavGroup } from "@workspace/contracts";

export const sidebarMenu: NavGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: IconDashboard,
      },
    ],
  },

  {
    groupLabel: "MANAGEMENT",
    items: [
      {
        label: "Users",
        icon: IconUsers,
        children: [
          { label: "Users", href: "/admin/users" },
          { label: "Add User", href: "/admin/users/new" },
        ],
      },

      {
        label: "Media",
        href: "/media",
        icon: IconPhoto,
      },

      {
        label: "Audit Logs",
        href: "/admin/audit-logs",
        icon: IconHistory,
      },
    ],
  },
];

export const footerSidebarMenu: NavGroup[] = [
  {
    items: [
      {
        label: "Account",
        href: "/account",
        icon: IconUserCircle,
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: IconNotification,
      },
    ],
  },
];
