import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  Database
} from 'lucide-react';
import { PcGameRequirements, GameRequirementSpec } from '../../types/pcRequirements';

interface AdminRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: PcGameRequirements[];
  onSaveGame: (game: PcGameRequirements) => void;
  onDeleteGame: (id: string) => void;
}

const emptySpec: GameRequirementSpec = {
  os: 'Windows 10 64-bit',
  cpu: '',
  cpuTier: 5,
  ramGb: 8,
  gpu: '',
  gpuTier: 5,
  vramGb: 4,
  storageGb: 60,
  storageType: 'SSD Recommended',
  directX: 'DirectX 12',
  additionalNotes: ''
};

export const AdminRequirementsModal: React.FC<AdminRequirementsModalProps> = ({
  isOpen,
  onClose,
  games,
  onSaveGame,
  onDeleteGame
}) => {
  const [editingGame, setEditingGame] = useState<PcGameRequirements | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingGame({
      id: `game-req-${Date.now()}`,
      title: '',
      slug: '',
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      developer: '',
      publisher: '',
      releaseDate: '2024',
      genre: 'Action',
      platforms: ['PC'],
      minimum: { ...emptySpec },
      recommended: { ...emptySpec, ramGb: 16, vramGb: 8, cpuTier: 7, gpuTier: 7 },
      source: 'Official Developer Storefront Specifications',
      lastVerified: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
  };

  const handleStartEdit = (game: PcGameRequirements) => {
    setIsCreating(false);
    setEditingGame(JSON.parse(JSON.stringify(game)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame || !editingGame.title) return;

    // Auto-generate slug if blank
    if (!editingGame.slug) {
      editingGame.slug = editingGame.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    onSaveGame(editingGame);
    setStatusMessage(`Saved "${editingGame.title}" successfully.`);
    setEditingGame(null);
    setIsCreating(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove requirements for "${title}"?`)) {
      onDeleteGame(id);
      if (editingGame?.id === id) {
        setEditingGame(null);
      }
      setStatusMessage(`Deleted "${title}".`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-[#121424] border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-[#16182c]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-['Rajdhani'] font-bold text-xl sm:text-2xl text-white uppercase tracking-wider">
                PC Requirements Admin Manager
              </h3>
              <p className="text-xs text-purple-300 font-['Space_Grotesk']">
                Authorized Administrator: contact@gamevault.forum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="bg-emerald-900/60 border-b border-emerald-500/40 px-6 py-2.5 text-xs text-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!editingGame ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">
                  Total Games in Requirements Database: <strong className="text-white">{games.length}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Game</span>
                </button>
              </div>

              <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-black/40">
                {games.map((g) => (
                  <div key={g.id} className="flex items-center justify-between p-3.5 hover:bg-white/[0.02]">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={g.coverImage}
                        alt={g.title}
                        className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="font-['Rajdhani'] font-bold text-white text-base truncate">
                          {g.title}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">
                          {g.developer} • Verified: {g.lastVerified}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(g)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-purple-900/40 text-gray-300 hover:text-purple-300 border border-white/5 cursor-pointer"
                        title="Edit Game Requirements"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(g.id, g.title)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-rose-900/40 text-gray-300 hover:text-rose-300 border border-white/5 cursor-pointer"
                        title="Delete Game"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="font-['Rajdhani'] font-bold text-lg text-white uppercase tracking-wide">
                  {isCreating ? 'Add New Game Requirements' : `Edit: ${editingGame.title}`}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                >
                  Cancel & Return to List
                </button>
              </div>

              {/* General Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-semibold uppercase block mb-1">
                    Game Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingGame.title}
                    onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold uppercase block mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingGame.slug}
                    onChange={(e) => setEditingGame({ ...editingGame, slug: e.target.value })}
                    placeholder="e.g. cyberpunk-2077"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold uppercase block mb-1">
                    Developer & Publisher
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Developer"
                      value={editingGame.developer}
                      onChange={(e) => setEditingGame({ ...editingGame, developer: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-purple-400"
                    />
                    <input
                      type="text"
                      placeholder="Publisher"
                      value={editingGame.publisher}
                      onChange={(e) => setEditingGame({ ...editingGame, publisher: e.target.value })}
                      className="w-1/2 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold uppercase block mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={editingGame.coverImage}
                    onChange={(e) => setEditingGame({ ...editingGame, coverImage: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold uppercase block mb-1">
                    Source of Requirements *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingGame.source}
                    onChange={(e) => setEditingGame({ ...editingGame, source: e.target.value })}
                    placeholder="e.g. Official Developer Storefront Specifications"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold uppercase block mb-1">
                    Last Verified Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingGame.lastVerified}
                    onChange={(e) => setEditingGame({ ...editingGame, lastVerified: e.target.value })}
                    placeholder="e.g. September 2024"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Minimum Requirements */}
              <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/30 space-y-3">
                <h5 className="font-['Rajdhani'] font-bold text-cyan-300 uppercase tracking-wider text-sm">
                  Minimum Requirements Specification
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Minimum CPU</label>
                    <input
                      type="text"
                      required
                      value={editingGame.minimum.cpu}
                      onChange={(e) =>
                        setEditingGame({
                          ...editingGame,
                          minimum: { ...editingGame.minimum, cpu: e.target.value }
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Minimum GPU</label>
                    <input
                      type="text"
                      required
                      value={editingGame.minimum.gpu}
                      onChange={(e) =>
                        setEditingGame({
                          ...editingGame,
                          minimum: { ...editingGame.minimum, gpu: e.target.value }
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-gray-400 block mb-1">RAM (GB)</label>
                      <input
                        type="number"
                        value={editingGame.minimum.ramGb}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            minimum: { ...editingGame.minimum, ramGb: parseInt(e.target.value, 10) || 4 }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-gray-400 block mb-1">Storage (GB)</label>
                      <input
                        type="number"
                        value={editingGame.minimum.storageGb}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            minimum: { ...editingGame.minimum, storageGb: parseInt(e.target.value, 10) || 50 }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-gray-400 block mb-1">VRAM (GB)</label>
                      <input
                        type="number"
                        value={editingGame.minimum.vramGb}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            minimum: { ...editingGame.minimum, vramGb: parseInt(e.target.value, 10) || 2 }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-gray-400 block mb-1">Storage Type</label>
                      <select
                        value={editingGame.minimum.storageType || 'HDD'}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            minimum: { ...editingGame.minimum, storageType: e.target.value as any }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                      >
                        <option value="HDD">HDD</option>
                        <option value="SSD Recommended">SSD Recommended</option>
                        <option value="SSD Required">SSD Required</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Requirements */}
              <div className="p-4 rounded-xl bg-black/40 border border-purple-500/30 space-y-3">
                <h5 className="font-['Rajdhani'] font-bold text-purple-300 uppercase tracking-wider text-sm">
                  Recommended Requirements Specification
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Recommended CPU</label>
                    <input
                      type="text"
                      required
                      value={editingGame.recommended.cpu}
                      onChange={(e) =>
                        setEditingGame({
                          ...editingGame,
                          recommended: { ...editingGame.recommended, cpu: e.target.value }
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Recommended GPU</label>
                    <input
                      type="text"
                      required
                      value={editingGame.recommended.gpu}
                      onChange={(e) =>
                        setEditingGame({
                          ...editingGame,
                          recommended: { ...editingGame.recommended, gpu: e.target.value }
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-gray-400 block mb-1">RAM (GB)</label>
                      <input
                        type="number"
                        value={editingGame.recommended.ramGb}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            recommended: { ...editingGame.recommended, ramGb: parseInt(e.target.value, 10) || 16 }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-gray-400 block mb-1">Storage (GB)</label>
                      <input
                        type="number"
                        value={editingGame.recommended.storageGb}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            recommended: { ...editingGame.recommended, storageGb: parseInt(e.target.value, 10) || 50 }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-gray-400 block mb-1">VRAM (GB)</label>
                      <input
                        type="number"
                        value={editingGame.recommended.vramGb}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            recommended: { ...editingGame.recommended, vramGb: parseInt(e.target.value, 10) || 6 }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-gray-400 block mb-1">Storage Type</label>
                      <select
                        value={editingGame.recommended.storageType || 'SSD Required'}
                        onChange={(e) =>
                          setEditingGame({
                            ...editingGame,
                            recommended: { ...editingGame.recommended, storageType: e.target.value as any }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded text-white text-xs"
                      >
                        <option value="SSD Required">SSD Required</option>
                        <option value="SSD Recommended">SSD Recommended</option>
                        <option value="HDD">HDD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-950/50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Specifications</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
