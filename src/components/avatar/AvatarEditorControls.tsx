import React, { useState } from 'react';
import { 
  AvatarConfig, 
  AvatarPreset, 
  AccessoryType, 
  PredefinedColorPalette,
  AvatarVisualStyle,
  CharacterType,
  SkinTone,
  Hairstyle,
  HairColor,
  EyeShape,
  EyeColor,
  OutfitCategory,
  GamingPersonality,
  AvatarBackground
} from '../../types/avatar';
import { 
  AVATAR_VISUAL_STYLES, 
  SKIN_TONES, 
  HAIRSTYLES, 
  HAIR_COLORS, 
  EYE_SHAPES, 
  EYE_COLORS, 
  OUTFIT_CATEGORIES, 
  ACCESSORIES, 
  GAMING_PERSONALITIES, 
  AVATAR_BACKGROUNDS, 
  PREDEFINED_PALETTES,
  AVATAR_PRESETS,
  GENRE_CATEGORIES
} from '../../data/avatarData';
import { 
  Palette, 
  User, 
  Sparkles, 
  Shirt, 
  Compass, 
  Image as ImageIcon, 
  Dice5, 
  Check, 
  Sliders, 
  Bot,
  Zap,
  Eye,
  Smile,
  Shield,
  Layers,
  Circle,
  Square
} from 'lucide-react';

interface AvatarEditorControlsProps {
  config: AvatarConfig;
  onChange: (updated: Partial<AvatarConfig>) => void;
  onRandomize: () => void;
  onSelectPreset: (preset: AvatarPreset) => void;
  onOpenAiMode?: () => void;
}

type TabKey = 'presets' | 'style-base' | 'hair-eyes' | 'outfit' | 'accessories' | 'personality' | 'background';

