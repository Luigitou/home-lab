import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import type { MouseEvent, ReactNode } from 'react';
import { CircuitBoard, Cpu, Github, Linkedin, MemoryStick } from 'lucide-react';
import { useAnimatedFavicon } from './hooks/useAnimatedFavicon';

export default function App() {
  useAnimatedFavicon();
  // Mouse position state for parallax (normalized from 0 to 1)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs to make the parallax feel organic and fluid
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transformations for different layers (creates the 3D depth effect)
  // Grid moves opposite to mouse (background)
  const gridX = useTransform(smoothX, [0, 1], [40, -40]);
  const gridY = useTransform(smoothY, [0, 1], [40, -40]);

  // Glow moves slightly with the mouse (middle layer) – reserved for future use
  const _glowX = useTransform(smoothX, [0, 1], [-20, 20]);
  const _glowY = useTransform(smoothY, [0, 1], [-20, 20]);

  // Content moves very slightly opposite (foreground layer) – reserved for future use
  const _contentX = useTransform(smoothX, [0, 1], [10, -10]);
  const _contentY = useTransform(smoothY, [0, 1], [10, -10]);

  // Update mouse position on move
  const handleMouseMove = (e: MouseEvent) => {
    // Calculate normalized position (0 left/top, 1 right/bottom)
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-[#0a0a0e] text-slate-50 font-sans selection:bg-orange-500/30 flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* Parallax Grid Layer - Oversized (-inset-[100px]) so it doesn't show edges when moving */}
        {/* Uses a CSS mask-image to fade the dots out towards the edges without adding any shadows/colors */}
        <motion.div
          className="absolute -inset-[100px] opacity-[0.35]"
          style={{
            x: gridX,
            y: gridY,
            backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)',
          }}
        />

        {/* Framing Lines */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      {/* Main Content Container - Gets a subtle Parallax floating effect too */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center gap-12">
        {/* System Status Indicator - Pill with subtle text */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, duration: 0.8 }}
          className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.02] border border-emerald-500/20 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        >
          <div className="relative flex items-center justify-center w-2 h-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40"
              style={{ animationDuration: '3s' }}
            ></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
          </div>
          <span className="text-[11px] font-medium tracking-widest uppercase text-slate-400">
            System Online
          </span>
        </motion.div>

        {/* Text Section with Premium Name Effect */}
        <div className="flex flex-col items-center gap-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className="relative text-4xl md:text-5xl lg:text-6xl tracking-tight text-center max-w-[90vw]"
          >
            {/* Bold font with an ultra-subtle "titanium/silver" sheen sweeping across the whole name */}
            <motion.span
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="font-extrabold text-transparent bg-clip-text bg-[linear-gradient(110deg,#94a3b8_0%,#94a3b8_45%,#ffffff_50%,#94a3b8_55%,#94a3b8_100%)] bg-[length:200%_auto]"
            >
              Louis Bellefemine
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="text-lg md:text-xl text-slate-400 font-light tracking-wide mt-2"
          >
            Personal Home Lab Environment
          </motion.p>
        </div>

        {/* Minimalist Specs Pill */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-slate-300 font-medium tracking-wide bg-white/[0.03] px-8 py-4 rounded-full border border-slate-400/20 backdrop-blur-md shadow-[0_0_25px_rgba(148,163,184,0.1)]"
        >
          <div className="flex items-center gap-2.5">
            <CircuitBoard className="w-4 h-4 text-rose-400" />
            <span>Raspberry Pi 5</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />

          <div className="flex items-center gap-2.5">
            <MemoryStick className="w-4 h-4 text-blue-400" />
            <span>16GB RAM</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />

          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-orange-400" />
            <span>Quad-Core ARM</span>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          className="flex items-center gap-6 mt-4"
        >
          <SocialLink
            href="https://github.com"
            icon={<Github className="w-5 h-5" />}
            label="GitHub"
          />
          <SocialLink
            href="https://linkedin.com"
            icon={<Linkedin className="w-5 h-5" />}
            label="LinkedIn"
          />
        </motion.div>
      </div>
    </div>
  );
}

// Minimalist Ghost Button Component
function SocialLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      // Ajout de 'transition-all duration-300 ease-out' pour rendre toutes les propriétés fluides
      className="flex items-center gap-2.5 px-6 py-2.5 rounded-full transition-all duration-300 ease-out text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent hover:border-white/10 group relative"
    >
      <span className="relative z-10 flex items-center gap-2.5">
        <span className="transition-colors duration-300 ease-out">{icon}</span>
        {label}
      </span>
    </motion.a>
  );
}
