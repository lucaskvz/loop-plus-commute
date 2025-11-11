import { createContext, useContext, useEffect, useMemo, useState } from "react";

type MessageSender = "me" | "partner" | "system";

export type ChatMessage = {
  id: string;
  sender: MessageSender;
  body: string;
  timestamp: string;
  quick?: boolean;
};

export type RideMatch = {
  rideId: string;
  origin: string;
  destination: string;
  departure: string;
  driverName: string;
  partnerName: string;
  role: "driver" | "passenger";
};

export type ChatThread = {
  id: string;
  ride: RideMatch;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

type ChatContextValue = {
  threads: ChatThread[];
  activeThread: ChatThread | null;
  isOpen: boolean;
  previousPath: string | null;
  openOverlay: (fromPath?: string) => void;
  closeOverlay: () => void;
  openThread: (threadId: string, opts?: { fromPath?: string }) => void;
  openThreadForRide: (ride: RideMatch, opts?: { fromPath?: string; initialMessage?: string }) => void;
  sendMessage: (threadId: string, message: string, sender?: MessageSender, opts?: { quick?: boolean }) => void;
  markBackPath: (path: string) => void;
  backToPrevious: () => string | null;
  clearActiveThread: () => void;
};

const THREADS_STORAGE_KEY = "loopPlus:chatThreads";
const EXPIRY_MS = 24 * 60 * 60 * 1000;

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);

const pruneExpired = (threads: ChatThread[]) => {
  const now = Date.now();
  return threads.filter((thread) => {
    const departure = new Date(thread.ride.departure).getTime();
    if (Number.isNaN(departure)) return true;
    return now <= departure + EXPIRY_MS;
  });
};

const readThreads = (): ChatThread[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(THREADS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    return pruneExpired(parsed);
  } catch (error) {
    console.warn("[ChatContext] failed to parse threads", error);
    return [];
  }
};

const persistThreads = (threads: ChatThread[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads));
  } catch (error) {
    console.warn("[ChatContext] failed to persist threads", error);
  }
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [threads, setThreads] = useState<ChatThread[]>(() => readThreads());
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    persistThreads(threads);
  }, [threads]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setThreads((current) => {
        const pruned = pruneExpired(current);
        if (pruned.length === current.length) return current;
        return pruned;
      });
    }, 60 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [threads, activeThreadId],
  );

  const openOverlay: ChatContextValue["openOverlay"] = (fromPath) => {
    if (fromPath) {
      setPreviousPath(fromPath);
    } else if (!previousPath && typeof window !== "undefined") {
      setPreviousPath(window.location.pathname + window.location.search);
    }
    setOpen(true);
  };

  const closeOverlay = () => {
    setOpen(false);
  };

  const ensureThread = (ride: RideMatch) => {
    let exists = false;
    setThreads((current) => {
      const next = current.map((thread) => {
        if (thread.id === ride.rideId) {
          exists = true;
          return { ...thread, ride };
        }
        return thread;
      });
      if (exists) return next;
      const now = new Date().toISOString();
      const intro: ChatMessage = {
        id: createId(),
        sender: "system",
        body: `Loop+ matched you with ${ride.partnerName} for ${ride.origin} → ${ride.destination} at ${new Date(
          ride.departure,
        ).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}.`,
        timestamp: now,
      };
      return [
        ...next,
        {
          id: ride.rideId,
          ride,
          messages: [intro],
          createdAt: now,
          updatedAt: now,
        },
      ];
    });
    return exists;
  };

  const openThread = (threadId: string, opts?: { fromPath?: string }) => {
    openOverlay(opts?.fromPath);
    setActiveThreadId(threadId);
  };

  const openThreadForRide: ChatContextValue["openThreadForRide"] = (ride, opts) => {
    ensureThread(ride);
    openOverlay(opts?.fromPath);
    setActiveThreadId(ride.rideId);
    if (opts?.initialMessage) {
      const message: ChatMessage = {
        id: createId(),
        sender: "partner",
        body: opts.initialMessage,
        timestamp: new Date().toISOString(),
      };
      setThreads((current) =>
        current.map((thread) =>
          thread.id === ride.rideId
            ? {
                ...thread,
                messages: [...thread.messages, message],
                updatedAt: message.timestamp,
              }
            : thread,
        ),
      );
    }
  };

  const sendMessage: ChatContextValue["sendMessage"] = (threadId, message, sender = "me", opts) => {
    if (!message.trim()) return;
    const entry: ChatMessage = {
      id: createId(),
      sender,
      body: message.trim(),
      timestamp: new Date().toISOString(),
      quick: opts?.quick,
    };
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              messages: [...thread.messages, entry],
              updatedAt: entry.timestamp,
            }
          : thread,
      ),
    );

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // ignore
      }
    }
  };

  const markBackPath = (path: string) => setPreviousPath(path);

  const backToPrevious = () => {
    const path = previousPath;
    setPreviousPath(null);
    return path;
  };

  const clearActiveThread = () => setActiveThreadId(null);

  const value = useMemo<ChatContextValue>(
    () => ({
      threads: [...threads].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      activeThread,
      isOpen,
      previousPath,
      openOverlay,
      closeOverlay,
      openThread,
      openThreadForRide,
      sendMessage,
      markBackPath,
      backToPrevious,
      clearActiveThread,
    }),
    [threads, activeThread, isOpen, previousPath],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

