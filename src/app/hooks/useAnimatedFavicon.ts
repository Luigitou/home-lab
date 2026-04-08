import { useEffect } from 'react';

/**
 * Animated favicon – draws a pulsing emerald dot on a canvas
 * and updates the <link rel="icon"> at every animation frame.
 *
 * The animation mirrors the "System Online" pill indicator in the app:
 *   - outer ring: fades in/out over 3 s (same as the CSS animate-ping)
 *   - inner dot:  solid emerald, always visible
 */
export function useAnimatedFavicon() {
  useEffect(() => {
    const SIZE = 32;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d')!;
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    // Reuse or create the <link rel="icon"> element
    let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    const PERIOD = 3; // seconds – matches animationDuration in App.tsx
    const startTime = performance.now();
    let frameId: number;

    function draw(now: number) {
      const t = ((now - startTime) / 1000) % PERIOD; // 0 → PERIOD
      // Ease-out pulse: starts bright, fades to 0 over the period
      const pulse = Math.max(0, 1 - t / PERIOD);

      ctx.clearRect(0, 0, SIZE, SIZE);

      // ── Outer pulsing ring ──────────────────────────────────────
      const ringRadius = 7 + pulse * 8; // expands from 7 to 15 px
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 185, 129, ${pulse * 0.5})`; // emerald-500
      ctx.lineWidth = 2;
      ctx.stroke();

      // ── Inner solid dot ─────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981'; // emerald-500
      ctx.fill();

      // ── Soft specular highlight ─────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx - 2, cy - 2, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();

      // Flush canvas → favicon
      link!.href = canvas.toDataURL('image/png');

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(frameId);
  }, []);
}
