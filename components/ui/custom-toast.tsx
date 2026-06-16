'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  /** internal – drives the exit animation */
  _exiting?: boolean;
}

interface ToastContextValue {
  toast: (opts: {
    title: string;
    description?: string;
    variant: ToastVariant;
    duration?: number;
  }) => string;
  dismiss: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Variant config                                                     */
/* ------------------------------------------------------------------ */

const VARIANT_CONFIG: Record<
  ToastVariant,
  { color: string; bg: string; Icon: React.ElementType }
> = {
  success: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', Icon: CheckCircle2 },
  error:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  Icon: XCircle },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', Icon: AlertTriangle },
  info:    { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  Icon: Info },
};

const EXIT_DURATION = 320; // ms – matches CSS transition

/* ------------------------------------------------------------------ */
/*  Single Toast                                                       */
/* ------------------------------------------------------------------ */

function ToastItem({
  data,
  onDismiss,
}: {
  data: ToastData;
  onDismiss: (id: string) => void;
}) {
  const { color, bg, Icon } = VARIANT_CONFIG[data.variant];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss
  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(data.id), data.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        /* entrance / exit animation via inline transition */
        transform: data._exiting ? 'translateX(120%)' : 'translateX(0)',
        opacity: data._exiting ? 0 : 1,
        transition: `transform ${EXIT_DURATION}ms cubic-bezier(.4,0,.2,1), opacity ${EXIT_DURATION}ms ease`,
        borderLeft: `4px solid ${color}`,
        background: 'rgba(24,24,27,0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.06)`,
        maxWidth: 400,
        minWidth: 320,
        pointerEvents: 'auto' as const,
      }}
      className="rounded-xl mb-3 overflow-hidden"
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 rounded-lg p-1.5 mt-0.5"
          style={{ backgroundColor: bg }}
        >
          <Icon size={20} style={{ color }} strokeWidth={2.2} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-100 leading-tight">
            {data.title}
          </p>
          {data.description && (
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={() => onDismiss(data.id)}
          className="flex-shrink-0 rounded-md p-1 text-zinc-500 hover:text-zinc-200 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tiny progress bar that shrinks over `duration` */}
      <div className="h-[2px] w-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
        <div
          style={{
            height: '100%',
            backgroundColor: color,
            animation: `toast-shrink ${data.duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toast Container (portal)                                           */
/* ------------------------------------------------------------------ */

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* keyframes injected once */}
      <style>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column-reverse',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} data={t} onDismiss={onDismiss} />
        ))}
      </div>
    </>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

let _counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    // 1. Mark as exiting (triggers slide-out animation)
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, _exiting: true } : t)),
    );
    // 2. Remove from DOM after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_DURATION);
  }, []);

  const toast = useCallback(
    (opts: {
      title: string;
      description?: string;
      variant: ToastVariant;
      duration?: number;
    }) => {
      const id = `toast-${++_counter}-${Date.now()}`;
      const newToast: ToastData = {
        id,
        title: opts.title,
        description: opts.description,
        variant: opts.variant,
        duration: opts.duration ?? 5000,
      };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [],
  );

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
