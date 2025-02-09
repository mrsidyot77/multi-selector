// types.ts
export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Message {
  sender: string;
  content: string;
  timestamp: string;
  role: 'auditor' | 'carrier' | 'client';
  attachments?: Attachment[];
}

export interface AuditIssue {
  id: number;
  invoiceNumber: string;
  carrier: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  lastUpdate: string;
  messages: Message[];
}

// FreightAuditChat.tsx
"use client";

import React, { useState, useRef } from "react";
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Mail,
  Archive,
  Filter,
  Search,
  Paperclip,
  X,
  Download,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const FreightAuditChat: React.FC = () => {
  const [selectedIssue, setSelectedIssue] = useState<AuditIssue | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Your existing issues data...
  const issues: AuditIssue[] = [
    {
      id: 1,
      invoiceNumber: "INV-001",
      carrier: "Carrier A",
      status: "open",
      priority: "high",
      lastUpdate: new Date().toISOString(),
      messages: [],
    },
    // Add more issues as needed
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if ((!messageInput.trim() && attachments.length === 0) || !selectedIssue)
      return;

    const newMessage: Message = {
      sender: "Auditor",
      content: messageInput,
      timestamp: new Date().toISOString(),
      role: "auditor",
      attachments: attachments.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      })),
    };

    setSelectedIssue((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
      };
    });

    setMessageInput("");
    setAttachments([]);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Issue List */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-gray-500" />
            <Input placeholder="Search issues..." className="w-full" />
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter issues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Issues</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="open">Open Issues</SelectItem>
              <SelectItem value="pending">Pending Response</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          {issues.map((issue:any) => (
            <Card
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className={`m-2 cursor-pointer transition-all hover:shadow-md ${
                selectedIssue?.id === issue.id
                  ? "border-blue-500 shadow-md"
                  : "border-transparent"
              }`}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {issue.invoiceNumber}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{issue.carrier}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {issue.priority === "high" && (
                      <Badge variant="destructive">High Priority</Badge>
                    )}
                    <Badge
                      variant={
                        issue.status === "open"
                          ? "default"
                          : issue.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {issue.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Last updated: {issue.lastUpdate}
                </div>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedIssue ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedIssue.invoiceNumber}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedIssue.carrier}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedIssue.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "auditor" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Card
                      className={`max-w-[70%] ${
                        message.role === "auditor"
                          ? "bg-blue-50"
                          : "bg-gray-50"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="text-sm font-medium mb-1">
                          {message.sender}
                        </div>
                        <div className="text-sm">{message.content}</div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center gap-2 p-2 bg-white rounded-md"
                              >
                                <Paperclip className="w-4 h-4" />
                                <span className="text-sm truncate">
                                  {attachment.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-auto"
                                  onClick={() =>
                                    window.open(attachment.url, "_blank")
                                  }
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-gray-50">
              {attachments.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Paperclip className="w-3 h-3" />
                      <span className="truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-2" />
              <p>Select an issue to view the conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Issue Details */}
      <div className="w-1/4 border-l bg-white p-4">
        {selectedIssue && (
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <Badge
                  variant={
                    selectedIssue.status === "open"
                      ? "default"
                      : selectedIssue.status === "pending"
                      ? "secondary"
                      : "outline"
                  }
                  className="mt-1"
                >
                  {selectedIssue.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-gray-600">Priority</label>
                <Badge
                  variant={
                    selectedIssue.priority === "high"
                      ? "destructive"
                      : "secondary"
                  }
                  className="mt-1"
                >
                  {selectedIssue.priority}
                </Badge>
              </div>
              <Separator />
              <div>
                <label className="text-sm text-gray-600">Activity Log</label>
                <ScrollArea className="h-[300px] mt-2">
                  <div className="space-y-2">
                    {selectedIssue.messages.map((message, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-gray-600">{message.sender}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FreightAuditChat;