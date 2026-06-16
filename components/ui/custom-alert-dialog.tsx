'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant: AlertVariant;
  /** Label for the primary action button. Defaults to variant-appropriate text. */
  actionLabel?: string;
  /** When provided, renders a two-button layout (Cancel + Action). */
  onAction?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Variant config                                                     */
/* ------------------------------------------------------------------ */

const VARIANT_CONFIG: Record<
  AlertVariant,
  {
    color: string;
    bg: string;
    hoverBg: string;
    Icon: React.ElementType;
    defaultAction: string;
  }
> = {
  success: {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
    hoverBg: 'rgba(16,185,129,0.25)',
    Icon: CheckCircle2,
    defaultAction: 'Continue',
  },
  error: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.15)',
    hoverBg: 'rgba(239,68,68,0.25)',
    Icon: XCircle,
    defaultAction: 'Delete',
  },
  warning: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
    hoverBg: 'rgba(245,158,11,0.25)',
    Icon: AlertTriangle,
    defaultAction: 'Confirm',
  },
  info: {
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.15)',
    hoverBg: 'rgba(99,102,241,0.25)',
    Icon: Info,
    defaultAction: 'Got it',
  },
};

const ANIM_DURATION = 200; // ms

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AlertDialog({
  open,
  onClose,
  title,
  description,
  variant,
  actionLabel,
  onAction,
}: AlertDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const { color, bg, hoverBg, Icon, defaultAction } = VARIANT_CONFIG[variant];
  const label = actionLabel ?? defaultAction;

  // ---------- mount/unmount with animation ----------
  useEffect(() => {
    if (open) {
      setMounted(true);
      // Force a frame so the initial state (scale-95 / opacity-0) is painted first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ---------- close on Escape ----------
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (mounted) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [mounted, handleKeyDown]);

  // ---------- don't render when not mounted ----------
  if (!mounted) return null;

  return createPortal(
    <>
      {/* Inject hover keyframe */}
      <style>{`
        @keyframes alert-dialog-pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${color}33; }
          50%      { box-shadow: 0 0 24px 4px ${color}22; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: visible ? 1 : 0,
          transition: `opacity ${ANIM_DURATION}ms ease`,
        }}
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        aria-describedby={description ? 'alert-dialog-desc' : undefined}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: 440,
            margin: '0 16px',
            background: 'rgba(24,24,27,0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`,
            transform: visible ? 'scale(1)' : 'scale(0.95)',
            opacity: visible ? 1 : 0,
            transition: `transform ${ANIM_DURATION}ms cubic-bezier(.4,0,.2,1), opacity ${ANIM_DURATION}ms ease`,
          }}
        >
          {/* ---- Content ---- */}
          <div className="flex flex-col items-center text-center px-8 pt-8 pb-6">
            {/* Icon circle */}
            <div
              className="rounded-full p-3 mb-5"
              style={{
                backgroundColor: bg,
                animation: 'alert-dialog-pulse 2.5s ease-in-out infinite',
              }}
            >
              <Icon size={28} style={{ color }} strokeWidth={2} />
            </div>

            {/* Title */}
            <h2
              id="alert-dialog-title"
              className="text-lg font-semibold text-zinc-100 leading-snug"
            >
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p
                id="alert-dialog-desc"
                className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-[360px]"
              >
                {description}
              </p>
            )}
          </div>

          {/* ---- Actions ---- */}
          <div
            className="flex items-center gap-3 px-8 pb-7"
            style={{ justifyContent: onAction ? 'flex-end' : 'center' }}
          >
            {onAction ? (
              <>
                {/* Cancel (ghost) */}
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    px-5 py-2.5 rounded-xl text-sm font-medium
                    text-zinc-400 hover:text-zinc-200
                    bg-transparent hover:bg-white/[0.06]
                    border border-zinc-700/60 hover:border-zinc-600
                    transition-all duration-150 cursor-pointer
                  "
                >
                  Cancel
                </button>

                {/* Action */}
                <button
                  type="button"
                  onClick={() => {
                    onAction();
                    onClose();
                  }}
                  className="
                    px-5 py-2.5 rounded-xl text-sm font-semibold
                    text-white transition-all duration-150 cursor-pointer
                  "
                  style={{ backgroundColor: color }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = hoverBg)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = color)
                  }
                >
                  {label}
                </button>
              </>
            ) : (
              /* Single close button */
              <button
                type="button"
                onClick={onClose}
                className="
                  px-6 py-2.5 rounded-xl text-sm font-semibold
                  text-white transition-all duration-150 cursor-pointer
                "
                style={{ backgroundColor: color }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = hoverBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = color)
                }
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
