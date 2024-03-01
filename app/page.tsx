"use client"
 
import { useState } from 'react';
import { useUIState, useActions } from "ai/rsc";
import { type AI } from './action';

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {children}
      </div>
    </div>
  );
}
 
export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
 
  return (
    <div>
      {
        // View messages in UI state
        messages.map((message) => (
          <div key={message.id}>
            {message.display}
          </div>
        ))
      }
 
      <form
        onSubmit={async (e: any) => {
          e.preventDefault();

          // Blur focus on mobile
          if (window.innerWidth < 600) {
            e.target['message']?.blur();
          }

          const value = inputValue.trim();
          setInputValue('');
          if (!value) return;

          // Add user message UI
          setMessages(currentMessages => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <UserMessage>{value}</UserMessage>,
            },
          ]);

          try {
            // Submit and get response message
            const responseMessage = await submitUserMessage(value);
            setMessages(currentMessages => [
              ...currentMessages,
              responseMessage,
            ]);
          } catch (error) {
            console.error(error);
          }
        }}
      >
 
      <input
        placeholder="Send a message..."
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
        }}
      />
    </form>
    </div>
  )
}