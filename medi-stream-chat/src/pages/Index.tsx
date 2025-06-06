"use client"

import Header from '@/components/Header';
import InputBar from '@/components/InputBar';
import MessageArea from '@/components/MessageArea';
import React, { useState } from 'react';

interface SearchInfo {
  stages: string[];
  query: string;
  urls: string[];
  error?: string;
}

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  type: string;
  isLoading?: boolean;
  searchInfo?: SearchInfo;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Hello! I\'m your AI Medical Assistant. I can help you with medical questions, health information, and provide evidence-based guidance. How can I assist you today?',
      isUser: false,
      type: 'message'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [checkpointId, setCheckpointId] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      // First add the user message to the chat
      const newMessageId = messages.length > 0 ? Math.max(...messages.map(msg => msg.id)) + 1 : 1;

      setMessages(prev => [
        ...prev,
        {
          id: newMessageId,
          content: currentMessage,
          isUser: true,
          type: 'message'
        }
      ]);

      const userInput = currentMessage;
      setCurrentMessage(""); // Clear input field immediately

      try {
        // Create AI response placeholder
        const aiResponseId = newMessageId + 1;
        setMessages(prev => [
          ...prev,
          {
            id: aiResponseId,
            content: "",
            isUser: false,
            type: 'message',
            isLoading: true,
            searchInfo: {
              stages: [],
              query: "",
              urls: []
            }
          }
        ]);

        // Create URL with checkpoint ID if it exists
        let url = `http://0.0.0.0:5050/chat_stream/${encodeURIComponent(userInput)}`;
        if (checkpointId) {
          url += `?checkpoint_id=${encodeURIComponent(checkpointId)}`;
        }

        // Connect to SSE endpoint using EventSource
        const eventSource = new EventSource(url);
        let streamedContent = "";
        let searchData: SearchInfo | null = null;
        let hasReceivedContent = false;

        // Process incoming messages
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            console.log("Received data:", data.content);

            if (data.type === 'checkpoint') {
              // Store the checkpoint ID for future requests
              setCheckpointId(data.checkpoint_id);
            }
            else if (data.type === 'content') {
              streamedContent += data.content;
              hasReceivedContent = true;

              // Update message with accumulated content
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiResponseId
                    ? { ...msg, content: streamedContent, isLoading: false }
                    : msg
                )
              );
            }
            else if (data.type === 'search_start') {
              // Create search info with 'searching' stage
              const newSearchInfo: SearchInfo = {
                stages: ['searching'],
                query: data.query,
                urls: []
              };
              searchData = newSearchInfo;

              // Update the AI message with search info
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiResponseId
                    ? { ...msg, content: streamedContent, searchInfo: newSearchInfo, isLoading: false }
                    : msg
                )
              );
            }
            else if (data.type === 'search_results') {
              try {
                // Parse URLs from search results
                const urls = typeof data.urls === 'string' ? JSON.parse(data.urls) : data.urls;

                // Update search info to add 'reading' stage (don't replace 'searching')
                const newSearchInfo: SearchInfo = {
                  stages: searchData ? [...searchData.stages, 'reading'] : ['reading'],
                  query: searchData?.query || "",
                  urls: urls
                };
                searchData = newSearchInfo;

                // Update the AI message with search info
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === aiResponseId
                      ? { ...msg, content: streamedContent, searchInfo: newSearchInfo, isLoading: false }
                      : msg
                  )
                );
              } catch (err) {
                console.error("Error parsing search results:", err);
              }
            }
            else if (data.type === 'search_error') {
              // Handle search error
              const newSearchInfo: SearchInfo = {
                stages: searchData ? [...searchData.stages, 'error'] : ['error'],
                query: searchData?.query || "",
                error: data.error,
                urls: []
              };
              searchData = newSearchInfo;

              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiResponseId
                    ? { ...msg, content: streamedContent, searchInfo: newSearchInfo, isLoading: false }
                    : msg
                )
              );
            }
            else if (data.type === 'end') {
              // When stream ends, add 'writing' stage if we had search info
              if (searchData) {
                const finalSearchInfo: SearchInfo = {
                  ...searchData,
                  stages: [...searchData.stages, 'writing']
                };

                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === aiResponseId
                      ? { ...msg, searchInfo: finalSearchInfo, isLoading: false }
                      : msg
                  )
                );
              }

              eventSource.close();
            }
          } catch (error) {
            console.error("Error parsing event data:", error, event.data);
          }
        };

        // Handle errors
        eventSource.onerror = (error) => {
          console.error("EventSource error:", error);
          eventSource.close();

          // Only update with error if we don't have content yet
          if (!streamedContent) {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiResponseId
                  ? { ...msg, content: "Sorry, there was an error processing your request.", isLoading: false }
                  : msg
              )
            );
          }
        };

        // Listen for end event
        eventSource.addEventListener('end', () => {
          eventSource.close();
        });
      } catch (error) {
        console.error("Error setting up EventSource:", error);
        setMessages(prev => [
          ...prev,
          {
            id: newMessageId + 1,
            content: "Sorry, there was an error connecting to the server.",
            isUser: false,
            type: 'message',
            isLoading: false
          }
        ]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-80 h-80 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Medical pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.4'%3E%3Cpath d='M30 27v6h6v-6h-6zm-6 0v6h6v-6h-6zm6-6v6h6v-6h-6zm-6 0v6h6v-6h-6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 flex justify-center py-4 px-4">
        {/* Main container with enhanced design */}
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm flex flex-col rounded-3xl shadow-2xl border border-white/60 overflow-hidden h-[95vh] relative">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-emerald-500/5 to-cyan-500/5 pointer-events-none"></div>
          
          <Header />
          <MessageArea messages={messages} />
          <InputBar 
            currentMessage={currentMessage} 
            setCurrentMessage={setCurrentMessage} 
            onSubmit={handleSubmit} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
