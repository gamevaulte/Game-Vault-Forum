import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WheelGameEntry } from '../../types/gamePickerWheel';
import { WHEEL_COLOR_PALETTE } from '../../lib/wheelPresets';
import { playTickSound, playSpinWhoosh } from '../../lib/wheelSound';

interface WheelCanvasProps {
  games: WheelGameEntry[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (winner: WheelGameEntry) => void;
  spinDurationMs?: number;
  soundEnabled?: boolean;
  disabled?: boolean;
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  games,
  isSpinning,
  onSpinStart,
  onSpinEnd,
  spinDurationMs = 5000,
  soundEnabled = false,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Current rotation angle in radians
  const currentAngleRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastPegIndexRef = useRef<number>(-1);
  const pointerDeflectionRef = useRef<number>(0); // Angle deflection of top pointer pin
  const [containerSize, setContainerSize] = useState<number>(440);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Responsive container sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Cap max size to 480px, min 280px
        const newSize = Math.max(280, Math.min(480, width));
        setContainerSize(newSize);
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Render wheel onto canvas
  const drawWheel = useCallback(
    (angle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = containerSize;
      const height = containerSize;

      // Handle retina sharpness
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 22; // Leave room for outer bezel and pointer

      const numSegments = games.length;

      // 1. Draw outer glowing ring drop shadow
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 12, 0, 2 * Math.PI);
      ctx.fillStyle = '#090b14';
      ctx.shadowColor = 'rgba(124, 58, 237, 0.45)';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.restore();

      // 2. Draw metallic outer rim / bezel
      const rimGradient = ctx.createLinearGradient(0, centerY - radius - 12, 0, centerY + radius + 12);
      rimGradient.addColorStop(0, '#312e81');
      rimGradient.addColorStop(0.5, '#4c1d95');
      rimGradient.addColorStop(1, '#1e1b4b');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
      ctx.fillStyle = rimGradient;
      ctx.fill();

      // Outer golden/metallic border
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#a78bfa';
      ctx.stroke();

      if (numSegments === 0) {
        // Empty placeholder state on canvas
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#131627';
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 15px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Wheel is Empty', centerX, centerY - 10);
        ctx.font = '400 12px "Inter", sans-serif';
        ctx.fillText('Add games to spin', centerX, centerY + 14);
        ctx.restore();
        return;
      }

      const segmentAngle = (2 * Math.PI) / numSegments;

      // 3. Draw Segments
      for (let i = 0; i < numSegments; i++) {
        const segStart = angle + i * segmentAngle;
        const segEnd = segStart + segmentAngle;
        const game = games[i];
        const color = game.color || WHEEL_COLOR_PALETTE[i % WHEEL_COLOR_PALETTE.length];

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, segStart, segEnd);
        ctx.closePath();

        // Base segment color
        ctx.fillStyle = color;
        ctx.fill();

        // Subtle gradient overlay for 3D depth
        const segGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
        segGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
        segGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
        segGrad.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
        ctx.fillStyle = segGrad;
        ctx.fill();

        // Divider lines between segments
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#090b14';
        ctx.stroke();

        // 4. Draw Radial Text Label
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(segStart + segmentAngle / 2);

        // Calculate dynamic font size based on segment count
        let fontSize = 14;
        if (numSegments > 24) fontSize = 9;
        else if (numSegments > 16) fontSize = 11;
        else if (numSegments > 10) fontSize = 12;
        else if (numSegments <= 4) fontSize = 15;

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;

        // Text shadow for high contrast legibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        // Truncate game name if too long for slice
        const maxTextWidth = radius - (radius > 160 ? 55 : 42);
        let displayName = game.name;
        while (ctx.measureText(displayName).width > maxTextWidth && displayName.length > 3) {
          displayName = displayName.slice(0, -2).trim() + '…';
        }

        ctx.fillText(displayName, radius - 14, 0);
        ctx.restore();
      }

      // 5. Draw Bezel Studs / Pegs around perimeter
      const pegCount = Math.max(numSegments, 12);
      for (let p = 0; p < pegCount; p++) {
        const pegAngle = angle + (p * (2 * Math.PI)) / pegCount;
        const pegX = centerX + Math.cos(pegAngle) * (radius + 4);
        const pegY = centerY + Math.sin(pegAngle) * (radius + 4);

        ctx.beginPath();
        ctx.arc(pegX, pegY, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = '#c4b5fd';
        ctx.shadowBlur = 4;
        ctx.fill();

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#4c1d95';
        ctx.stroke();
      }

      // 6. Center Hub
      const hubRadius = radius > 160 ? 44 : 34;

      // Outer hub shadow & bezel
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubRadius + 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e1b4b';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 10;
      ctx.fill();

      // Inner hub gradient
      const hubGrad = ctx.createRadialGradient(centerX - 4, centerY - 4, 2, centerX, centerY, hubRadius);
      hubGrad.addColorStop(0, '#6d28d9');
      hubGrad.addColorStop(0.7, '#4c1d95');
      hubGrad.addColorStop(1, '#2e1065');

      ctx.beginPath();
      ctx.arc(centerX, centerY, hubRadius, 0, 2 * Math.PI);
      ctx.fillStyle = hubGrad;
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#a78bfa';
      ctx.stroke();

      // Center Hub Text: "SPIN 🎯"
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${radius > 160 ? 13 : 11}px "Space Grotesk", sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText(isSpinning ? 'SPINNING' : 'SPIN 🎯', centerX, centerY);
      ctx.restore();

      // 7. Top Pointer Indicator
      // Pointer sits at the very top (angle: 3*PI/2) pointing down into the wheel
      const pointerBaseY = centerY - radius - 16;
      const pointerTipY = centerY - radius + 8;
      const deflection = pointerDeflectionRef.current;

      ctx.save();
      ctx.translate(centerX, pointerBaseY);
      ctx.rotate(deflection);

      ctx.beginPath();
      ctx.moveTo(-13, -2);
      ctx.lineTo(13, -2);
      ctx.lineTo(0, 22);
      ctx.closePath();

      const pointerGrad = ctx.createLinearGradient(0, -2, 0, 22);
      pointerGrad.addColorStop(0, '#f43f5e');
      pointerGrad.addColorStop(1, '#e11d48');
      ctx.fillStyle = pointerGrad;
      ctx.shadowColor = 'rgba(244, 63, 94, 0.75)';
      ctx.shadowBlur = 10;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Pointer jewel accent
      ctx.beginPath();
      ctx.arc(0, 3, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();

      ctx.restore();
    },
    [containerSize, games, isSpinning]
  );

  // Continuous redraw on state/angle update
  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [drawWheel, containerSize, games]);

