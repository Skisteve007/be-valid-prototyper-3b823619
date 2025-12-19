import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Sparkles } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface SynthButtonProps {
  variant?: "fab" | "pill" | "menu-item" | "header" | "hidden-trigger";
}

const SynthButton: React.FC<SynthButtonProps> = ({ variant = "fab" }) => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useIsAdmin();
  const [pulseCount, setPulseCount] = useState(0);
  const resetTimerRef = useRef<number | null>(null);

  const colors = useMemo(() => {
    return {
      purple: "hsl(var(--chart-3))",
      magenta: "hsl(var(--chart-5))",
      glow: "hsl(var(--chart-3) / 0.35)",
    };
  }, []);

  const goSynth = () => navigate("/synth");

  const handleHiddenTrigger = () => {
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);

    setPulseCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        goSynth();
        return 0;
      }
      return next;
    });

    resetTimerRef.current = window.setTimeout(() => {
      setPulseCount(0);
    }, 1500);
  };

  // HIDDEN TRIGGER VARIANT - visible but cryptic
  if (variant === "hidden-trigger") {
    return (
      <button
        onClick={handleHiddenTrigger}
        className="group relative grid size-10 place-items-center rounded-full border border-border/40 bg-background/25 backdrop-blur-sm transition hover:bg-background/35 hover:scale-105"
        style={{
          WebkitTapHighlightColor: "transparent",
          boxShadow: `0 0 18px ${colors.glow}`,
        }}
        aria-label="Discover"
      >
        <div
          className="absolute inset-0 rounded-full opacity-50 blur-sm"
          style={{
            background: `radial-gradient(circle, ${colors.purple} 0%, transparent 70%)`,
            opacity: 0.15 + pulseCount * 0.12,
          }}
        />

        <Sparkles
          className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12"
          style={{
            color: colors.purple,
            filter: pulseCount > 0 ? `drop-shadow(0 0 10px ${colors.glow})` : `drop-shadow(0 0 6px ${colors.glow})`,
          }}
        />

        {pulseCount > 0 && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-1 w-1 rounded-full"
                style={{
                  backgroundColor: i < pulseCount ? colors.purple : "hsl(var(--muted-foreground) / 0.35)",
                  boxShadow: i < pulseCount ? `0 0 6px ${colors.glow}` : "none",
                }}
              />
            ))}
          </div>
        )}
      </button>
    );
  }

  // Admin-only variants below
  if (loading || !isAdmin) return null;

  if (variant === "fab") {
    return (
      <button
        onClick={goSynth}
        className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-40 grid size-14 sm:size-16 place-items-center rounded-full border border-border/40 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
        style={{
          WebkitTapHighlightColor: "transparent",
          background: `linear-gradient(135deg, ${colors.purple}, ${colors.magenta})`,
          boxShadow: `0 0 30px ${colors.glow}, 0 10px 30px hsl(var(--foreground) / 0.08)`,
        }}
        aria-label="Open Synth"
      >
        <Brain className="h-7 w-7" style={{ color: "hsl(var(--primary-foreground))" }} />
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: colors.purple, opacity: 0.18 }}
        />
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        onClick={goSynth}
        className="w-full rounded-2xl border border-border/40 bg-background/25 p-4 backdrop-blur-sm transition hover:bg-background/35"
        style={{ WebkitTapHighlightColor: "transparent", boxShadow: `0 0 24px ${colors.glow}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="grid size-12 place-items-center rounded-xl border border-border/40"
              style={{
                background: `linear-gradient(135deg, ${colors.purple}, ${colors.magenta})`,
                boxShadow: `0 0 20px ${colors.glow}`,
              }}
            >
              <Brain className="h-6 w-6" style={{ color: "hsl(var(--primary-foreground))" }} />
            </div>
            <div className="text-left">
              <div className="text-foreground font-semibold text-base">SYNTH™</div>
              <div className="text-muted-foreground text-xs">Think Tank • Private Console</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full border border-border/40 bg-background/30 text-foreground">
              ADMIN
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </div>
        </div>
      </button>
    );
  }

  if (variant === "menu-item") {
    return (
      <button
        onClick={goSynth}
        className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-background/25 backdrop-blur-sm hover:bg-background/35 transition"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div
          className="grid size-10 place-items-center rounded-full border border-border/40"
          style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.magenta})` }}
        >
          <Brain className="h-5 w-5" style={{ color: "hsl(var(--primary-foreground))" }} />
        </div>
        <div className="flex-1 text-left">
          <span className="text-foreground font-medium">SYNTH™</span>
          <span className="text-muted-foreground text-xs block">Think Tank</span>
        </div>
        <span className="text-muted-foreground text-xs font-medium">ADMIN</span>
      </button>
    );
  }

  if (variant === "header") {
    return (
      <button
        onClick={goSynth}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-border/40 bg-background/25 backdrop-blur-sm hover:bg-background/35 transition"
        style={{ WebkitTapHighlightColor: "transparent", boxShadow: `0 0 16px ${colors.glow}` }}
      >
        <Brain className="h-4 w-4" style={{ color: colors.purple }} />
        <span className="text-foreground text-sm font-medium hidden sm:inline">SYNTH™</span>
      </button>
    );
  }

  return null;
};

export default SynthButton;

