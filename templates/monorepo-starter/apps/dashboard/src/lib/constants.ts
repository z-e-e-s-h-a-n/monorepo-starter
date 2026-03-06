import {
  IconDashboard,
  IconUsers,
  IconSettings,
  type Icon,
  IconPhoto,
} from "@tabler/icons-react";

export type NavItem = {
  title: string;
  url?: string;
  icon?: Icon;
  children?: NavItem[];
};

export interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export const sidebarMenu: NavGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
    ],
  },

  {
    groupLabel: "MANAGEMENT",
    items: [
      {
        title: "Users",
        icon: IconUsers,
        children: [
          { title: "Users", url: "/admin/users" },
          { title: "Add User", url: "/admin/users/new" },
        ],
      },

      {
        title: "Media",
        url: "/media",
        icon: IconPhoto,
      },
    ],
  },

  {
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: IconSettings,
      },
    ],
  },
];