export const AvatarEditorControls: React.FC<AvatarEditorControlsProps> = ({
  config,
  onChange,
  onRandomize,
  onSelectPreset,
  onOpenAiMode
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('presets');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const filteredPresets = selectedGenre === 'all'
    ? AVATAR_PRESETS
    : AVATAR_PRESETS.filter(p => p.genre === selectedGenre);

  const toggleAccessory = (accId: AccessoryType) => {
    const current = config.accessories || [];
    if (current.includes(accId)) {
      onChange({ accessories: current.filter(a => a !== accId) });
    } else {
      onChange({ accessories: [...current, accId] });
    }
  };

  const applyPalette = (paletteKey: PredefinedColorPalette) => {
    const pal = PREDEFINED_PALETTES[paletteKey];
    if (!pal) return;
    onChange({
      outfitPrimaryColor: pal.primary,
      outfitSecondaryColor: pal.secondary,
      lightingColor: pal.lighting
    });
  };

  const tabs: Array<{ id: TabKey; label: string; icon: React.ReactNode }> = [
    { id: 'presets', label: 'Presets', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'style-base', label: 'Style & Face', icon: <User className="w-4 h-4" /> },
    { id: 'hair-eyes', label: 'Hair & Eyes', icon: <Eye className="w-4 h-4" /> },
    { id: 'outfit', label: 'Outfit & Colors', icon: <Shirt className="w-4 h-4" /> },
    { id: 'accessories', label: 'Gear & Props', icon: <Sliders className="w-4 h-4" /> },
    { id: 'personality', label: 'Gaming Style', icon: <Compass className="w-4 h-4" /> },
    { id: 'background', label: 'Background & FX', icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-5">
      {/* Top Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Controls</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Real-time Live Render
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAiMode && (
            <button
              type="button"
              onClick={onOpenAiMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium shadow-md transition-all active:scale-95"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Prompt Mode</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRandomize}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-all active:scale-95"
            title="Generate Random Avatar"
          >
            <Dice5 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Randomize</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'accessories' && (config.accessories?.length || 0) > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {config.accessories.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Presets & Genre Filter */}
      {activeTab === 'presets' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Genre Category Quick Filter Chips */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Filter by Gaming Genre:
              </span>
              <span className="text-xs text-cyan-400 font-medium">
                {filteredPresets.length} Avatars
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
              {GENRE_CATEGORIES.map((genre) => {
                const isSelected = selectedGenre === genre.id;
                const count = genre.id === 'all' 
                  ? AVATAR_PRESETS.length 
                  : AVATAR_PRESETS.filter(p => p.genre === genre.id).length;
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    <span>{genre.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-950/20 text-slate-900 font-extrabold' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span className="text-xs text-slate-400">Click any avatar to apply its character style:</span>
            <span className="text-xs text-slate-500">Universal Formats</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredPresets.map((preset) => {
              const isSelected = config.style === preset.config.style && config.outfit === preset.config.outfit;
              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 text-left relative group ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{preset.tagline}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{preset.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Style & Face */}
      {activeTab === 'style-base' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Visual Style Selection */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              1. Visual Rendering Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVATAR_VISUAL_STYLES.map((style) => {
                const isSelected = config.style === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onChange({ style: style.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/50'
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-medium text-xs truncate">{style.label}</span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">{style.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Character Type */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              2. Character Type & Silhouette
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['male', 'female', 'androgynous'] as CharacterType[]).map((type) => {
                const isSelected = config.characterType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange({ characterType: type })}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all text-center ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skin Tone Palette & Custom Color Picker */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. Skin Tone & Color Palette</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-cyan-400 font-mono">
                  {config.customSkinColor ? 'Custom Color' : (SKIN_TONES.find(s => s.id === config.skinTone)?.label || 'Warm')}
                </span>
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm"
                  style={{ backgroundColor: config.customSkinColor || (SKIN_TONES.find(s => s.id === config.skinTone)?.hex || '#fcd34d') }}
                />
              </div>
            </div>

            {/* Curated Skin Tone Color Palettes */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 font-medium">Palette Presets (Natural & Fantasy/Cyber):</span>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {SKIN_TONES.map((st) => {
                  const currentSkinHex = config.customSkinColor || (SKIN_TONES.find(s => s.id === config.skinTone)?.hex || '#fcd34d');
                  const isSelected = !config.customSkinColor ? config.skinTone === st.id : currentSkinHex.toLowerCase() === st.hex.toLowerCase();
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => onChange({ skinTone: st.id, customSkinColor: undefined })}
                      title={`${st.label}: ${st.desc} (${st.hex})`}
                      className={`h-10 rounded-xl border transition-all flex items-center justify-center relative ${
                        isSelected ? 'border-cyan-400 scale-105 shadow-md ring-2 ring-cyan-500/50' : 'border-slate-700/80 hover:scale-105'
                      }`}
                      style={{ backgroundColor: st.hex }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-slate-900 drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Skin Color Picker */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 mt-1">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div 
                  className="w-8 h-8 rounded-lg border border-white/20 shadow-inner shrink-0" 
                  style={{ backgroundColor: config.customSkinColor || (SKIN_TONES.find(s => s.id === config.skinTone)?.hex || '#fcd34d') }} 
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-200">Custom Skin Color Picker</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">
                    {config.customSkinColor || (SKIN_TONES.find(s => s.id === config.skinTone)?.hex || '#fcd34d')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <input
                  type="color"
                  value={
                    config.customSkinColor && config.customSkinColor.startsWith('#') && config.customSkinColor.length === 7
                      ? config.customSkinColor
                      : (SKIN_TONES.find(s => s.id === config.skinTone)?.hex || '#fcd34d')
                  }
                  onChange={(e) => {
                    const hex = e.target.value;
                    onChange({ customSkinColor: hex });
                  }}
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                  title="Pick custom skin color from picker"
                />
                <input
                  type="text"
                  value={config.customSkinColor || ''}
                  onChange={(e) => {
                    let val = e.target.value.trim();
                    if (val && !val.startsWith('#')) val = `#${val}`;
                    onChange({ customSkinColor: val });
                  }}
                  placeholder={SKIN_TONES.find(s => s.id === config.skinTone)?.hex || '#fcd34d'}
                  maxLength={7}
                  className="w-24 text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono uppercase focus:border-cyan-500 focus:outline-none"
                  title="Enter custom HEX code"
                />
                {config.customSkinColor && (
                  <button
                    type="button"
                    onClick={() => onChange({ customSkinColor: undefined })}
                    className="text-[11px] px-2 py-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors shrink-0"
                    title="Reset to preset palette"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Hair & Eyes */}
      {activeTab === 'hair-eyes' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Hairstyles */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              1. Hairstyle
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {HAIRSTYLES.map((hair) => {
                const isSelected = config.hairstyle === hair.id;
                return (
                  <button
                    key={hair.id}
                    type="button"
                    onClick={() => onChange({ hairstyle: hair.id })}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    {hair.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hair Colors */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                2. Hair Color
              </label>
              <span className="text-xs text-cyan-400 capitalize">
                {HAIR_COLORS.find(h => h.id === config.hairColor)?.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {HAIR_COLORS.map((hc) => {
                const isSelected = config.hairColor === hc.id;
                return (
                  <button
                    key={hc.id}
                    type="button"
                    onClick={() => onChange({ hairColor: hc.id })}
                    title={hc.label}
                    className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center ${
                      isSelected ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-105' : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: hc.hex }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />}
                  </button>
                );
              })}

              {/* Custom Hair Color Picker */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                <input
                  type="color"
                  value={config.customHairColor || '#ec4899'}
                  onChange={(e) => onChange({ hairColor: 'custom', customHairColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  title="Custom Hair Color"
                />
                <span className="text-[11px] text-slate-400">Custom</span>
              </div>
            </div>
          </div>

          {/* Eye Shape */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              3. Eye Shape & Expression
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EYE_SHAPES.map((es) => {
                const isSelected = config.eyeShape === es.id;
                return (
                  <button
                    key={es.id}
                    type="button"
                    onClick={() => onChange({ eyeShape: es.id })}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left truncate ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    {es.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Eye Color */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                4. Eye Color
              </label>
              <span className="text-xs text-cyan-400">
                {EYE_COLORS.find(e => e.id === config.eyeColor)?.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {EYE_COLORS.map((ec) => {
                const isSelected = config.eyeColor === ec.id;
                return (
                  <button
                    key={ec.id}
                    type="button"
                    onClick={() => onChange({ eyeColor: ec.id })}
                    title={ec.label}
                    className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center ${
                      isSelected ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-105' : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: ec.hex }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Outfit & Colors */}
      {activeTab === 'outfit' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Outfit Categories */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              1. Clothing & Armor Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {OUTFIT_CATEGORIES.map((outfit) => {
                const isSelected = config.outfit === outfit.id;
                return (
                  <button
                    key={outfit.id}
                    type="button"
                    onClick={() => onChange({ outfit: outfit.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/50'
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-medium text-xs">{outfit.label}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{outfit.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Predefined Color Palettes */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              2. Predefined Gaming Color Palettes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(PREDEFINED_PALETTES) as PredefinedColorPalette[]).map((key) => {
                const pal = PREDEFINED_PALETTES[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPalette(key)}
                    className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 transition-all"
                  >
                    <span className="text-xs font-medium text-slate-300 truncate">{pal.name}</span>
                    <div className="flex items-center -space-x-1 shrink-0">
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-900" style={{ backgroundColor: pal.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-900" style={{ backgroundColor: pal.secondary }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Outfit Primary and Accent Colors */}
          <div className="flex flex-col gap-2.5 border-t border-slate-800 pt-4">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              3. Fine-Tune Colors
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-300">Primary Color</span>
                  <span className="text-[10px] text-slate-500">{config.outfitPrimaryColor}</span>
                </div>
                <input
                  type="color"
                  value={config.outfitPrimaryColor}
                  onChange={(e) => onChange({ outfitPrimaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-300">Accent / Trim Color</span>
                  <span className="text-[10px] text-slate-500">{config.outfitSecondaryColor}</span>
                </div>
                <input
                  type="color"
                  value={config.outfitSecondaryColor}
                  onChange={(e) => onChange({ outfitSecondaryColor: e.target.value })}
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Accessories */}
      {activeTab === 'accessories' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Equip multiple accessories and gaming props simultaneously:
            </span>
            <span className="text-xs text-cyan-400 font-semibold">
              {(config.accessories || []).length} Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
            {ACCESSORIES.map((acc) => {
              const isEquipped = (config.accessories || []).includes(acc.id);
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => toggleAccessory(acc.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                    isEquipped
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/40'
                      : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-medium truncate">{acc.label}</span>
                  <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                    isEquipped ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-700'
                  }`}>
                    {isEquipped && <Check className="w-3 h-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 6: Gaming Personality */}
      {activeTab === 'personality' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              What's Your Gaming Style?
            </span>
            <span className="text-xs text-slate-400">
              Select your gamer archetype to adjust facial demeanor and unlock a distinctive style emblem:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
            {GAMING_PERSONALITIES.map((gp) => {
              const isSelected = config.gamingPersonality === gp.id;
              return (
                <button
                  key={gp.id}
                  type="button"
                  onClick={() => onChange({ gamingPersonality: gp.id })}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/50 shadow-sm'
                      : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-slate-200 truncate">{gp.label}</span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: gp.favoredColor }} />
                  </div>
                  <span className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{gp.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 7: Background & FX */}
      {activeTab === 'background' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Background Scene Selector */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              1. Gaming Environment Background
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {AVATAR_BACKGROUNDS.map((bg) => {
                const isSelected = config.background === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => onChange({ background: bg.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-medium truncate">{bg.label}</span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">{bg.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transparency & Effects Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-800 pt-4">
            {/* Transparent BG Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-300">Transparent PNG Cutout</span>
                <span className="text-[10px] text-slate-500">Omits background for Discord/Steam</span>
              </div>
              <button
                type="button"
                onClick={() => onChange({ isTransparentBg: !config.isTransparentBg })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  config.isTransparentBg ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  config.isTransparentBg ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Aura Glow Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-300">Ambient Aura Glow</span>
                <span className="text-[10px] text-slate-500">Illuminates character silhouette</span>
              </div>
              <button
                type="button"
                onClick={() => onChange({ enableAura: !config.enableAura })}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  config.enableAura ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  config.enableAura ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Lighting Aura Color & Preview Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lighting Color Picker */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-300">Aura & Edge Lighting Color</span>
                <span className="text-[10px] text-slate-500">{config.lightingColor}</span>
              </div>
              <input
                type="color"
                value={config.lightingColor}
                onChange={(e) => onChange({ lightingColor: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>

            {/* Preview Frame Mode: Square vs Circle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-300">Preview Shape</span>
                <span className="text-[10px] text-slate-500">Preview as square or circle (download is full square)</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => onChange({ previewMode: 'square' })}
                  className={`p-1.5 rounded-md ${
                    config.previewMode === 'square' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="Square Preview"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ previewMode: 'circle' })}
                  className={`p-1.5 rounded-md ${
                    config.previewMode === 'circle' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="Circle Preview"
                >
                  <Circle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
