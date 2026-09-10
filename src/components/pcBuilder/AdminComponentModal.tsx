import React, { useState } from 'react';
import { X, Database, Plus, Edit2, Check, ShieldCheck } from 'lucide-react';
import { PcComponent, ComponentCategory } from '../../types/pcBuilder';
import { INITIAL_COMPONENTS } from '../../data/pcComponentsData';

interface AdminComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: PcComponent[];
  onUpdateComponents: (comps: PcComponent[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const AdminComponentModal: React.FC<AdminComponentModalProps> = ({
  isOpen,
  onClose,
  components,
  onUpdateComponents,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('gpu');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleToggleAvailability = (id: string) => {
    const updated = components.map(c => (c.id === id ? { ...c, isAvailable: !c.isAvailable } : c));
    onUpdateComponents(updated);
    onShowToast('Component availability status toggled.', 'info');
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) return;
    const updated = components.map(c => (c.id === id ? { ...c, priceUsd: newPrice, dateUpdated: 'Recently Verified' } : c));
    onUpdateComponents(updated);
    onShowToast('Component price updated and verified.', 'success');
  };

  const filtered = components.filter(c => {
    const matchesCat = c.category === selectedCategory;
    const matchesSearch = c.model.toLowerCase().includes(searchTerm.toLowerCase()) || c.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories: { id: ComponentCategory; label: string }[] = [
    { id: 'cpu', label: 'CPUs' },
    { id: 'gpu', label: 'GPUs' },
    { id: 'motherboard', label: 'Motherboards' },
    { id: 'ram', label: 'RAM' },
    { id: 'storage', label: 'Storage' },
    { id: 'psu', label: 'Power Supplies' },
    { id: 'cooler', label: 'Coolers' },
    { id: 'case', label: 'Cases' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0f111d] border border-purple-500/40 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Hardware Inventory & Price Registry
              </h3>
              <p className="text-xs text-slate-400">
                Verified database administration desk for Game Vault Forum
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills & Search */}
        <div className="py-3 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search model or manufacturer..."
            className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Component Table / List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {filtered.map(comp => (
            <div
              key={comp.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                comp.isAvailable ? 'bg-black/30 border-white/10' : 'bg-rose-950/20 border-rose-800/30 opacity-70'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-300">
                    {comp.manufacturer}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Tier {comp.tierScore}/10
                  </span>
                  {!comp.isAvailable && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                      Out of Stock
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white font-['Space_Grotesk'] truncate mt-0.5">
                  {comp.model}
                </h4>
                <p className="text-[11px] text-slate-400 font-['Inter'] truncate">
                  {comp.specifications}
                </p>
              </div>

              {/* Price Editor & Stock Toggle */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    defaultValue={comp.priceUsd}
                    onBlur={(e) => handleUpdatePrice(comp.id, Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded bg-black/50 border border-white/10 text-xs font-mono text-white text-right focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleAvailability(comp.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    comp.isAvailable
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                  }`}
                >
                  {comp.isAvailable ? 'In Stock' : 'Mark Stocked'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>{filtered.length} components listed in category</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
