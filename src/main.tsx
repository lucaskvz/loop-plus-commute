import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "@/context/UserContext";
import { ChatProvider } from "@/context/ChatContext";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <ChatProvider>
      <App />
    </ChatProvider>
  </UserProvider>,
);
