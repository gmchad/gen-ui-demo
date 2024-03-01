"use client"
 
import { useState } from 'react';
import { useUIState, useActions } from "ai/rsc";
import { type AI } from './action';
import { Input } from "@/components/ui/input"
import { IconUser } from "@/components/ui/icons"

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 text-green-300">
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
    <div className='flex flex-col items-center justify-center p-4'>
      <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg shadow-md space-y-4'>
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
 
      <div className='mt-5'>
      <Input
        placeholder="Send a message..."
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
        }}
      />
      </div>
    </form>
    </div>
  </div>
  )
}