  // Handle spin execution with fair randomization
  const executeSpin = useCallback(() => {
    if (isSpinning || disabled || games.length < 2) return;

    onSpinStart();
    playSpinWhoosh(soundEnabled);

    // 1. Genuinely fair random selection using crypto.getRandomValues
    const cryptoArray = new Uint32Array(1);
    crypto.getRandomValues(cryptoArray);
    const winningIndex = cryptoArray[0] % games.length;
    const winningGame = games[winningIndex];

    const numSegments = games.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    // Pointer is located at top: angle = 3*PI/2 (270 degrees)
    const pointerAngle = (3 * Math.PI) / 2;

    // Center of winning segment relative to wheel angle 0 is:
    // center_i = (i + 0.5) * segmentAngle
    const winningSegmentCenter = (winningIndex + 0.5) * segmentAngle;

    // Add safe jitter inside segment (-35% to +35% of wedge width)
    const jitterFactor = (Math.random() - 0.5) * 0.7;
    const jitter = jitterFactor * segmentAngle;

    // Full rotations: 5 to 8 full spins for excitement
    const minSpins = prefersReducedMotion ? 1 : 5;
    const extraSpins = prefersReducedMotion ? 0 : Math.floor(Math.random() * 3) + 1;
    const totalSpins = minSpins + extraSpins;

    // Current angle normalized
    const currentAngle = currentAngleRef.current;

    // Calculate final target angle:
    // At rest: (finalAngle + winningSegmentCenter + jitter) % (2*PI) === pointerAngle
    // So targetEndAngle = pointerAngle - winningSegmentCenter - jitter + 2*PI * K
    let targetAngle = pointerAngle - winningSegmentCenter - jitter;
    // Ensure forward spin from currentAngle
    while (targetAngle < currentAngle + totalSpins * 2 * Math.PI) {
      targetAngle += 2 * Math.PI;
    }

    const startAngle = currentAngle;
    const totalAngleDelta = targetAngle - startAngle;
    const duration = prefersReducedMotion ? 1200 : spinDurationMs;
    const startTime = performance.now();

    // Ease-out quintic deceleration curve for genuine game-show wheel feel
    const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutQuint(progress);

      const newAngle = startAngle + totalAngleDelta * easedProgress;
      currentAngleRef.current = newAngle;

      // Peg ticking calculation: track which peg index passed the pointer
      const pegCount = Math.max(numSegments, 12);
      const pegStep = (2 * Math.PI) / pegCount;
      const currentPegIndex = Math.floor((newAngle + pointerAngle) / pegStep);

      if (currentPegIndex !== lastPegIndexRef.current) {
        lastPegIndexRef.current = currentPegIndex;
        // Pointer deflection flick
        pointerDeflectionRef.current = -0.22;
        playTickSound(soundEnabled);
      } else {
        // Return pointer to neutral with damping
        pointerDeflectionRef.current *= 0.82;
      }

      drawWheel(newAngle);

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        // Complete spin exactly at target
        currentAngleRef.current = targetAngle;
        pointerDeflectionRef.current = 0;
        drawWheel(targetAngle);
        onSpinEnd(winningGame);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  }, [
    isSpinning,
    disabled,
    games,
    onSpinStart,
    soundEnabled,
    prefersReducedMotion,
    spinDurationMs,
    drawWheel,
    onSpinEnd,
  ]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full max-w-[480px] mx-auto select-none"
    >
      {/* Canvas Element */}
      <div className="relative cursor-pointer group" onClick={executeSpin}>
        <canvas
          ref={canvasRef}
          className="transition-transform duration-200 group-hover:scale-[1.01]"
          style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
          aria-label="Game Picker Wheel"
          role="img"
        />

        {/* Center Hover Glow (only when not spinning and has games) */}
        {!isSpinning && games.length >= 2 && (
          <div className="absolute inset-0 rounded-full border border-purple-500/20 pointer-events-none group-hover:border-purple-500/50 transition-colors" />
        )}
      </div>

      {/* Prominent SPIN Button Below Wheel for Mobile Accessibility & Keyboard Focus */}
      <div className="mt-5 w-full max-w-xs">
        <button
          type="button"
          onClick={executeSpin}
          disabled={disabled || isSpinning || games.length < 2}
          className={`w-full py-3.5 px-6 rounded-xl font-bold font-['Space_Grotesk'] text-base uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
            games.length < 2
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              : isSpinning
              ? 'bg-purple-900/60 text-purple-300 cursor-wait border border-purple-500/40 animate-pulse'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/40 shadow-purple-900/40 hover:shadow-purple-700/50 hover:scale-[1.02] active:scale-[0.98]'
          }`}
          aria-label="Spin the Game Wheel"
        >
          {isSpinning ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
              Spinning The Vault Wheel...
            </>
          ) : (
            <>
              <span>SPIN 🎯</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
