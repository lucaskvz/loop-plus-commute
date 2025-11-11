import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";

export const ChatFloatingButton = () => {
  const { openOverlay, threads, isOpen } = useChat();
  const location = useLocation();

  const unreadCount = threads.length;

  return (
    <Button
      variant="hero"
      size="icon"
      className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-xl hover:scale-105"
      onClick={() => openOverlay(location.pathname + location.search)}
      aria-label="Open ride chat"
    >
      <MessageCircle className="h-5 w-5" />
      {!isOpen && unreadCount > 0 ? (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-destructive-foreground">
          {unreadCount}
        </span>
      ) : null}
    </Button>
  );
};

