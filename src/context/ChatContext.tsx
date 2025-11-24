import { createContext, useContext, useState, useCallback } from "react";

type ChatContextValue = {
  openOverlay: (returnPath?: string) => void;
  closeOverlay: () => void;
  isOpen: boolean;
  openThreadForRide: (rideInfo: {
    rideId: string;
    origin: string;
    destination: string;
    departure: string;
    driverName: string;
    partnerName: string;
    role: "driver" | "passenger";
  }, options?: { initialMessage?: string }) => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [returnPath, setReturnPath] = useState<string | undefined>();

  const openOverlay = useCallback((path?: string) => {
    setReturnPath(path);
    setIsOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setIsOpen(false);
    setReturnPath(undefined);
  }, []);

  const openThreadForRide = useCallback(
    (
      rideInfo: {
        rideId: string;
        origin: string;
        destination: string;
        departure: string;
        driverName: string;
        partnerName: string;
        role: "driver" | "passenger";
      },
      options?: { initialMessage?: string }
    ) => {
      // For MVP, just open the overlay - chat functionality can be added later
      openOverlay();
    },
    [openOverlay]
  );

  const value = {
    openOverlay,
    closeOverlay,
    isOpen,
    openThreadForRide,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

