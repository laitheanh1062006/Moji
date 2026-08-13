

import * as React from "react"


import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TerminalIcon } from "lucide-react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="bg-gradient-primary" >
              <a href="#">
                <div className="flex w-full items-center px-2 justify-center">
                  <h1>Moji</h1>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
      </SidebarContent>
      <SidebarFooter>
            {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
