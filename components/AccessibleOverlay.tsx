import React, { useRef, useEffect } from "react";

interface AccessibleOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
  zIndex?: string;
}

export function AccessibleOverlay({
  isOpen,
  onClose,
  ariaLabel,
  children,
  zIndex = "z-40",
}: AccessibleOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !overlayRef.current) return;
    overlayRef.current.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusables = overlayRef.current!.querySelectorAll(
          "a, button, textarea, input, select, [tabindex]:not([tabindex='-1'])"
        );
        if (!focusables.length) return;
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    overlayRef.current.addEventListener("keydown", handleKey);
    return () =>
      overlayRef.current?.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel} // Or use aria-labelledby
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center ${zIndex}`}
      onClick={onClose}
      style={{ outline: "none" }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
