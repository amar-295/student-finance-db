import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billSplitService } from '../services/billSplit.service';

import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/format';
import SplitSettlementModal from '../components/splits/SplitSettlementModal';
import Skeleton from '../components/common/Skeleton';

export default function SplitDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const queryClient = useQueryClient();
    const [settlementModal, setSettlementModal] = useState<{
        isOpen: boolean;
        participantId: string;
        amount: number;
        participantName: string;
    }>({
        isOpen: false,
        participantId: '',
        amount: 0,
        participantName: ''
    });
    const [commentContent, setCommentContent] = useState('');

    const { data: split, isLoading: isSplitLoading } = useQuery({
        queryKey: ['bill-split', id],
        queryFn: () => billSplitService.getSplitById(id!)
    });

    const { data: comments, isLoading: isCommentsLoading } = useQuery({
        queryKey: ['split-comments', id],
        queryFn: () => billSplitService.getComments(id!)
    });

    const addCommentMutation = useMutation({
        mutationFn: (content: string) => billSplitService.addComment(id!, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['split-comments', id] });
            setCommentContent('');
        }
    });

    const isCreator = split?.createdBy === user?.id;

    if (isSplitLoading) {
        return (
            <div className="p-8 space-y-8 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
                <Skeleton variant="rect" height={200} className="rounded-2xl" />
                <Skeleton variant="rect" height={400} className="rounded-2xl" />
            </div>
        );
    }

    if (!split) {
        return (
            <div className="p-8 text-center bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen text-gray-500">
                Split not found.
            </div>
        );
    }

    const paidParticipants = split.participants.filter(p => p.status === 'paid').length;
    const totalParticipants = split.participants.length;
    const progress = (paidParticipants / totalParticipants) * 100;

    return (
        <div className="p-8 space-y-8 font-display bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <button onClick={() => navigate('/splits')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-bold mb-4">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Splits
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">{split.description}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${split.status === 'settled' ? 'bg-[#10b981]/10 text-[#10b981]'
                            : split.status === 'partial' ? 'bg-orange-500/10 text-orange-500'
                                : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                            {split.status}
                        </span>
                    </div>
                    <p className="text-[#64748b] dark:text-[#94a3b8] font-medium mt-1">
                        Created by {split.creator.name} on {new Date(split.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-4xl font-black text-[#1e293b] dark:text-white">{formatCurrency(Number(split.totalAmount))}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Participants */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress */}
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-[#1e293b] dark:text-white">{paidParticipants} of {totalParticipants} paid</span>
                            <span className="text-[#10b981]">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#10b981] transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Participant List */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-[#1e293b] dark:text-white">Participants</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {split.participants.map(p => {
                                const isMe = p.userId === user?.id;
                                const isPaid = p.status === 'paid';

                                return (
                                    <div key={p.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                                {p.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1e293b] dark:text-white flex items-center gap-2">
                                                    {isMe ? 'You' : p.user.name}
                                                    {isMe && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase">Me</span>}
                                                </p>
                                                <p className="text-sm text-gray-500">{p.user.email}</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${isPaid ? 'text-gray-400 decoration-slate-400' : 'text-[#1e293b] dark:text-white'}`}>
                                                {formatCurrency(Number(p.amountOwed))}
                                            </p>
                                            {isPaid ? (
                                                <div className="flex items-center justify-end gap-1 text-[#10b981] text-xs font-bold mt-1">
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                                    Paid {p.paidAt && new Date(p.paidAt).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <div className="mt-2">
                                                    {/* Creator can mark anyone as paid. Users can mark themselves? Usually only receiver marks paid. */}
                                                    {isCreator && (
                                                        <button
                                                            onClick={() => setSettlementModal({
                                                                isOpen: true,
                                                                participantId: p.userId,
                                                                amount: Number(p.amountOwed),
                                                                participantName: p.user.name
                                                            })}
                                                            className="text-xs bg-[#10b981] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#059669] shadow-sm shadow-[#10b981]/20 transition-all"
                                                        >
                                                            Mark Paid
                                                        </button>
                                                    )}
                                                    {!isPaid && !isCreator && isMe && (
                                                        <span className="text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-md">
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Comments & Activity */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm h-full max-h-[600px] flex flex-col">
                        <h3 className="text-lg font-bold text-[#1e293b] dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">forum</span>
                            Comments
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                            {isCommentsLoading ? (
                                <p className="text-gray-400 text-sm text-center">Loading comments...</p>
                            ) : comments && comments.length > 0 ? (
                                comments.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-xs font-bold text-gray-500">
                                            {comment.user.name.charAt(0)}
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl rounded-tl-none text-sm">
                                            <div className="flex justify-between items-baseline gap-4 mb-1">
                                                <span className="font-bold text-[#1e293b] dark:text-white">{comment.user.name}</span>
                                                <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-400 text-sm">
                                    No comments yet. Start the conversation!
                                </div>
                            )}
                        </div>

                        <div className="mt-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl pr-12 pl-4 py-3 text-sm focus:ring-2 focus:ring-[#10b981] dark:text-white"
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            if (commentContent.trim()) addCommentMutation.mutate(commentContent);
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        if (commentContent.trim()) addCommentMutation.mutate(commentContent);
                                    }}
                                    disabled={!commentContent.trim() || addCommentMutation.isPending}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#10b981] disabled:opacity-50 transition-colors"
                                >
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SplitSettlementModal
                isOpen={settlementModal.isOpen}
                onClose={() => setSettlementModal(prev => ({ ...prev, isOpen: false }))}
                splitId={id!}
                participantId={settlementModal.participantId}
                amount={settlementModal.amount}
                participantName={settlementModal.participantName}
            />
        </div>
    );
}
