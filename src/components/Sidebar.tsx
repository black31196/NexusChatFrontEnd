// src/components/Sidebar.tsx
import React from 'react';
import type { Conversation } from '../contexts/ChatContext';

interface Props {
  conversations: Conversation[];
  currentId?: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ conversations, currentId, onSelect }: Props) {
  return (
    <div className="w-64 border-r overflow-auto">
      {conversations.map((c) => (
        // Make this wrapper `relative` so the badge can absolutely position itself
        <div
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`
            relative           /* <-- enables absolute children */
            p-3 
            cursor-pointer 
            hover:bg-gray-100 
            ${c.id === currentId ? 'bg-gray-200' : ''}
          `}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium truncate">{c.participants.join(', ')}</span>
            {/* optionally keep a top‐right badge here if you want */}
          </div>
          <div className="text-sm text-gray-600 truncate">
            {c.lastMessage?.content}
          </div>

          {/* bottom‐right unread badge */}
          {c.unreadCount > 0 && (
            <span
              className="
                absolute          /* absolutely positioned inside parent */
                bottom-2 
                right-2 
                bg-blue-500 
                text-white 
                rounded-full 
                h-5 
                w-5 
                flex 
                items-center 
                justify-center 
                text-xs
              "
            >
              {c.unreadCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
