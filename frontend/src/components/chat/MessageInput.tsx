import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send, X } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";
import { chatService } from "@/services/chatService";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const [value, setValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!user) return;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ!");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setSelectedImageFile(file);
    event.target.value = "";
  };

  const sendMessage = async () => {
    const trimmedValue = value.trim();
    if (!trimmedValue && !selectedImageFile) return;

    const currentText = trimmedValue;
    const currentImageFile = selectedImageFile;
    const currentImageUrl = selectedImage;

    setValue("");
    setSelectedImage(null);
    setSelectedImageFile(null);

    try {
      let uploadedImageUrl: string | undefined;

      if (currentImageFile) {
        setIsUploading(true);
        const response = await chatService.uploadMessageImage(currentImageFile);
        uploadedImageUrl = response.imageUrl;
      }

      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];
        await sendDirectMessage(
          otherUser._id,
          currentText,
          uploadedImageUrl || currentImageUrl || undefined
        );
      } else {
        await sendGroupMessage(
          selectedConvo._id,
          currentText,
          uploadedImageUrl || currentImageUrl || undefined
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 min-h-[56px] bg-background">
      {selectedImage && (
        <div className="relative w-fit max-w-[180px] rounded-lg overflow-hidden border border-border bg-muted">
          <img src={selectedImage} alt="preview" className="max-h-28 object-cover" />
          <button
            type="button"
            onClick={() => {
              setSelectedImage(null);
              setSelectedImageFile(null);
            }}
            className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 transition-smooth"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
        </Button>

        <div className="flex-1 relative">
          <Input
            onKeyPress={handleKeyPress}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Soạn tin nhắn..."
            className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none"
          ></Input>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-primary/10 transition-smooth"
            >
              <div>
                <EmojiPicker
                  onChange={(emoji: string) => setValue(`${value}${emoji}`)}
                />
              </div>
            </Button>
          </div>
        </div>

        <Button
          onClick={() => void sendMessage()}
          className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
          disabled={(!value.trim() && !selectedImageFile) || isUploading}
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
