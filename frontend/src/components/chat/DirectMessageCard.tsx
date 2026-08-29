import React from "react";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";


const DirectMessageCard = ({convo} : {convo: Conversation}) => {
    const {user} = useAuthStore();
    const {activeConversationId, setActiveConversation, messages} = useChatStore();

    if(!user) return null;

    const otherUser = convo.participants.find((p) => p._id !== user._id);
    if(!otherUser) return null;

    const unreadCount = convo.unreadCounts[user._id];
    const lastMessage = convo.lastMessage?.content ?? "";

    const hanldeSelectConversation = async (id:string) =>{
        setActiveConversation(id);
        if(!messages[id]) {

        }
    }


    return <ChatCard
        convoId={convo._id}
        name={otherUser.displayName ?? ""}
        timestamp={
            convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined
        }
        isActive={activeConversationId === convo._id}
        onSelect={hanldeSelectConversation}
        unreadCount={unreadCount}
        leftSection={
            <>
                <UserAvatar type="sidebar" name={otherUser.displayName ?? ""}
                    avatarUrl={otherUser.avatarUrl ?? undefined}
                />
                <StatusBadge status="offline"/>
            </>
        }
        subtitle={
            <p className={cn("text-sm truncate",
                unreadCount > 0 ? "font-medium text foreground" : "text-muted-foreground"
                )}
            >

                {lastMessage}
            </p>
        }
    />;
};

export default DirectMessageCard;