"use client";

import { navigation } from "@/lib/constants";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@workspace/ui/components/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const NavMain = () => {
  return navigation.map(({ items, groupLabel }, i) => (
    <SidebarGroup
      key={i}
      className={cn(i === navigation.length - 1 ? "mt-auto" : "")}
    >
      <SidebarGroupContent className="flex flex-col gap-2">
        {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarMenuItem key={item.title}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "",
                      item.title === "Dashboard" &&
                        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                    )}
                    asChild
                  >
                    {item.children ? (
                      <div>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.children && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </div>
                    ) : (
                      <Link href={item.url!}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.children && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {item.children && (
                    <SidebarMenuSub>
                      {item.children.map((i) => (
                        <SidebarMenuSubItem key={i.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={i.url || ""}>
                              <span>{i.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
};

export default NavMain;
