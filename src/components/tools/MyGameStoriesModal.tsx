import React, { useState } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Trash2, 
  Download, 
  Clock, 
  History, 
  FileText, 
  Edit3, 
  Check, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { UserSavedGameStory, GeneratedGameStoryReport } from '../../types/gameStory';
import { deleteUserGameStory, updateUserStoryMetadata } from '../../lib/userGameStoriesStorage';
import { exportReportAsTxt, exportReportAsMarkdown, downloadFile } from '../../lib/gameStoryEngine';
import { generateGameStoryPdf } from '../../lib/gameStoryPdf';
import { getGameTitleArtwork } from '../../utils/gameImageService';

interface MyGameStoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  stories: UserSavedGameStory[];
  onSelectStory: (report: GeneratedGameStoryReport) => void;
  onRefreshStories: () => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const MyGameStoriesModal: React.FC<MyGameStoriesModalProps> = ({
  isOpen,
  onClose,
  userId,
  stories,
  onSelectStory,
  onRefreshStories,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [versionViewingStory, setVersionViewingStory] = useState<UserSavedGameStory | null>(null);

  if (!isOpen) return null;

  const filteredStories = stories.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.gameTitle.toLowerCase().includes(q) || 
           (s.customTitle && s.customTitle.toLowerCase().includes(q)) ||
           (s.notes && s.notes.toLowerCase().includes(q));
  });

  const handleStartEdit = (story: UserSavedGameStory) => {
    setEditingId(story.id);
    setEditTitle(story.customTitle || story.gameTitle);
    setEditNotes(story.notes || '');
  };

  const handleSaveEdit = async (storyId: string) => {
    await updateUserStoryMetadata(userId, storyId, {
      customTitle: editTitle.trim(),
      notes: editNotes.trim()
    });
    setEditingId(null);
    onRefreshStories();
    onShowToast('Story metadata updated successfully.', 'success');
  };

  const handleDelete = async (storyId: string) => {
    if (window.confirm('Are you sure you want to delete this saved game story?')) {
      await deleteUserGameStory(userId, storyId);
      onRefreshStories();
      onShowToast('Saved story removed from your library.', 'info');
    }
  };

  const handleDownloadPdf = async (report: GeneratedGameStoryReport) => {
    try {
      const pdfBytes = await generateGameStoryPdf(report);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadFile(blob, `${report.gameSlug}-story-overview.pdf`, 'application/pdf');
      onShowToast('PDF report downloaded successfully.', 'success');
    } catch (e) {
      onShowToast('Could not generate PDF download.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] p-6 sm:p-8 bg-[#0b0d18] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/60 text-left flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Personal Research Vault
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] mt-1">
              My Saved Game Stories
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Access your saved narrative overviews, revision histories, custom research notes, and downloadable exports.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative my-4">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search your saved game stories by title or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Stories List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {filteredStories.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto text-purple-500/40 mb-3" />
              <div className="text-base font-semibold text-white mb-1">No Saved Stories Found</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Generate a story for any game in the generator, then click "Save to My Library" to build your personal collection.
              </p>
            </div>
          ) : (
            filteredStories.map((story) => (
              <div
                key={story.id}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
              >
                {/* Game Info & Custom Details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={getGameTitleArtwork(story.gameTitle, story.report?.gameInfo?.genre, story.coverImage)}
                    alt={story.gameTitle}
                    className="w-16 h-20 rounded-xl object-cover border border-white/10 shrink-0 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-white text-base hover:text-purple-300 transition-colors cursor-pointer" onClick={() => { onSelectStory(story.report); onClose(); }}>
                        {story.customTitle || story.gameTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        Version {story.version}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase">
                        {story.generationMode}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase">
                        {story.spoilerLevel} Spoilers
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mb-2 flex items-center gap-3">
                      <span>Original Game: <strong>{story.gameTitle}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Saved: {new Date(story.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Personal Notes / Inline Editor */}
                    {editingId === story.id ? (
                      <div className="mt-2 space-y-2 p-3 rounded-xl bg-black/40 border border-purple-500/30">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Custom Report Title..."
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Personal research notes or tags..."
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(story.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      story.notes && (
                        <p className="text-xs text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/5 italic">
                          "{story.notes}"
                        </p>
                      )
                    )}
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      onSelectStory(story.report);
                      onClose();
                    }}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-950/40"
                    title="Read & Inspect Report"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Open
                  </button>

                  {/* Versions button if history exists */}
                  {story.versionsHistory && story.versionsHistory.length > 0 && (
                    <button
                      onClick={() => setVersionViewingStory(story)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors"
                      title="View Revision History"
                    >
                      <History className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleStartEdit(story)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-purple-300 border border-white/10 transition-colors"
                    title="Edit Title & Notes"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(story.report)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(story.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                    title="Delete Story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Version History Modal Overlay if active */}
        {versionViewingStory && (
          <div className="absolute inset-0 z-10 bg-[#090b14]/95 p-6 rounded-2xl flex flex-col animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Revision History: {versionViewingStory.gameTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  Compare and restore previous generated versions.
                </p>
              </div>
              <button
                onClick={() => setVersionViewingStory(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {/* Current Version */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">Version {versionViewingStory.version} (Active)</span>
                    <span className="text-[10px] text-cyan-300 uppercase">{versionViewingStory.generationMode}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Updated: {new Date(versionViewingStory.updatedAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSelectStory(versionViewingStory.report);
                    setVersionViewingStory(null);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold"
                >
                  View
                </button>
              </div>

              {/* Past Versions */}
              {versionViewingStory.versionsHistory?.map((h, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-xs">Version {h.version}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{h.generationMode}</span>
                      <span className="text-[10px] text-amber-400 uppercase">{h.spoilerLevel} spoilers</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Archived: {new Date(h.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectStory(h.report);
                      setVersionViewingStory(null);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium"
                  >
                    Restore This Version
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>{stories.length} saved story reports in cloud vault</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
