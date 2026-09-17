import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { AvatarConfig, AvatarVisualStyle, SkinTone } from '../../types/avatar';
import { SKIN_TONES, HAIR_COLORS, EYE_COLORS } from '../../data/avatarData';

export interface AvatarRendererRef {
  exportAvatar: (format?: 'png' | 'jpeg' | 'webp', size?: number, transparentBg?: boolean) => Promise<string>;
  getSvgString: (transparentBg?: boolean) => string;
}

interface AvatarRendererProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
  id?: string;
}

export const AvatarRenderer = forwardRef<AvatarRendererRef, AvatarRendererProps>(({
  config,
  size = 380,
  className = '',
  id = 'game-avatar-canvas'
}, ref) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Helper colors
  const skin = SKIN_TONES.find(s => s.id === config.skinTone) || SKIN_TONES[1];
  const hairColorHex = config.hairColor === 'custom' && config.customHairColor 
    ? config.customHairColor 
    : (HAIR_COLORS.find(h => h.id === config.hairColor)?.hex || '#18181b');
  const eyeColorHex = EYE_COLORS.find(e => e.id === config.eyeColor)?.hex || '#2563eb';
  const primaryColor = config.outfitPrimaryColor || '#1e1b4b';
  const secondaryColor = config.outfitSecondaryColor || '#06b6d4';
  const lightingColor = config.lightingColor || '#06b6d4';

  // Expose export helpers
  useImperativeHandle(ref, () => ({
    getSvgString: (transparent = config.isTransparentBg) => {
      if (!svgRef.current) return '';
      const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
      
      // CRITICAL: In downloaded/exported images, strictly keep full square dimension and avoid circular background!
      clone.querySelectorAll('[clip-path], [clipPath]').forEach(el => {
        el.removeAttribute('clip-path');
        el.removeAttribute('clipPath');
      });

      // If transparent requested, remove background group
      if (transparent) {
        const bgGroup = clone.querySelector('#avatar-bg-layer');
        if (bgGroup) bgGroup.remove();
      }

      // Ensure explicit width/height
      clone.setAttribute('width', '1024');
      clone.setAttribute('height', '1024');
      clone.setAttribute('viewBox', '0 0 500 500');
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      return new XMLSerializer().serializeToString(clone);
    },
    exportAvatar: async (format: 'png' | 'jpeg' | 'webp' = 'png', exportSize = 1024, transparent = config.isTransparentBg) => {
      return new Promise<string>((resolve, reject) => {
        try {
          if (!svgRef.current) {
            return reject(new Error('Avatar SVG element not found'));
          }

          const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
          
          // CRITICAL: In downloaded/exported images, strictly keep full square dimension and avoid circular background!
          clone.querySelectorAll('[clip-path], [clipPath]').forEach(el => {
            el.removeAttribute('clip-path');
            el.removeAttribute('clipPath');
          });

          if (transparent && format === 'png') {
            const bgGroup = clone.querySelector('#avatar-bg-layer');
            if (bgGroup) bgGroup.remove();
          }

          clone.setAttribute('width', String(exportSize));
          clone.setAttribute('height', String(exportSize));
          clone.setAttribute('viewBox', '0 0 500 500');
          clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

          const svgData = new XMLSerializer().serializeToString(clone);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const blobUrl = URL.createObjectURL(svgBlob);

          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = exportSize;
            canvas.height = exportSize;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              URL.revokeObjectURL(blobUrl);
              return reject(new Error('Canvas context could not be created'));
            }

            // Fill solid dark/custom background for JPG or non-transparent exports
            if (format === 'jpeg' || (!transparent && format !== 'png')) {
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(0, 0, exportSize, exportSize);
            }

            // Draw full square image onto canvas (never clipped)
            ctx.drawImage(image, 0, 0, exportSize, exportSize);
            URL.revokeObjectURL(blobUrl);

            const mimeType = format === 'jpeg' ? 'image/jpeg' : (format === 'webp' ? 'image/webp' : 'image/png');
            const dataUrl = canvas.toDataURL(mimeType, 0.95);
            resolve(dataUrl);
          };

          image.onerror = (err) => {
            URL.revokeObjectURL(blobUrl);
            reject(err);
          };

          image.src = blobUrl;
        } catch (err) {
          reject(err);
        }
      });
    }
  }));

  // Background Renderers
  const renderBackground = () => {
    if (config.isTransparentBg) {
      return null;
    }

    switch (config.background) {
      case 'gaming-room':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="#090d16" />
            {/* Hexagonal Soundproofing Wall Panels */}
            <g opacity="0.15" stroke={lightingColor} strokeWidth="1.5" fill="none">
              <polygon points="50,40 80,25 110,40 110,75 80,90 50,75" />
              <polygon points="120,40 150,25 180,40 180,75 150,90 120,75" />
              <polygon points="320,40 350,25 380,40 380,75 350,90 320,75" />
              <polygon points="390,40 420,25 450,40 450,75 420,90 390,75" />
              <polygon points="85,100 115,85 145,100 145,135 115,150 85,135" />
              <polygon points="355,100 385,85 415,100 415,135 385,150 355,135" />
            </g>
            {/* RGB Ambient Wall Light Bars */}
            <rect x="20" y="30" width="8" height="260" rx="4" fill={lightingColor} filter="url(#glow-blur)" opacity="0.85" />
            <rect x="472" y="30" width="8" height="260" rx="4" fill={secondaryColor} filter="url(#glow-blur)" opacity="0.85" />
            {/* Ultrawide Gaming Monitor Silhouettes in background */}
            <path d="M 30,360 Q 120,340 220,345 L 220,440 L 30,440 Z" fill="#030712" stroke="#1f2937" strokeWidth="2" opacity="0.8" />
            <path d="M 470,360 Q 380,340 280,345 L 280,440 L 470,440 Z" fill="#030712" stroke="#1f2937" strokeWidth="2" opacity="0.8" />
            {/* Desk Surface glow line */}
            <line x1="0" y1="410" x2="500" y2="410" stroke={lightingColor} strokeWidth="3" opacity="0.7" filter="url(#glow-blur)" />
          </g>
        );

      case 'neon-city':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="url(#bg-neon-sky)" />
            {/* Distant Skyscrapers */}
            <rect x="30" y="140" width="45" height="360" fill="#0a0a1f" />
            <rect x="85" y="90" width="55" height="410" fill="#050515" />
            <rect x="150" y="180" width="40" height="320" fill="#0f0c29" />
            <rect x="310" y="110" width="60" height="390" fill="#08071e" />
            <rect x="380" y="70" width="50" height="430" fill="#030310" />
            <rect x="440" y="150" width="45" height="350" fill="#0c0a24" />
            {/* Skyscraper Windows & Neon Lights */}
            <line x1="90" y1="95" x2="90" y2="480" stroke="#06b6d4" strokeDasharray="3,8" strokeWidth="2" opacity="0.6" />
            <line x1="130" y1="95" x2="130" y2="480" stroke="#a855f7" strokeDasharray="3,8" strokeWidth="2" opacity="0.6" />
            <line x1="390" y1="75" x2="390" y2="480" stroke="#ec4899" strokeDasharray="3,8" strokeWidth="2" opacity="0.6" />
            <line x1="420" y1="75" x2="420" y2="480" stroke="#06b6d4" strokeDasharray="3,8" strokeWidth="2" opacity="0.6" />
            {/* Cyber Grid Horizon */}
            <line x1="0" y1="360" x2="500" y2="360" stroke="#a855f7" strokeWidth="2" filter="url(#glow-blur)" />
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={50 + i * 50} y1="360" x2={i * 65} y2="500" stroke="#06b6d4" strokeWidth="1" opacity="0.35" />
            ))}
          </g>
        );

      case 'space-station':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="#020617" />
            {/* Cosmic Nebula Cloud */}
            <circle cx="380" cy="120" r="140" fill="url(#space-nebula)" opacity="0.4" />
            <circle cx="100" cy="200" r="90" fill="url(#space-nebula-cyan)" opacity="0.35" />
            {/* Starfield */}
            {[[40, 60], [80, 110], [130, 40], [200, 70], [280, 30], [340, 80], [420, 50], [460, 130], [45, 230], [460, 260]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i % 2 === 0 ? 1.5 : 2.5} fill="#ffffff" opacity={0.7 + (i % 3) * 0.1} />
            ))}
            {/* Structural Square Window Bulkheads & Telemetry Trusses */}
            <rect x="0" y="0" width="36" height="500" fill="#0f172a" />
            <rect x="464" y="0" width="36" height="500" fill="#0f172a" />
            <rect x="0" y="0" width="500" height="28" fill="#1e293b" />
            <line x1="36" y1="0" x2="36" y2="500" stroke="#0284c7" strokeWidth="2.5" opacity="0.7" />
            <line x1="464" y1="0" x2="464" y2="500" stroke="#0284c7" strokeWidth="2.5" opacity="0.7" />
            <line x1="0" y1="28" x2="500" y2="28" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />
            {/* Corner Truss Gussets */}
            <polygon points="0,0 80,0 0,80" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <polygon points="500,0 420,0 500,80" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            {/* Holographic Nav Matrix grid */}
            <line x1="80" y1="380" x2="420" y2="380" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6,4" opacity="0.4" />
          </g>
        );

      case 'fantasy-kingdom':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="url(#bg-fantasy-sky)" />
            {/* Arcane Crescent Moon */}
            <path d="M 400,60 A 45,45 0 1 0 450,140 A 55,55 0 0 1 400,60 Z" fill="#fef08a" opacity="0.85" filter="url(#glow-blur)" />
            {/* Castle Spires */}
            <path d="M 20,380 L 20,240 L 45,210 L 70,240 L 70,380 Z" fill="#1e1b4b" opacity="0.9" />
            <path d="M 70,380 L 70,260 L 95,230 L 120,260 L 120,380 Z" fill="#171438" />
            <path d="M 370,380 L 370,230 L 395,190 L 420,230 L 420,380 Z" fill="#171438" />
            <path d="M 420,380 L 420,270 L 445,240 L 470,270 L 470,380 Z" fill="#1e1b4b" opacity="0.9" />
            {/* Floating Magical Runes & Sparks */}
            <circle cx="160" cy="120" r="3" fill="#c084fc" filter="url(#glow-blur)" />
            <circle cx="320" cy="90" r="4" fill="#a855f7" filter="url(#glow-blur)" />
            <circle cx="230" cy="60" r="2.5" fill="#f472b6" filter="url(#glow-blur)" />
          </g>
        );

      case 'dark-forest':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="url(#bg-forest-sky)" />
            {/* Eerie Mist Moon */}
            <circle cx="250" cy="110" r="60" fill="#f1f5f9" opacity="0.3" filter="url(#glow-blur)" />
            {/* Distant Pine Silhouettes */}
            <path d="M 0,340 L 40,240 L 80,340 L 120,220 L 160,340 L 200,260 L 250,340 L 300,250 L 350,340 L 400,210 L 450,340 L 500,230 L 500,500 L 0,500 Z" fill="#09141f" opacity="0.7" />
            {/* Foreground Pines */}
            <path d="M -10,380 L 30,270 L 70,380 L 110,290 L 150,380 Z" fill="#03080e" />
            <path d="M 350,380 L 390,280 L 430,380 L 470,260 L 510,380 Z" fill="#03080e" />
            {/* Glowing Fireflies */}
            <circle cx="80" cy="190" r="3" fill="#fef08a" filter="url(#glow-blur)" opacity="0.8" />
            <circle cx="410" cy="210" r="2.5" fill="#a7f3d0" filter="url(#glow-blur)" opacity="0.8" />
            <circle cx="130" cy="300" r="3" fill="#bef264" filter="url(#glow-blur)" opacity="0.7" />
          </g>
        );

      case 'futuristic-battlefield':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="#0c0a09" />
            {/* Smoke & Embers Gradient */}
            <rect width="500" height="500" fill="url(#bg-battle-smoke)" opacity="0.6" />
            {/* Laser Grid / Barriers */}
            <line x1="20" y1="80" x2="480" y2="400" stroke="#ef4444" strokeWidth="2" opacity="0.5" filter="url(#glow-blur)" />
            <line x1="480" y1="60" x2="20" y2="420" stroke="#f97316" strokeWidth="1.5" opacity="0.4" filter="url(#glow-blur)" />
            {/* Hex Shield Arcs */}
            <circle cx="250" cy="250" r="210" stroke="#f97316" strokeWidth="1" strokeDasharray="6,12" fill="none" opacity="0.3" />
            {/* Orange Particle Sparks */}
            {[[70, 150], [120, 90], [390, 120], [440, 220], [350, 60]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={2} fill="#fb923c" filter="url(#glow-blur)" />
            ))}
          </g>
        );

      case 'cyberpunk-street':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="#0b0717" />
            {/* Vertical Rain Streaks */}
            {Array.from({ length: 18 }).map((_, i) => (
              <line 
                key={i} 
                x1={20 + i * 27} 
                y1="0" 
                x2={10 + i * 27} 
                y2="500" 
                stroke="#38bdf8" 
                strokeWidth="0.8" 
                opacity={0.15 + (i % 4) * 0.05} 
                strokeDasharray="15,40" 
              />
            ))}
            {/* Holographic Street Signs */}
            <rect x="35" y="80" width="30" height="110" rx="3" fill="#e11d48" opacity="0.2" stroke="#e11d48" strokeWidth="1.5" />
            <text x="50" y="115" fill="#f43f5e" fontSize="13" fontFamily="monospace" textAnchor="middle" filter="url(#glow-blur)">電</text>
            <text x="50" y="145" fill="#f43f5e" fontSize="13" fontFamily="monospace" textAnchor="middle" filter="url(#glow-blur)">気</text>
            <text x="50" y="175" fill="#f43f5e" fontSize="13" fontFamily="monospace" textAnchor="middle" filter="url(#glow-blur)">街</text>
            
            <rect x="435" y="90" width="30" height="110" rx="3" fill="#06b6d4" opacity="0.2" stroke="#06b6d4" strokeWidth="1.5" />
            <text x="450" y="125" fill="#22d3ee" fontSize="13" fontFamily="monospace" textAnchor="middle" filter="url(#glow-blur)">攻</text>
            <text x="450" y="155" fill="#22d3ee" fontSize="13" fontFamily="monospace" textAnchor="middle" filter="url(#glow-blur)">殻</text>
            <text x="450" y="185" fill="#22d3ee" fontSize="13" fontFamily="monospace" textAnchor="middle" filter="url(#glow-blur)">機</text>
          </g>
        );

      case 'esports-arena':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="#030712" />
            {/* Arena Spotlights intersecting */}
            <polygon points="40,0 200,500 0,500" fill="url(#spotlight-left)" opacity="0.4" />
            <polygon points="460,0 500,500 300,500" fill="url(#spotlight-right)" opacity="0.4" />
            {/* Steel Ceiling Truss */}
            <line x1="0" y1="35" x2="500" y2="35" stroke="#334155" strokeWidth="6" />
            <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeWidth="4" />
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={i} x1={i * 50} y1="35" x2={25 + i * 50} y2="50" stroke="#475569" strokeWidth="2" />
            ))}
            {/* Cheering Crowd Silhouettes */}
            <path d="M 0,440 Q 60,420 120,440 Q 180,415 250,440 Q 320,410 400,440 Q 450,420 500,440 L 500,500 L 0,500 Z" fill="#090d16" />
            {/* Raised Hand Silhouettes */}
            {[[45, 420], [95, 415], [145, 418], [355, 412], [415, 415], [465, 422]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="6" fill="#090d16" />
            ))}
          </g>
        );

      case 'arcade':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="#13032b" />
            {/* 80s Retrowave Gradient Sun */}
            <circle cx="250" cy="220" r="110" fill="url(#retrowave-sun)" />
            {/* Sun Horizontal Slices */}
            {[230, 248, 264, 278, 290, 300, 310].map((y, i) => (
              <rect key={i} x="130" y={y} width="240" height={4 + i * 1.5} fill="#13032b" />
            ))}
            {/* Wireframe Floor Grid */}
            <line x1="0" y1="330" x2="500" y2="330" stroke="#ec4899" strokeWidth="2" filter="url(#glow-blur)" />
            {[345, 365, 395, 435, 485].map((y, i) => (
              <line key={i} x1="0" y1={y} x2="500" y2={y} stroke="#a855f7" strokeWidth="1.5" opacity={0.6} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1="250" y1="330" x2={-20 + i * 67} y2="500" stroke="#06b6d4" strokeWidth="1.5" opacity={0.5} />
            ))}
          </g>
        );

      case 'snowy-mountain':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="#040d1a" />
            {/* Aurora Borealis Waves */}
            <path d="M 0,110 Q 140,50 250,110 T 500,70 L 500,200 Q 360,160 250,210 T 0,150 Z" fill="url(#aurora-green)" opacity="0.45" filter="url(#glow-blur)" />
            {/* Distant Mountains */}
            <polygon points="20,360 130,220 220,360" fill="#0f172a" />
            <polygon points="120,230 130,220 145,245 140,260 120,250" fill="#cbd5e1" opacity="0.8" />
            <polygon points="280,360 380,190 480,360" fill="#0f172a" />
            <polygon points="370,205 380,190 395,215 390,230 370,220" fill="#cbd5e1" opacity="0.8" />
            {/* Foreground Peaks */}
            <polygon points="-30,400 60,260 160,400" fill="#1e293b" />
            <polygon points="340,400 440,240 530,400" fill="#1e293b" />
          </g>
        );

      case 'desert-landscape':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="url(#bg-desert-sky)" />
            {/* Giant Ringed Planetary Moon */}
            <circle cx="120" cy="110" r="50" fill="#fbbf24" opacity="0.85" />
            <ellipse cx="120" cy="110" rx="80" ry="16" fill="none" stroke="#fef08a" strokeWidth="3" opacity="0.6" transform="rotate(-25 120 110)" />
            {/* Sand Dunes */}
            <path d="M 0,320 Q 140,290 280,340 T 500,310 L 500,500 L 0,500 Z" fill="#78350f" opacity="0.7" />
            <path d="M 0,380 Q 200,340 370,390 T 500,370 L 500,500 L 0,500 Z" fill="#451a03" />
          </g>
        );

      case 'sci-fi-laboratory':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="#030712" />
            {/* Diagnostic HUD Circular Dial */}
            <circle cx="250" cy="240" r="190" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="8,6" opacity="0.3" />
            <circle cx="250" cy="240" r="160" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,12" opacity="0.2" />
            {/* Cryo Tube Chambers on Left and Right */}
            <rect x="25" y="60" width="40" height="340" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
            <circle cx="45" cy="120" r="4" fill="#38bdf8" opacity="0.6" />
            <circle cx="45" cy="200" r="5" fill="#38bdf8" opacity="0.5" />
            <circle cx="45" cy="280" r="3" fill="#38bdf8" opacity="0.7" />
            
            <rect x="435" y="60" width="40" height="340" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
            <circle cx="455" cy="140" r="5" fill="#38bdf8" opacity="0.5" />
            <circle cx="455" cy="220" r="3" fill="#38bdf8" opacity="0.7" />
          </g>
        );

      case 'abstract':
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill="#0a0a16" />
            {/* Geometric Neon Polygons */}
            <polygon points="0,0 220,0 80,240" fill={primaryColor} opacity="0.35" />
            <polygon points="500,0 280,0 420,240" fill={secondaryColor} opacity="0.35" />
            <polygon points="0,500 160,320 320,500" fill={lightingColor} opacity="0.25" />
            <polygon points="500,500 360,340 220,500" fill={primaryColor} opacity="0.25" />
            {/* Glowing Bokeh Orbs */}
            <circle cx="100" cy="140" r="60" fill={secondaryColor} opacity="0.25" filter="url(#glow-blur)" />
            <circle cx="400" cy="160" r="70" fill={lightingColor} opacity="0.2" filter="url(#glow-blur)" />
          </g>
        );

      case 'solid':
      default:
        return (
          <g id="avatar-bg-layer">
            <rect width="500" height="500" fill={config.customBackgroundColor || "url(#bg-studio-grad)"} />
          </g>
        );
    }
  };

  // Hairstyle Back (rendered behind head for long hair / ponytails)
  const renderBackHair = () => {
    switch (config.hairstyle) {
      case 'long':
        return (
          <g id="hair-back">
            <path d="M 160,200 C 130,280 110,400 130,460 C 160,450 180,360 190,260 Z" fill={hairColorHex} />
            <path d="M 340,200 C 370,280 390,400 370,460 C 340,450 320,360 310,260 Z" fill={hairColorHex} />
          </g>
        );
      case 'ponytail':
        return (
          <g id="hair-back">
            <path d="M 320,150 Q 420,180 410,320 Q 380,350 340,240 Z" fill={hairColorHex} />
          </g>
        );
      case 'braided':
        return (
          <g id="hair-back">
            <path d="M 165,220 Q 130,300 140,440 Q 155,440 175,260 Z" fill={hairColorHex} stroke="#18181b" strokeWidth="1" strokeDasharray="10,6" />
            <path d="M 335,220 Q 370,300 360,440 Q 345,440 325,260 Z" fill={hairColorHex} stroke="#18181b" strokeWidth="1" strokeDasharray="10,6" />
          </g>
        );
      case 'curly':
        return (
          <g id="hair-back">
            <circle cx="160" cy="220" r="35" fill={hairColorHex} />
            <circle cx="145" cy="260" r="32" fill={hairColorHex} />
            <circle cx="340" cy="220" r="35" fill={hairColorHex} />
            <circle cx="355" cy="260" r="32" fill={hairColorHex} />
          </g>
        );
      default:
        return null;
    }
  };

  // Outfit / Clothing Layer
  const renderOutfit = () => {
    switch (config.outfit) {
      case 'gaming-hoodie':
        return (
          <g id="outfit-layer">
            {/* Torso Base */}
            <path d="M 130,380 C 130,330 200,310 250,310 C 300,310 370,330 370,380 L 390,500 L 110,500 Z" fill={primaryColor} />
            {/* Hood Folds on Shoulders */}
            <path d="M 175,310 Q 250,355 325,310 Q 355,340 340,380 Q 250,400 160,380 Q 145,340 175,310 Z" fill={secondaryColor} opacity="0.95" />
            {/* Drawstrings */}
            <path d="M 215,350 Q 215,410 215,430" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
            <circle cx="215" cy="433" r="3" fill="#f8fafc" />
            <path d="M 285,350 Q 285,410 285,430" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
            <circle cx="285" cy="433" r="3" fill="#f8fafc" />
            {/* Chest Logo: Stylized Game Controller / Vault Crest */}
            <g transform="translate(250, 420) scale(0.7)">
              <rect x="-35" y="-18" width="70" height="36" rx="14" fill="#090d16" stroke={secondaryColor} strokeWidth="2" />
              {/* D-Pad */}
              <rect x="-24" y="-8" width="16" height="16" rx="3" fill={secondaryColor} />
              {/* Action Buttons */}
              <circle cx="14" cy="-4" r="3" fill="#ec4899" />
              <circle cx="22" cy="3" r="3" fill="#38bdf8" />
            </g>
          </g>
        );

      case 'tactical-outfit':
        return (
          <g id="outfit-layer">
            <path d="M 130,370 C 130,330 200,310 250,310 C 300,310 370,330 370,370 L 390,500 L 110,500 Z" fill={primaryColor} />
            {/* Tactical Vest Plate */}
            <path d="M 160,330 L 340,330 L 330,480 L 170,480 Z" fill="#292524" stroke="#44403c" strokeWidth="2" />
            {/* MOLLE Webbing Lines */}
            <line x1="180" y1="370" x2="320" y2="370" stroke={secondaryColor} strokeWidth="3" strokeDasharray="14,6" />
            <line x1="180" y1="405" x2="320" y2="405" stroke={secondaryColor} strokeWidth="3" strokeDasharray="14,6" />
            <line x1="180" y1="440" x2="320" y2="440" stroke={secondaryColor} strokeWidth="3" strokeDasharray="14,6" />
            {/* Chest Radio / Comms Box */}
            <rect x="180" y="340" width="28" height="22" rx="3" fill="#1c1917" stroke="#78716c" strokeWidth="1.5" />
            <circle cx="194" cy="351" r="3" fill="#22c55e" />
          </g>
        );

      case 'cyberpunk-jacket':
        return (
          <g id="outfit-layer">
            <path d="M 120,380 C 120,320 200,310 250,310 C 300,310 380,320 380,380 L 400,500 L 100,500 Z" fill={primaryColor} />
            {/* Asymmetrical High Tech Collar */}
            <path d="M 150,340 L 180,260 L 230,330 Z" fill="#0f172a" stroke={secondaryColor} strokeWidth="2" />
            <path d="M 350,340 L 320,250 L 270,330 Z" fill="#0f172a" stroke={secondaryColor} strokeWidth="2" />
            {/* Fiber Optic Neon Trim */}
            <path d="M 180,260 L 240,490" stroke={secondaryColor} strokeWidth="4" filter="url(#glow-blur)" />
            <path d="M 320,250 L 260,490" stroke={lightingColor} strokeWidth="4" filter="url(#glow-blur)" />
            {/* Cyber Lapel Tech Circuit */}
            <circle cx="210" cy="370" r="4" fill={lightingColor} />
            <line x1="210" y1="370" x2="230" y2="400" stroke={lightingColor} strokeWidth="2" />
          </g>
        );

      case 'fantasy-armor':
        return (
          <g id="outfit-layer">
            <path d="M 125,380 C 125,320 195,300 250,300 C 305,300 375,320 375,380 L 395,500 L 105,500 Z" fill="#334155" />
            {/* Steel Breastplate */}
            <path d="M 160,330 Q 250,360 340,330 L 325,480 Q 250,510 175,480 Z" fill={primaryColor} stroke="#94a3b8" strokeWidth="3" />
            {/* Dragon Crest Ingot */}
            <path d="M 250,350 L 270,380 L 250,420 L 230,380 Z" fill={secondaryColor} stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Gold / Brass filigree */}
            <path d="M 190,360 Q 250,380 310,360" stroke={secondaryColor} strokeWidth="2.5" fill="none" />
          </g>
        );

      case 'sci-fi-armor':
        return (
          <g id="outfit-layer">
            <path d="M 120,380 C 120,320 190,305 250,305 C 310,305 380,320 380,380 L 400,500 L 100,500 Z" fill="#09090b" />
            {/* Nanosuit Segmented Chest Plates */}
            <polygon points="170,330 240,330 230,410 160,390" fill={primaryColor} stroke={secondaryColor} strokeWidth="2" />
            <polygon points="330,330 260,330 270,410 340,390" fill={primaryColor} stroke={secondaryColor} strokeWidth="2" />
            {/* Glowing Power Conduits */}
            <path d="M 250,330 L 250,470" stroke={lightingColor} strokeWidth="5" filter="url(#glow-blur)" />
            <polygon points="210,430 290,430 270,480 230,480" fill="#18181b" stroke={secondaryColor} strokeWidth="1.5" />
          </g>
        );

      case 'streetwear':
        return (
          <g id="outfit-layer">
            <path d="M 125,380 C 125,320 200,310 250,310 C 300,310 375,320 375,380 L 395,500 L 105,500 Z" fill={primaryColor} />
            {/* Open Zipper revealing Graphic Tee */}
            <polygon points="230,330 270,330 285,500 215,500" fill="#020617" />
            <text x="250" y="415" fill={secondaryColor} fontSize="14" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">VAULT</text>
            {/* Tech Lanyard */}
            <path d="M 220,330 Q 235,420 235,460" stroke="#f43f5e" strokeWidth="3" />
          </g>
        );

      case 'esports-jersey':
        return (
          <g id="outfit-layer">
            <path d="M 125,370 C 125,325 195,310 250,310 C 305,310 375,325 375,370 L 395,500 L 105,500 Z" fill={primaryColor} />
            {/* Dynamic V-neck athletic collar */}
            <polygon points="215,310 285,310 250,355" fill="#f8fafc" />
            {/* Dynamic Speed Chevrons */}
            <polygon points="140,360 210,390 190,430 120,400" fill={secondaryColor} />
            <polygon points="360,360 290,390 310,430 380,400" fill={secondaryColor} />
            {/* Pro Player Crest */}
            <circle cx="250" cy="410" r="16" fill="#0f172a" stroke="#f8fafc" strokeWidth="2" />
            <text x="250" y="415" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">PRO</text>
          </g>
        );

      case 'space-suit':
        return (
          <g id="outfit-layer">
            <path d="M 120,370 C 120,310 190,295 250,295 C 310,295 380,310 380,370 L 400,500 L 100,500 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            {/* Pressurized Airlock Neck Collar Ring */}
            <ellipse cx="250" cy="305" rx="80" ry="24" fill="#64748b" stroke="#334155" strokeWidth="4" />
            <ellipse cx="250" cy="305" rx="72" ry="18" fill="#1e293b" />
            {/* Chest Life-Support Console */}
            <rect x="205" y="370" width="90" height="60" rx="8" fill="#0f172a" stroke={secondaryColor} strokeWidth="2" />
            <circle cx="225" cy="395" r="7" fill="#22c55e" />
            <circle cx="245" cy="395" r="7" fill="#38bdf8" />
            <rect x="260" y="390" width="22" height="10" fill="#e11d48" />
            <line x1="215" y1="415" x2="285" y2="415" stroke={secondaryColor} strokeWidth="3" strokeDasharray="4,3" />
          </g>
        );

      case 'futuristic-suit':
        return (
          <g id="outfit-layer">
            <path d="M 125,380 C 125,320 200,310 250,310 C 300,310 375,320 375,380 L 395,500 L 105,500 Z" fill="#090d16" />
            {/* Tailored Lapels */}
            <polygon points="200,320 250,420 180,370" fill={primaryColor} stroke={secondaryColor} strokeWidth="1.5" />
            <polygon points="300,320 250,420 320,370" fill={primaryColor} stroke={secondaryColor} strokeWidth="1.5" />
            {/* Inner Neon Shirt & Tie */}
            <polygon points="235,320 265,320 250,400" fill="#18181b" />
            <polygon points="246,335 254,335 256,430 250,440 244,430" fill={lightingColor} filter="url(#glow-blur)" />
          </g>
        );

      case 'fantasy-robe':
        return (
          <g id="outfit-layer">
            <path d="M 120,380 C 120,310 190,300 250,300 C 310,300 380,310 380,380 L 400,500 L 100,500 Z" fill={primaryColor} />
            {/* Arcane Cowl Folds */}
            <path d="M 170,305 Q 250,370 330,305 Q 360,400 250,430 Q 140,400 170,305 Z" fill={secondaryColor} opacity="0.9" />
            {/* Runes along trim */}
            <line x1="250" y1="360" x2="250" y2="490" stroke="#fef08a" strokeWidth="2" strokeDasharray="6,8" />
          </g>
        );

      case 'casual-clothing':
      default:
        return (
          <g id="outfit-layer">
            <path d="M 130,380 C 130,330 200,315 250,315 C 300,315 370,330 370,380 L 390,500 L 110,500 Z" fill={primaryColor} />
            {/* Crewneck Collar */}
            <path d="M 210,315 Q 250,345 290,315" stroke={secondaryColor} strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
        );
    }
  };

  // Head, Neck & Face
  const renderHeadAndFace = () => {
    // Jaw shape variations
    const isFemale = config.characterType === 'female';
    const isMale = config.characterType === 'male';

    return (
      <g id="head-and-face">
        {/* Neck */}
        <path d="M 215,260 L 215,330 Q 250,345 285,330 L 285,260 Z" fill={skin.hex} />
        {/* Neck Shadow under chin for realistic ambient occlusion */}
        <path d="M 215,260 Q 250,295 285,260 L 285,280 Q 250,312 215,280 Z" fill="#000000" opacity="0.22" />

        {/* Ears */}
        <circle cx="165" cy="225" r="16" fill={skin.hex} />
        <circle cx="166" cy="225" r="10" fill="#000000" opacity="0.14" />
        <circle cx="335" cy="225" r="16" fill={skin.hex} />
        <circle cx="334" cy="225" r="10" fill="#000000" opacity="0.14" />

        {/* Head / Face Base */}
        <path 
          d={
            isFemale
              ? "M 175,170 C 175,100 325,100 325,170 C 325,235 295,275 250,275 C 205,275 175,235 175,170 Z"
              : isMale
              ? "M 170,170 C 170,95 330,95 330,170 C 330,240 305,280 250,280 C 195,280 170,240 170,170 Z"
              : "M 172,170 C 172,98 328,98 328,170 C 328,238 300,277 250,277 C 200,277 172,238 172,170 Z"
          } 
          fill={skin.hex} 
        />

        {/* Soft volumetric cheek & temple highlight */}
        <path 
          d="M 185,150 Q 250,135 315,150 Q 250,158 185,150 Z" 
          fill="#ffffff" 
          opacity="0.12" 
        />

        {/* Subtle jawline contour */}
        <path 
          d="M 195,250 Q 250,274 305,250" 
          stroke="#000000" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          fill="none" 
          opacity="0.15" 
        />

        {/* Nose */}
        <path d="M 250,195 L 246,220 L 254,220 Z" fill="#000000" opacity="0.2" />

        {/* Mouth & Expression */}
        {renderMouth()}

        {/* Eyes & Eyebrows */}
        {renderEyes()}
      </g>
    );
  };

  // Mouth Expression
  const renderMouth = () => {
    switch (config.gamingPersonality) {
      case 'competitive':
      case 'shooter-fan':
        return (
          // Determined Smirk
          <path d="M 235,242 Q 250,245 268,239" stroke="#374151" strokeWidth="3" strokeLinecap="round" fill="none" />
        );
      case 'horror-fan':
        // Stoic straight line
        return (
          <line x1="238" y1="244" x2="262" y2="244" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
        );
      case 'casual':
      case 'retro-gamer':
        // Friendly smile
        return (
          <path d="M 234,240 Q 250,252 266,240" stroke="#374151" strokeWidth="3" strokeLinecap="round" fill="none" />
        );
      case 'strategic':
      default:
        // Calm focused expression
        return (
          <path d="M 236,242 Q 250,246 264,242" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        );
    }
  };

  // Eyes & Eyebrows
  const renderEyes = () => {
    // Eyebrows
    const browColor = hairColorHex === '#ffffff' ? '#94a3b8' : hairColorHex;

    return (
      <g id="eyes-and-brows">
        {/* Left Eyebrow */}
        <path d="M 195,165 Q 215,160 230,166" stroke={browColor} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Right Eyebrow */}
        <path d="M 305,165 Q 285,160 270,166" stroke={browColor} strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Left Eye Sclera */}
        <ellipse cx="215" cy="185" rx="16" ry="11" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
        {/* Right Eye Sclera */}
        <ellipse cx="285" cy="185" rx="16" ry="11" fill="#f8fafc" stroke="#334155" strokeWidth="1" />

        {/* Irises */}
        <circle cx="216" cy="185" r="7.5" fill={eyeColorHex} />
        <circle cx="284" cy="185" r="7.5" fill={eyeColorHex} />

        {/* Pupils & Eye Specific Effects */}
        {config.eyeShape === 'glowing-slit' ? (
          <>
            <ellipse cx="216" cy="185" rx="2" ry="7" fill="#09090b" />
            <ellipse cx="284" cy="185" rx="2" ry="7" fill="#09090b" />
            <circle cx="216" cy="185" r="6" fill={eyeColorHex} opacity="0.5" filter="url(#glow-blur)" />
            <circle cx="284" cy="185" r="6" fill={eyeColorHex} opacity="0.5" filter="url(#glow-blur)" />
          </>
        ) : config.eyeShape === 'cyber-hud' ? (
          <>
            <circle cx="216" cy="185" r="3.5" fill="#09090b" />
            <circle cx="284" cy="185" r="3.5" fill="#09090b" />
            {/* Cybernetic Targeting Reticle on Right Eye */}
            <circle cx="284" cy="185" r="12" fill="none" stroke={lightingColor} strokeWidth="1.5" strokeDasharray="4,3" filter="url(#glow-blur)" />
            <line x1="284" y1="170" x2="284" y2="200" stroke={lightingColor} strokeWidth="1" />
            <line x1="269" y1="185" x2="299" y2="185" stroke={lightingColor} strokeWidth="1" />
          </>
        ) : config.eyeShape === 'anime-spark' ? (
          <>
            <circle cx="216" cy="185" r="4" fill="#09090b" />
            <circle cx="284" cy="185" r="4" fill="#09090b" />
            {/* Star Catchlights */}
            <circle cx="214" cy="182" r="2.5" fill="#ffffff" />
            <circle cx="282" cy="182" r="2.5" fill="#ffffff" />
            <circle cx="218" cy="188" r="1.5" fill="#ffffff" />
            <circle cx="286" cy="188" r="1.5" fill="#ffffff" />
          </>
        ) : (
          <>
            <circle cx="216" cy="185" r="4" fill="#09090b" />
            <circle cx="284" cy="185" r="4" fill="#09090b" />
            {/* Specular Catchlights */}
            <circle cx="214" cy="182" r="2" fill="#ffffff" />
            <circle cx="282" cy="182" r="2" fill="#ffffff" />
          </>
        )}

        {/* Eyelid Upper Lines */}
        <path d="M 197,180 Q 215,173 232,180" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 268,180 Q 285,173 303,180" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    );
  };

  // Foreground Hair
  const renderForegroundHair = () => {
    switch (config.hairstyle) {
      case 'fade':
        return (
          <g id="hair-front">
            {/* Tapered sides and sharp textured top */}
            <path d="M 172,165 C 172,90 328,90 328,165 C 328,150 310,135 250,135 C 190,135 172,150 172,165 Z" fill={hairColorHex} />
            <path d="M 180,140 Q 250,120 320,140 Q 250,150 180,140 Z" fill="#ffffff" opacity="0.2" />
          </g>
        );

      case 'spiky':
        return (
          <g id="hair-front">
            {/* Anime spiky clusters */}
            <path 
              d="M 165,160 L 150,110 L 185,125 L 200,80 L 230,110 L 250,60 L 270,110 L 300,80 L 315,125 L 350,110 L 335,160 Q 250,140 165,160 Z" 
              fill={hairColorHex} 
              stroke="#0f172a" 
              strokeWidth="2" 
            />
            {/* Specular highlights on spikes */}
            <path d="M 245,75 L 255,100 L 250,110 Z" fill="#ffffff" opacity="0.25" />
            <path d="M 195,95 L 205,115 L 200,120 Z" fill="#ffffff" opacity="0.25" />
          </g>
        );

      case 'curly':
        return (
          <g id="hair-front">
            <circle cx="180" cy="120" r="28" fill={hairColorHex} />
            <circle cx="220" cy="95" r="32" fill={hairColorHex} />
            <circle cx="260" cy="90" r="34" fill={hairColorHex} />
            <circle cx="300" cy="100" r="30" fill={hairColorHex} />
            <circle cx="325" cy="130" r="26" fill={hairColorHex} />
            <circle cx="200" cy="135" r="20" fill={hairColorHex} />
            <circle cx="285" cy="135" r="20" fill={hairColorHex} />
          </g>
        );

      case 'mohawk':
        return (
          <g id="hair-front">
            {/* Clean shaved sides with center high plume */}
            <path d="M 230,140 L 220,50 L 250,30 L 280,50 L 270,140 Z" fill={hairColorHex} stroke="#0f172a" strokeWidth="2" />
            {/* Shaved stubble fade on sides */}
            <path d="M 172,170 C 172,130 220,130 220,150 C 200,165 180,170 172,170 Z" fill={hairColorHex} opacity="0.3" />
            <path d="M 328,170 C 328,130 280,130 280,150 C 300,165 320,170 328,170 Z" fill={hairColorHex} opacity="0.3" />
          </g>
        );

      case 'futuristic':
        return (
          <g id="hair-front">
            {/* Asymmetrical cyber undercut with glowing streak */}
            <path d="M 170,150 C 160,80 310,70 330,130 C 310,135 280,140 240,160 C 200,180 180,170 170,150 Z" fill={hairColorHex} />
            {/* Glowing Neon Cyber Streak */}
            <path d="M 180,120 Q 240,105 310,125" stroke={lightingColor} strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#glow-blur)" />
          </g>
        );

      case 'long':
      case 'ponytail':
      case 'braided':
        return (
          <g id="hair-front">
            {/* Fringe / Bangs covering forehead */}
            <path d="M 170,160 C 180,100 320,100 330,160 C 300,140 270,145 250,155 C 230,145 200,140 170,160 Z" fill={hairColorHex} />
            <path d="M 210,120 Q 250,110 290,120" stroke="#ffffff" strokeWidth="4" opacity="0.2" fill="none" />
          </g>
        );

      case 'buzz-cut':
        return (
          <g id="hair-front">
            <path d="M 172,165 C 172,105 328,105 328,165 Q 250,145 172,165 Z" fill={hairColorHex} opacity="0.8" />
          </g>
        );

      case 'short':
      default:
        return (
          <g id="hair-front">
            <path d="M 170,160 C 170,85 330,85 330,160 C 305,140 280,130 250,135 C 220,130 195,140 170,160 Z" fill={hairColorHex} />
            <path d="M 200,120 Q 250,105 300,120" stroke="#ffffff" strokeWidth="4" opacity="0.2" fill="none" />
          </g>
        );
    }
  };

  // Accessories (multi-select layers)
  const renderAccessories = () => {
    const acc = config.accessories || [];

    return (
      <g id="accessories-layer">
        {/* 1. Cybernetic Temple Implant */}
        {acc.includes('cybernetic-implant') && (
          <g id="acc-implant">
            <rect x="175" y="195" width="12" height="18" rx="2" fill="#334155" stroke={lightingColor} strokeWidth="1.5" />
            <circle cx="181" cy="204" r="2.5" fill={lightingColor} filter="url(#glow-blur)" />
            {/* Circuit Lines running down cheek */}
            <path d="M 181,213 L 181,235 L 200,245" stroke={lightingColor} strokeWidth="1.5" fill="none" opacity="0.85" />
          </g>
        )}

        {/* 2. Sunglasses / Cyber Shades */}
        {acc.includes('sunglasses') && (
          <g id="acc-sunglasses">
            {/* Frames */}
            <polygon points="190,175 235,175 230,200 195,200" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" />
            <polygon points="265,175 310,175 305,200 270,200" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Bridge */}
            <line x1="235" y1="180" x2="265" y2="180" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Polarized Reflection Streaks */}
            <line x1="198" y1="195" x2="225" y2="180" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
            <line x1="273" y1="195" x2="300" y2="180" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
          </g>
        )}

        {/* 3. Visor / Holographic HUD */}
        {acc.includes('visor') && (
          <g id="acc-visor">
            <path d="M 180,170 L 320,170 L 310,205 L 190,205 Z" fill={lightingColor} opacity="0.35" stroke={lightingColor} strokeWidth="2" filter="url(#glow-blur)" />
            {/* HUD Scanline */}
            <line x1="190" y1="187" x2="310" y2="187" stroke="#ffffff" strokeWidth="1" strokeDasharray="6,4" opacity="0.8" />
          </g>
        )}

        {/* 4. Face Mask / Respirator */}
        {acc.includes('face-mask') && (
          <g id="acc-mask">
            <polygon points="210,225 290,225 275,275 225,275" fill="#18181b" stroke={secondaryColor} strokeWidth="2" />
            {/* Dual Respirator Filters */}
            <circle cx="225" cy="245" r="9" fill="#292524" stroke="#78716c" strokeWidth="1.5" />
            <circle cx="275" cy="245" r="9" fill="#292524" stroke="#78716c" strokeWidth="1.5" />
          </g>
        )}

        {/* 5. Cap / Snapback */}
        {acc.includes('cap') && (
          <g id="acc-cap">
            <path d="M 165,150 C 165,85 335,85 335,150 Z" fill={primaryColor} stroke="#0f172a" strokeWidth="2" />
            {/* Brim */}
            <path d="M 155,145 Q 250,130 345,145 Q 250,155 155,145 Z" fill={secondaryColor} />
            {/* Front Logo Ingot */}
            <circle cx="250" cy="115" r="8" fill="#f8fafc" />
          </g>
        )}

        {/* 6. Beanie */}
        {acc.includes('beanie') && (
          <g id="acc-beanie">
            <path d="M 165,160 C 165,65 335,65 335,160 Z" fill={primaryColor} />
            {/* Folded Rim */}
            <rect x="160" y="145" width="180" height="25" rx="6" fill={secondaryColor} stroke="#0f172a" strokeWidth="1.5" />
          </g>
        )}

        {/* 7. Cyber Visor Helmet */}
        {acc.includes('helmet') && (
          <g id="acc-helmet">
            <path d="M 155,170 C 155,70 345,70 345,170 L 335,260 L 165,260 Z" fill="#0f172a" opacity="0.6" stroke="#334155" strokeWidth="3" />
            <path d="M 175,170 Q 250,160 325,170 L 315,220 Q 250,230 185,220 Z" fill={lightingColor} opacity="0.75" filter="url(#glow-blur)" />
          </g>
        )}

        {/* 8. Gaming Headset */}
        {acc.includes('gaming-headset') && (
          <g id="acc-headset">
            {/* Padded Headband */}
            <path d="M 155,220 C 145,90 355,90 345,220" fill="none" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
            <path d="M 155,220 C 145,90 355,90 345,220" fill="none" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" />
            {/* Left RGB Ear Cup */}
            <rect x="145" y="195" width="22" height="55" rx="10" fill="#090d16" stroke="#334155" strokeWidth="2" />
            <circle cx="156" cy="222" r="7" fill={lightingColor} filter="url(#glow-blur)" />
            {/* Right RGB Ear Cup */}
            <rect x="333" y="195" width="22" height="55" rx="10" fill="#090d16" stroke="#334155" strokeWidth="2" />
            <circle cx="344" cy="222" r="7" fill={lightingColor} filter="url(#glow-blur)" />
            {/* Flexible Boom Microphone */}
            <path d="M 156,235 Q 160,270 215,265" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <circle cx="218" cy="265" r="4.5" fill={lightingColor} filter="url(#glow-blur)" />
          </g>
        )}

        {/* 9. Shoulder Armor Pauldrons */}
        {acc.includes('shoulder-armor') && (
          <g id="acc-pauldron">
            <path d="M 105,370 L 155,340 L 175,410 L 115,420 Z" fill="#1e293b" stroke={secondaryColor} strokeWidth="2" />
            <path d="M 395,370 L 345,340 L 325,410 L 385,420 Z" fill="#1e293b" stroke={secondaryColor} strokeWidth="2" />
          </g>
        )}

        {/* 10. Floating Game Controller */}
        {acc.includes('gaming-controller') && (
          <g id="acc-controller" transform="translate(365, 410) scale(0.85)">
            <rect x="-35" y="-20" width="70" height="40" rx="16" fill="#090d16" stroke={lightingColor} strokeWidth="2" filter="url(#glow-blur)" />
            {/* Handles */}
            <circle cx="-20" cy="0" r="8" fill="#1e293b" />
            <circle cx="20" cy="0" r="8" fill="#1e293b" />
            {/* Face Buttons */}
            <circle cx="18" cy="-5" r="2.5" fill="#f43f5e" />
            <circle cx="24" cy="1" r="2.5" fill="#38bdf8" />
            <circle cx="16" cy="7" r="2.5" fill="#22c55e" />
          </g>
        )}

        {/* 11. Studio Boom Microphone */}
        {acc.includes('microphone') && (
          <g id="acc-mic" transform="translate(110, 430)">
            {/* Pop filter and condenser body */}
            <rect x="-14" y="-30" width="28" height="48" rx="14" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
            <line x1="-12" y1="-12" x2="12" y2="-12" stroke="#94a3b8" strokeWidth="2" />
            {/* Shock-mount Ring */}
            <circle cx="0" cy="-6" r="20" fill="none" stroke={lightingColor} strokeWidth="2" />
          </g>
        )}

        {/* 12. Floating Companion Bot / Drone */}
        {acc.includes('futuristic-gadget') && (
          <g id="acc-drone" transform="translate(390, 160)">
            {/* Sphere Body */}
            <circle cx="0" cy="0" r="24" fill="#0f172a" stroke={lightingColor} strokeWidth="2" />
            {/* Glowing Eye Sensor */}
            <circle cx="0" cy="0" r="10" fill={lightingColor} filter="url(#glow-blur)" />
            <circle cx="-3" cy="-3" r="3" fill="#ffffff" />
            {/* Propeller Rings */}
            <ellipse cx="-20" cy="-14" rx="12" ry="4" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <ellipse cx="20" cy="-14" rx="12" ry="4" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </g>
        )}

        {/* 13. Floating Arcane Rune Prop */}
        {acc.includes('fantasy-prop') && (
          <g id="acc-rune" transform="translate(100, 170)">
            <polygon points="0,-25 22,0 0,25 -22,0" fill="#a855f7" opacity="0.6" stroke="#fef08a" strokeWidth="2" filter="url(#glow-blur)" />
            <polygon points="0,-15 13,0 0,15 -13,0" fill="#ffffff" opacity="0.75" />
          </g>
        )}
      </g>
    );
  };

  // Gaming Personality Emblem Badge (bottom-right corner)
  const renderPersonalityEmblem = () => {
    return (
      <g id="personality-emblem" transform="translate(425, 425)">
        <polygon points="0,-22 20,-10 20,12 0,22 -20,12 -20,-10" fill="#090d16" stroke={lightingColor} strokeWidth="2.5" />
        <circle cx="0" cy="0" r="6" fill={lightingColor} filter="url(#glow-blur)" />
      </g>
    );
  };

  // Visual Style Filter Overlays across all genres
  const renderStyleOverlay = () => {
    switch (config.style) {
      case 'anime':
        return (
          <g id="style-filter-anime">
            {/* Anime Sparkle Stars & Shonen Catchlights */}
            <g opacity="0.7" filter="url(#glow-blur)">
              <path d="M 90,80 L 93,88 L 101,91 L 93,94 L 90,102 L 87,94 L 79,91 L 87,88 Z" fill="#ffffff" />
              <path d="M 410,120 L 412,126 L 418,128 L 412,130 L 410,136 L 408,130 L 402,128 L 408,126 Z" fill="#facc15" />
              <path d="M 380,240 L 382,245 L 387,247 L 382,249 L 380,254 L 378,249 L 373,247 L 378,245 Z" fill="#38bdf8" />
            </g>
            {/* Subtle dynamic action line accents */}
            <line x1="20" y1="30" x2="80" y2="60" stroke="#ffffff" strokeWidth="1.2" opacity="0.3" />
            <line x1="480" y1="30" x2="420" y2="60" stroke="#ffffff" strokeWidth="1.2" opacity="0.3" />
          </g>
        );

      case 'cartoon':
        return (
          <g id="style-filter-cartoon">
            {/* Comic Halftone Pop Accent Dots */}
            <g opacity="0.18">
              {[50, 70, 90].map((cx, i) => (
                <circle key={`dot1-${i}`} cx={cx} cy="50" r={i + 2.5} fill="#ffffff" />
              ))}
              {[410, 430, 450].map((cx, i) => (
                <circle key={`dot2-${i}`} cx={cx} cy="50" r={i + 2.5} fill="#ffffff" />
              ))}
            </g>
            {/* Bold dynamic action burst line */}
            <line x1="25" y1="40" x2="65" y2="70" stroke={lightingColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            <line x1="475" y1="40" x2="435" y2="70" stroke={lightingColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
          </g>
        );

      case 'cyberpunk':
        return (
          <g id="style-filter-cyberpunk">
            {/* CRT Scanlines */}
            <g opacity="0.14">
              {Array.from({ length: 50 }).map((_, i) => (
                <line key={i} x1="0" y1={i * 10} x2="500" y2={i * 10} stroke="#06b6d4" strokeWidth="1" />
              ))}
            </g>
            {/* Cyber HUD Corner Telemetry Brackets */}
            <path d="M 20,40 L 20,20 L 40,20" fill="none" stroke={lightingColor} strokeWidth="2.5" />
            <path d="M 480,40 L 480,20 L 460,20" fill="none" stroke={lightingColor} strokeWidth="2.5" />
            <path d="M 20,460 L 20,480 L 40,480" fill="none" stroke={lightingColor} strokeWidth="2.5" />
            <path d="M 480,460 L 480,480 L 460,480" fill="none" stroke={lightingColor} strokeWidth="2.5" />
          </g>
        );

      case 'sci-fi':
      case 'space-explorer':
        return (
          <g id="style-filter-scifi">
            {/* Hexagonal Nanotech Mesh Accent */}
            <g opacity="0.14">
              <polygon points="60,80 75,70 90,80 90,100 75,110 60,100" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="90,100 105,90 120,100 120,120 105,130 90,120" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="410,80 425,70 440,80 440,100 425,110 410,100" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            </g>
            {/* Optical coordinate crosshair */}
            <circle cx="250" cy="50" r="12" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
            <line x1="250" y1="35" x2="250" y2="65" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
            <line x1="235" y1="50" x2="265" y2="50" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
          </g>
        );

      case 'pixel-art':
        return (
          <g id="style-filter-pixel" opacity="0.14">
            {/* Subtle pixel grid */}
            {Array.from({ length: 50 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={i * 10} y1="0" x2={i * 10} y2="500" stroke="#ffffff" strokeWidth="0.8" />
                <line x1="0" y1={i * 10} x2="500" y2={i * 10} stroke="#ffffff" strokeWidth="0.8" />
              </React.Fragment>
            ))}
          </g>
        );

      case 'fantasy':
      case 'medieval':
      case 'warrior':
        return (
          <g id="style-filter-fantasy">
            {/* Arcane Mana Motes */}
            <g opacity="0.55" filter="url(#glow-blur)">
              <circle cx="120" cy="140" r="3" fill="#c084fc" />
              <circle cx="380" cy="110" r="3.5" fill="#facc15" />
              <circle cx="100" cy="290" r="2.5" fill="#e879f9" />
              <circle cx="400" cy="300" r="3" fill="#60a5fa" />
            </g>
          </g>
        );

      case 'horror':
        return (
          <g id="style-filter-horror">
            {/* Dark Spectral Mist accents */}
            <rect x="0" y="440" width="500" height="60" fill="#020617" opacity="0.4" filter="url(#glow-blur)" />
          </g>
        );

      default:
        return null;
    }
  };

  const isCircle = config.previewMode === 'circle';

  return (
    <div 
      id={id}
      className={`relative inline-block overflow-hidden select-none transition-all duration-300 ${
        isCircle ? 'rounded-full' : 'rounded-2xl'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Transparency Checkerboard background */}
      {config.isTransparentBg && (
        <div 
          className="absolute inset-0 z-0 bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] bg-slate-900"
        />
      )}

      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="w-full h-full relative z-10 block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Glow Filter */}
          <filter id="glow-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense Aura Halo Filter */}
          <filter id="aura-halo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="bg-neon-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1035" />
            <stop offset="60%" stopColor="#0a081a" />
            <stop offset="100%" stopColor="#03020a" />
          </linearGradient>

          <linearGradient id="bg-fantasy-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="65%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="bg-forest-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#042f2e" />
            <stop offset="70%" stopColor="#021415" />
            <stop offset="100%" stopColor="#010708" />
          </linearGradient>

          <linearGradient id="bg-battle-smoke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="50%" stopColor="#1c1917" />
            <stop offset="100%" stopColor="#0c0a09" />
          </linearGradient>

          <linearGradient id="bg-desert-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="55%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="bg-studio-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>

          <linearGradient id="retrowave-sun" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <radialGradient id="space-nebula" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="space-nebula-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="spotlight-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="spotlight-right" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="aurora-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
            <stop offset="50%" stopColor="#4ade80" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>

          {/* Circular Mask for Circle Preview */}
          <clipPath id="circle-clip">
            <circle cx="250" cy="250" r="250" />
          </clipPath>
        </defs>

        <g clipPath={isCircle ? "url(#circle-clip)" : undefined}>
          {/* Layer 1: Background */}
          {renderBackground()}

          {/* Layer 2: Aura / Halo Glow */}
          {config.enableAura && (
            <path
              d="M 160,340 C 130,220 150,110 250,90 C 350,110 370,220 340,340 Z"
              fill={lightingColor}
              opacity="0.5"
              filter="url(#aura-halo)"
            />
          )}

          {/* Layer 3: Back Hair */}
          {renderBackHair()}

          {/* Layer 4: Outfit Torso */}
          {renderOutfit()}

          {/* Layer 5: Head, Neck & Face */}
          {renderHeadAndFace()}

          {/* Layer 6: Foreground Hair */}
          {renderForegroundHair()}

          {/* Layer 7: Accessories */}
          {renderAccessories()}

          {/* Layer 8: Personality Emblem Badge */}
          {renderPersonalityEmblem()}

          {/* Layer 9: Visual Style Filters */}
          {renderStyleOverlay()}
        </g>
      </svg>
    </div>
  );
});

AvatarRenderer.displayName = 'AvatarRenderer';
