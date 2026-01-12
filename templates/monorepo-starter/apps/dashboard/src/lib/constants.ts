// navigation.ts
import {
  IconDashboard,
  IconPlane,
  IconBuildingSkyscraper,
  IconCar,
  IconWorld,
  IconMap,
  IconUsers,
  IconSettings,
  type Icon,
  IconHelp,
  IconSearch,
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

export const requiredRoles: UserRole[] = ["admin"];

export const navigation: NavGroup[] = [
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
    groupLabel: "TRAVEL",
    items: [
      {
        title: "Flights",
        icon: IconPlane,
        children: [
          {
            title: "Bookings",
            url: "/flights/bookings",
          },
          {
            title: "Add Booking",
            url: "/flights/bookings/new",
          },
        ],
      },

      {
        title: "Hotels",
        icon: IconBuildingSkyscraper,
        children: [
          {
            title: "Hotels",
            url: "/hotels",
          },
          {
            title: "Rooms",
            url: "/hotels/rooms",
          },
          {
            title: "Bookings",
            url: "/hotels/bookings",
          },
        ],
      },

      {
        title: "Visas",
        icon: IconWorld,
        children: [
          {
            title: "Visa Products",
            url: "/visas/products",
          },
          {
            title: "Bookings",
            url: "/visas/bookings",
          },
        ],
      },

      {
        title: "Tours",
        icon: IconMap,
        children: [
          {
            title: "Tour Packages",
            url: "/tours/packages",
          },
          {
            title: "Bookings",
            url: "/tours/bookings",
          },
        ],
      },

      {
        title: "Transport",
        icon: IconCar,
        children: [
          {
            title: "Sectors",
            url: "/transport/sectors",
          },
          {
            title: "Bookings",
            url: "/transport/bookings",
          },
        ],
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
          { title: "Users", url: "/users" },
          { title: "Add User", url: "/users/add" },
        ],
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
      {
        title: "Get Help",
        url: "/help",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "/search",
        icon: IconSearch,
      },
    ],
  },
];
