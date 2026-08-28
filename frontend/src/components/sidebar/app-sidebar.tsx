

import * as React from "react"


import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Moon, Sun, TerminalIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import CreateNewChat from "../chat/CreateNewChat";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import DirectMessageList from "../chat/DirectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  const { isDark, toggleTheme } = useThemeStore();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="bg-gradient-primary">
              <a href="#" className="block w-full">
                <div className="flex w-full items-center px-2">
                  <h1 className="text-xl font-bold text-white">Moji</h1>
                  <div className="ml-auto flex items-center gap-2">
                    <Sun className="h-4 w-4 text-white/80" />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-background/80"
                    />
                    <Moon className="size-4 text-white/80" />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* New Chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Group Chat*/}

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Group Chats</SidebarGroupLabel>
          <SidebarGroupAction title="Create Group Chat" className="cursor-pointer">
            <NewGroupChatModal />
          </SidebarGroupAction>
          <SidebarGroupContent>

            <GroupChatList/>

          </SidebarGroupContent>
        </SidebarGroup>
        {/* Direct Chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Friends</SidebarGroupLabel>
          <SidebarGroupAction title="Add Friend" className="cursor-pointer">
            <AddFriendModal/>
          </SidebarGroupAction>
          <SidebarGroupContent>

            <DirectMessageList/>

          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>
      <SidebarFooter>
            {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
