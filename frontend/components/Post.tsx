"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getCommentsByPostId, addComment, CommentData } from "@/lib/comment";
import { toggleReaction, ReactionType } from "@/lib/reaction";
import { deletePost, updatePost } from "@/lib/post";
import { getCurrentUserId } from "@/lib/user";
import PostDetailModal from "./PostDetailModal";

function getAvatarUrl(url: string | null | undefined, seed: string): string {
  if (!url) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) return url;
  return `/${url}`;
}

export type PostType = 'thought' | 'moment';

export interface PostData {
  id: number | string;
  author: string;
  handle?: string; // e.g. @username
  avatar: string;
  content: string;
  media?: string; // URL to image or audio
  mediaType?: 'image' | 'audio' | 'video'; 
  likes: number;
  comments: number;
  timeLeft?: string; // For "Vanishing" concept
  timestamp?: string; // "Just now", "2m ago" etc.
  type: PostType;
  isNew?: boolean;
  loveCount?: number;
  totalReactions?: number;
  commentCount?: number;
  currentReaction?: ReactionType | null;
  ownerId?: string;
}

interface PostProps {
  post: PostData;
  onDelete?: (postId: string) => void;
  onUpdate?: (postId: string, newContent: string, newMedia?: string) => void;
}

export default function Post({ post, onDelete, onUpdate }: PostProps) {
  const currentUserId = getCurrentUserId();
  const [isDeleted, setIsDeleted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editMediaFile, setEditMediaFile] = useState<File | null>(null);
  const [editMediaPreview, setEditMediaPreview] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [displayContent, setDisplayContent] = useState(post.content);
  const [displayMedia, setDisplayMedia] = useState(post.media);

  const [localReactions, setLocalReactions] = useState({
    love: post.loveCount || 0,
    total: post.totalReactions || post.likes || 0
  });
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(
    post.currentReaction || null
  );

  const [localCommentCount, setLocalCommentCount] = useState(post.comments || post.commentCount || 0);
  const [commentsList, setCommentsList] = useState<CommentData[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showDetailModal && commentsList.length === 0) {
      setLoadingComments(true);
      getCommentsByPostId(post.id.toString())
        .then(res => {
          if (res && res.data) {
             setCommentsList(res.data);
          }
        })
        .finally(() => setLoadingComments(false));
    }
  }, [showDetailModal, post.id, commentsList.length]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const added = await addComment(post.id.toString(), newComment.trim());
      setCommentsList(prev => [added, ...prev]);
      setLocalCommentCount(prev => prev + 1);
      setNewComment("");
    } catch {
      alert("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReact = async () => {
    try {
      setLocalReactions((prev) => {
        const next = { ...prev };
        if (currentReaction === "LOVE") {
          next.love--;
          next.total--;
          setCurrentReaction(null);
        } else {
          if (currentReaction && currentReaction !== "LOVE") {
            next.total--;
          }
          next.love++;
          next.total++;
          setCurrentReaction("LOVE");
        }
        return next;
      });
      await toggleReaction(post.id.toString(), "LOVE");
    } catch (e) {
      console.error(e);
    }
  };

  const getActiveReactionIcon = () => {
    return (
      <svg className={`w-6 h-6 transition-all ${currentReaction === 'LOVE' ? 'text-red-500 fill-current drop-shadow-md cursor-pointer' : 'text-gray-500 hover:text-red-400 hover:scale-110 cursor-pointer'}`} fill={currentReaction === 'LOVE' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
    );
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id.toString());
      setIsDeleted(true);
      if (onDelete) onDelete(post.id.toString());
      setShowDeleteConfirm(false);
    } catch {
      alert("Failed to delete post.");
    }
  };

  const handleStartEdit = () => {
    setEditContent(displayContent);
    setEditMediaFile(null);
    setEditMediaPreview(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(displayContent);
    setEditMediaFile(null);
    setEditMediaPreview(null);
  };

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    try {
      const result = await updatePost(post.id.toString(), editContent, editMediaFile);
      setDisplayContent(result.textContent || editContent);
      if (result.mediaUrl) {
        setDisplayMedia(result.mediaUrl);
      }
      setIsEditing(false);
      if (onUpdate) onUpdate(post.id.toString(), editContent, result.mediaUrl || "");
    } catch {
      alert("Failed to update post.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditMediaFile(file);
      setEditMediaPreview(URL.createObjectURL(file));
    }
  };

  if (isDeleted) return null;

  return (
    <div 
      data-aos="fade-up"
      className={`group relative bg-white dark:bg-[#181825]/90 backdrop-blur-sm rounded-2xl p-6 border ${post.isNew ? 'border-blue-500/30' : 'border-gray-100 dark:border-white/5'} transition-all duration-300 hover:border-gray-200 dark:hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-900/10`}
    >
        {/* New Post Glow */}
        {post.isNew && <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-lg -z-10 pointer-events-none"></div>}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 relative">
                    <Image 
                        src={post.avatar} 
                        alt={post.author} 
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-200 text-sm">{post.author}</span>
                        {post.handle && <span className="text-xs text-gray-500">{post.handle}</span>}
                    </div>
                </div>
            </div>
            
            {/* Time / Status */}
            <div className="flex items-center gap-2">
                 {post.isNew && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>}
                 <span className={`text-xs font-medium ${post.isNew ? 'text-blue-400' : 'text-gray-500'}`}>
                    {post.timestamp || post.timeLeft || 'Just now'}
                 </span>
                 {post.ownerId && post.ownerId === currentUserId && (
                   <div className="flex items-center gap-1">
                     <button onClick={handleStartEdit} className="text-gray-500 hover:text-indigo-500 transition z-10" title="Edit Whisper">
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                     </button>
                     <button onClick={() => setShowDeleteConfirm(true)} className="text-gray-500 hover:text-red-500 transition z-10" title="Delete Whisper">
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                     </button>
                   </div>
                 )}
            </div>
        </div>
        
        {/* Content (Caption) moved to below footer actions in later block. Here we only keep Edit Logic */}
        {isEditing && (
              <div className="mb-4 space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-[17px] text-gray-800 dark:text-gray-300 leading-relaxed outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none min-h-[80px]"
                  rows={3}
                />
                {/* Media replacement */}
                {post.type === 'moment' && (
                  <div className="flex items-center gap-3">
                    {editMediaPreview && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 relative">
                        <img src={editMediaPreview} alt="New media" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => handleEditFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                        input.click();
                      }}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Replace image
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={savingEdit}
                    className="px-4 py-1.5 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
                  >
                    {savingEdit ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
        )}

        {post.type === 'moment' && displayMedia && !isEditing && (
            <div className="mb-4 rounded-[4px] border border-gray-200 dark:border-white/5 relative bg-white dark:bg-[#0c1014] overflow-hidden flex justify-center w-full">
                {post.mediaType === 'image' ? (
                     <div 
                        className="relative w-full cursor-pointer group/media bg-black"
                        onClick={() => setShowDetailModal(true)}
                     >
                        <img 
                            src={post.media || ""} 
                            alt="Post media" 
                            className="w-full h-auto max-h-[750px] object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/media:opacity-100">
                             <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                        </div>
                     </div>
                ) : post.mediaType === 'video' ? (
                     <div className="relative w-full">
                        <video 
                            src={post.media} 
                            controls
                            className="w-full h-auto max-h-[750px] object-cover"
                        />
                     </div>
                ) : post.mediaType === 'audio' ? (
                    <div className="p-4 flex items-center gap-4">
                         <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>
                         </div>
                         <div className="flex-1 h-1 bg-gray-300 dark:bg-white/10 rounded-full overflow-hidden">
                             <div className="w-1/3 h-full bg-indigo-500"></div>
                         </div>
                         <span className="text-xs font-mono text-gray-400">0:14 / 1:30</span>
                    </div>
                ) : null}
            </div>
        )}

         {/* Footer Actions */}
         <div className="flex items-center gap-6 mb-3">
              <div className="relative">
                  <button 
                     onClick={handleReact}
                     className="flex items-center gap-2 text-[15px] transition group"
                  >
                      {getActiveReactionIcon()}
                      <span className={currentReaction ? "text-gray-900 dark:text-gray-200 font-semibold" : "text-gray-500 font-medium"}>{localReactions.total}</span>
                  </button>
              </div>

             <button onClick={() => setShowDetailModal(true)} className="flex items-center gap-2 text-[15px] text-gray-500 hover:text-blue-400 transition group">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                 <span className="font-medium">{localCommentCount}</span>
             </button>

             <button className="flex items-center gap-2 text-[15px] text-gray-500 hover:text-gray-900 dark:hover:text-white transition ml-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
             </button>
         </div>

         {/* Caption (Text Content) */}
         {!isEditing && displayContent && (
             <div className="mb-2">
                 <p className="text-[15px] text-gray-900 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                     <span className="font-bold mr-2 cursor-pointer hover:underline">{post.author}</span>
                     {displayContent}
                 </p>
             </div>
         )}
         
         {/* Add Comment Preview (Instagram-like) */}
         <button onClick={() => setShowDetailModal(true)} className="text-[14px] text-gray-500 dark:text-gray-400 mb-4 hover:underline">
             View all {localCommentCount} comments
         </button>

        {/* Delete Confirmation Modal */}
        {mounted && showDeleteConfirm && createPortal(
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center animate-fadeIn p-4">
                <div className="bg-white dark:bg-[#181825] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 animate-slideUp">
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Whisper</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Are you sure you want to let this thought fade away? This action cannot be undone.</p>
                    </div>
                    <div className="flex border-t border-gray-200 dark:border-white/10">
                        <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition">Cancel</button>
                        <div className="w-px bg-gray-200 dark:bg-white/10"></div>
                        <button onClick={handleDelete} className="flex-1 py-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition">Delete</button>
                    </div>
                </div>
            </div>,
            document.body
        )}

        {/* Advanced Detail Modal (Instagram-style split screen) */}
        {mounted && showDetailModal && createPortal(
             <PostDetailModal 
                  post={post}
                  onClose={() => setShowDetailModal(false)}
                  commentsList={commentsList}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  handleAddComment={handlePostComment}
                  isSubmittingComment={submittingComment}
                  loadingComments={loadingComments}
                  currentReaction={currentReaction}
                  localReactions={localReactions}
                  handleReact={handleReact}
                  avatarUrl={getAvatarUrl(post.avatar, post.author)}
             />,
             document.body
        )}
    </div>
  );
}
