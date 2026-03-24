"use client";

import { CommentData } from "@/lib/comment";
import { PostData } from "../components/Post";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

function timeAgoFromDate(dateStr: string): string {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export interface PostDetailModalProps {
  post: PostData;
  onClose: () => void;

  commentsList: CommentData[];
  newComment: string;
  setNewComment: (val: string) => void;
  handleAddComment: () => void;
  isSubmittingComment: boolean;
  loadingComments: boolean;

  currentReaction: "LOVE" | null;
  localReactions: { total: number };
  handleReact: () => void;

  avatarUrl: string;
}

export default function PostDetailModal({
  post,
  onClose,
  commentsList,
  newComment,
  setNewComment,
  handleAddComment,
  isSubmittingComment,
  loadingComments,
  currentReaction,
  localReactions,
  handleReact,
  avatarUrl,
}: PostDetailModalProps) {
  const timeAgo = post.timestamp || timeAgoFromDate(new Date().toISOString());

  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[99999] flex justify-center items-center backdrop-blur-sm p-4 animate-fadeIn overflow-hidden"
      onClick={onClose}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white hover:text-gray-300 transition z-50"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <div 
        className="w-full max-w-6xl h-full max-h-[90vh] bg-white dark:bg-[#0c1014] rounded-r-none rounded-l-md md:rounded-md flex flex-col md:flex-row shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        data-aos="fade-right"
        data-aos-duration="400"
      >
        {/* Left Side: Media */}
        <div className="w-full md:w-[55%] lg:w-[60%] bg-black flex items-center justify-center relative border-r border-gray-200 dark:border-white/10 shrink-0">
          {post.mediaType === 'video' ? (
             <video src={post.media!} controls className="w-full h-full object-contain" autoPlay muted loop />
          ) : (
             <img src={post.media!} alt="Post media" className="w-full h-full object-contain" />
          )}
        </div>

        {/* Right Side: Details & Comments */}
        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col h-full bg-white dark:bg-[#0c1014] relative shrink-0 min-w-[350px]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-white/5 shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 shrink-0">
                   <Image src={avatarUrl} alt="Author" width={32} height={32} className="w-full h-full object-cover" />
               </div>
               <div>
                   <h3 className="text-sm border-0 font-bold text-gray-900 dark:text-gray-100">{post.author}</h3>
               </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
               </svg>
            </button>
          </div>

          {/* Comments List (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 custom-scrollbar bg-white dark:bg-[#0c1014]">
            {/* Caption rendered like the first comment */}
            {post.content && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 shrink-0 mt-0.5">
                     <Image src={avatarUrl} alt="Author" width={32} height={32} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                     <p className="text-[14px] text-gray-900 dark:text-gray-200 leading-relaxed">
                         <span className="font-bold mr-2">{post.author}</span>
                         {post.content}
                     </p>
                     <p className="text-[12px] text-gray-400 mt-1">{timeAgo}</p>
                 </div>
              </div>
            )}

            {/* Actual Comments */}
            {loadingComments ? (
               <div className="flex justify-center items-center py-6">
                  <svg className="w-5 h-5 text-gray-400 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
               </div>
            ) : commentsList.map(comment => {
              const commentAvatarUrl = comment.owner?.avatarUrl?.startsWith('http') || comment.owner?.avatarUrl?.startsWith('/') 
                 ? comment.owner.avatarUrl 
                 : `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.owner?.userName || comment.owner?.fullName}`;

              return (
                 <div key={comment.id} className="flex gap-3 relative group/comment">
                     <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden border border-gray-300 dark:border-gray-700 mt-1">
                         <img src={commentAvatarUrl} alt={comment.owner?.fullName} className="w-full h-full object-cover" />
                     </div>
                     <div>
                         <div className="text-[14px] text-gray-800 dark:text-gray-200">
                             <span className="font-bold mr-2">{comment.owner?.fullName || comment.owner?.userName}</span>
                             {comment.content}
                         </div>
                         <div className="flex items-center gap-3 mt-1.5 text-[12px] font-medium text-gray-500">
                             <span>{comment.createdAt ? timeAgoFromDate(comment.createdAt) : "Just now"}</span>
                             <button className="hover:text-gray-700 dark:hover:text-gray-300">Reply</button>
                         </div>
                     </div>
                     <button className="absolute right-0 top-1 text-gray-300 dark:text-gray-600 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition">
                         <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                     </button>
                 </div>
              );
            })}
          </div>

          {/* Actions & Input Footer */}
          <div className="border-t border-gray-100 dark:border-white/5 shrink-0 bg-white dark:bg-[#0c1014]">
             {/* Action icons */}
             <div className="flex items-center px-4 py-3 gap-4">
                 <button onClick={handleReact} className="transition group">
                     {currentReaction === "LOVE" ? (
                         <svg className="w-[26px] h-[26px] text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transform scale-110" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                         </svg>
                     ) : (
                         <svg className="w-[26px] h-[26px] text-gray-900 dark:text-gray-100 hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                         </svg>
                     )}
                 </button>
                 <button className="text-gray-900 dark:text-gray-100 hover:text-gray-500 transition">
                     <svg className="w-[26px] h-[26px] transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                     </svg>
                 </button>
                 <button className="text-gray-900 dark:text-gray-100 hover:text-gray-500 transition">
                    <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                 </button>
                 <button className="ml-auto text-gray-900 dark:text-gray-100 hover:text-gray-500 transition">
                    <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                 </button>
             </div>
             <div className="px-4 pb-2">
                 <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{localReactions.total} likes</p>
                 <p className="text-[10px] text-gray-400 mt-1 mb-2 uppercase tracking-wide">{timeAgo}</p>
             </div>

             {/* Comment Input */}
             <div className="px-4 py-3 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                <input 
                   type="text" 
                   value={newComment}
                   onChange={(e) => setNewComment(e.target.value)}
                   onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                   placeholder="Add a comment..." 
                   className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-900 dark:text-gray-100 placeholder-gray-500"
                />
                {newComment.trim() && (
                   <button 
                     onClick={handleAddComment} 
                     disabled={isSubmittingComment}
                     className="text-[14px] font-bold text-blue-500 hover:text-blue-900 dark:hover:text-blue-400 transition"
                   >
                       {isSubmittingComment ? "Posting..." : "Post"}
                   </button>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
