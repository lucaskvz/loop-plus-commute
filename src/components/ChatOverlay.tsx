import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock, MapPin, MessageSquare, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/context/ChatContext";

const quickMessages = ["On my way 🚗", "Running late ⏳", "Need to cancel ❌"];

const formatTime = (timestamp: string) =>
  new Date(timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

const formatDate = (timestamp: string) =>
  new Date(timestamp).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

export const ChatOverlay = () => {
  const {
    isOpen,
    threads,
    activeThread,
    openThread,
    closeOverlay,
    sendMessage,
    backToPrevious,
    markBackPath,
    clearActiveThread,
  } = useChat();
  const location = useLocation();
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (isOpen) {
      markBackPath(location.pathname + location.search);
    }
  }, [isOpen, location.pathname, location.search, markBackPath]);

  useEffect(() => {
    if (!isOpen) {
      setDraft("");
    }
  }, [isOpen]);

  const sortedThreads = useMemo(() => threads, [threads]);

  const handleClose = () => {
    const path = backToPrevious();
    closeOverlay();
    if (path && path !== location.pathname + location.search) {
      navigate(path, { replace: false });
    }
  };

  const handleSend = () => {
    if (!activeThread) return;
    sendMessage(activeThread.id, draft);
    setDraft("");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[min(360px,calc(100vw-2rem))] animate-in fade-in slide-in-from-bottom-5">
      <Card className="overflow-hidden border-2 border-primary/40 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 bg-primary/10 py-3">
          <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Back to previous page">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center">
            <CardTitle className="text-base font-semibold">Ride chats</CardTitle>
            <CardDescription className="text-xs">Coordinate pickups in seconds</CardDescription>
          </div>
          <div className="w-9" />
        </CardHeader>

        {!activeThread ? (
          <CardContent className="max-h-[420px] space-y-4 overflow-y-auto p-4">
            {sortedThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
                <MessageSquare className="h-10 w-10 text-primary/40" />
                <p className="text-sm font-medium text-foreground">No rides matched yet</p>
                <p className="text-xs">Offer or join a ride to start a conversation.</p>
              </div>
            ) : (
              sortedThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => openThread(thread.id)}
                  className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-left transition hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{thread.ride.partnerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {thread.ride.origin} → {thread.ride.destination}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {formatTime(thread.ride.departure)}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {thread.messages[thread.messages.length - 1]?.body}
                  </p>
                </button>
              ))
            )}
          </CardContent>
        ) : (
          <>
            <CardContent className="flex flex-col gap-3 bg-background p-4">
              <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {activeThread.ride.origin} → {activeThread.ride.destination}
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {formatTime(activeThread.ride.departure)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {activeThread.ride.partnerName}
                  </span>
                </div>
                <span>Departure {formatDate(activeThread.ride.departure)}</span>
              </div>

              <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
                {activeThread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : message.sender === "system"
                          ? "bg-muted text-muted-foreground"
                          : "bg-secondary/80 text-secondary-foreground"
                      }`}
                    >
                      <p>{message.body}</p>
                      <span className="mt-1 block text-[10px] opacity-70">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {quickMessages.map((label) => (
                  <Button
                    key={label}
                    variant="outline"
                    size="xs"
                    className="text-xs"
                    onClick={() => sendMessage(activeThread.id, label, "me", { quick: true })}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button onClick={handleSend} disabled={!draft.trim()}>
                  Send
                </Button>
              </div>

              <Button variant="ghost" size="sm" className="justify-start text-xs text-muted-foreground" onClick={clearActiveThread}>
                ← All conversations
              </Button>
            </CardContent>
            <CardFooter className="border-t border-border/50 bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground">
              Messages clear 24h after departure. Haptics enabled for quick taps.
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

