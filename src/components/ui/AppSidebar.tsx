import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem><SidebarMenuButton asChild><Link href="/manage/schools">Schools</Link></SidebarMenuButton></SidebarMenuItem>
          <SidebarMenuItem><SidebarMenuButton asChild><Link href="/manage/teams">Teams</Link></SidebarMenuButton></SidebarMenuItem>
          <SidebarMenuItem><SidebarMenuButton asChild><Link href="/manage/queuers">Teams</Link></SidebarMenuButton></SidebarMenuItem>
          <SidebarMenuItem><SidebarMenuButton asChild><Link href="/manage/matches">Matches</Link></SidebarMenuButton></SidebarMenuItem>
          <SidebarMenuItem><SidebarMenuButton asChild><Link href="/manage/field">Field</Link></SidebarMenuButton></SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}