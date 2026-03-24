"use client";

interface MessageBubbleProps {
  message: string;
  isMe: boolean;
  avatar?: string;
  sender?: string;
  time?: string;
  isTyping?: boolean;
}

export default function MessageBubble({ message, isMe, avatar, sender, time, isTyping }: MessageBubbleProps) {
  if (isTyping) {
    return (
      <div className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
         <div className="flex flex-col items-end">
             <div className="bg-gray-100 dark:bg-[#1f1f22] text-gray-500 dark:text-gray-400 px-4 py-2 rounded-2xl rounded-tr-sm text-sm mb-1">
                 Typing...
             </div>
             <span className="text-xs text-gray-500">Me • Typing...</span>
         </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-6 ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"} gap-3`}>
        {/* Avatar */}
        {avatar && (
          <div className="flex-shrink-0 self-end">
            <img src={avatar} alt={sender || "User"} className="w-8 h-8 rounded-full object-cover" />
          </div>
        )}
        

        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
             {/* Message Content */}
             <div
                className={`
                    px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${
                    isMe
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm shadow-purple-500/20"
                        : "bg-white dark:bg-[#1f1f22] text-gray-900 dark:text-gray-200 rounded-bl-sm border border-gray-100 dark:border-white/5"
                    }
                `}
            >
                {message}
            </div>
            
            {/* Metadata */}
            <div className="flex items-center gap-1 mt-1.5 px-1">
                 {sender && !isMe && <span className="text-xs font-medium text-gray-400">{sender}</span>}
                 {(sender || time) && <span className="text-xs text-gray-500">•</span>}
                 {time && <span className="text-xs text-gray-500">{time}</span>}
            </div>
        </div>
      </div>
    </div>
  );
}
