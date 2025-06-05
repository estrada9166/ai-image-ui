"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "urql";
import { graphql } from "@/gql/gql";
import InfiniteScroll from "react-infinite-scroll-component";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// GraphQL queries
const ChatsQuery = graphql(/* GraphQL */ `
  query UserChats($first: Int!, $after: String) {
    me {
      id
      chats(first: $first, after: $after) {
        edges {
          node {
            id
            title
            messages(last: 3) {
              edges {
                node {
                  id
                  message {
                    __typename
                    ... on Image {
                      id
                      imagePrompt: prompt
                      thumbnailUrl
                      status
                    }
                    ... on Video {
                      id
                      videoPrompt: prompt
                      status
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`);

const CreateChatMutation = graphql(/* GraphQL */ `
  mutation CreateChat {
    createChat {
      id
    }
  }
`);

export default function Chats() {
  const router = useRouter();
  const { toast } = useToast();

  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [after, setAfter] = useState<string | null>(null);

  const [{ data, fetching }] = useQuery({
    query: ChatsQuery,
    variables: { first: 20, after },
  });

  const [, createChat] = useMutation(CreateChatMutation);

  const handleCreateChat = async () => {
    setIsCreatingChat(true);
    try {
      const result = await createChat({});
      if (result.data?.createChat) {
        router.push(`/dashboard/chat/${result.data.createChat.id}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to create new chat",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive",
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  if (
    fetching &&
    (!data?.me?.chats?.edges || data.me.chats.edges.length === 0)
  ) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">
            Loading your conversations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold">Your Conversations</h1>
          <p className="text-muted-foreground">
            Continue your creative journey with AI
          </p>
        </div>
        <Button onClick={handleCreateChat} disabled={isCreatingChat}>
          {isCreatingChat ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          New Chat
        </Button>
      </div>

      {/* Chats List with empty state */}
      {!data?.me?.chats?.edges || data.me.chats.edges.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <MessageCircle className="h-12 w-12 mx-auto text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No conversations yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your first conversation and explore the possibilities of
              AI-powered creativity
            </p>
            <Button onClick={handleCreateChat} disabled={isCreatingChat}>
              {isCreatingChat ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Your First Chat
            </Button>
          </div>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={data?.me?.chats?.edges.length ?? 0}
          next={() => {
            if (data?.me?.chats?.pageInfo.endCursor) {
              setAfter(data.me.chats.pageInfo.endCursor);
            }
          }}
          hasMore={data?.me?.chats?.pageInfo.hasNextPage ?? false}
          loader={
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          }
          className="pb-6"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.me?.chats?.edges.map((chat) => {
              const lastMessages = chat.node.messages.edges.map(
                (message) => message.node.message
              );

              return (
                <Link
                  href={`/dashboard/chat/${chat.node.id}`}
                  key={chat.node.id}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden border-2 hover:border-primary/50 h-52">
                    <div className="p-5 space-y-2 flex flex-col h-full">
                      <h3 className="font-medium truncate text-sm">
                        {chat.node.title || "Untitled Chat"}
                      </h3>
                      <div className="space-y-1 flex-grow overflow-hidden">
                        {lastMessages.map((message, i) => (
                          <p
                            key={i}
                            className="text-sm text-muted-foreground line-clamp-2 italic"
                          >
                            {message
                              ? (message.__typename === "Image"
                                  ? message.imagePrompt
                                  : message.videoPrompt
                                )?.slice(0, 80) || ""
                              : null}
                            {message &&
                              (message.__typename === "Image"
                                ? (message.imagePrompt?.length ?? 0) > 80
                                : (message.videoPrompt?.length ?? 0) > 80) &&
                              "..."}
                          </p>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground mt-auto">
                        <span>
                          {lastMessages.length > 0 &&
                          lastMessages[0]?.__typename === "Image"
                            ? "🖼️ Image"
                            : lastMessages[0]?.__typename === "Video"
                            ? "🎬 Video"
                            : null}
                        </span>
                        <span>Open →</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
