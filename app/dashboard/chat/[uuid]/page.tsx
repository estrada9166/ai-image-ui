"use client";

import Chat from "@/components/chat/Chat";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { uuid } = useParams();
  return <Chat uuid={uuid} />;
}
