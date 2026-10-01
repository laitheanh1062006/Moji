export const validateMessagePayload = ({ content, imgUrl }) => {
  const normalizedContent = typeof content === "string" ? content.trim() : "";
  const normalizedImgUrl = typeof imgUrl === "string" ? imgUrl.trim() : "";

  if (!normalizedContent && !normalizedImgUrl) {
    throw new Error("Message must contain at least one of content or image");
  }

  return {
    content: normalizedContent,
    imgUrl: normalizedImgUrl || undefined,
  };
};

export const updateConversationAfterCreateMessage = (
  conversation,
  message,
  senderId
) => {
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId,
      createdAt: message.createdAt,
    },
  });

  conversation.participants.forEach((p) => {
    const memberId = p.userId.toString();
    const isSender = memberId === senderId.toString();
    const prevCount = conversation.unreadCounts.get(memberId) || 0;
    conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1);
  });
};

export const emitNewMessage = (io, conversation, message) => {
  io.to(conversation._id.toString()).emit("new-message", {
    message,
    conversation: {
      _id: conversation._id,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
    },
    unreadCounts: conversation.unreadCounts,
  });
};
