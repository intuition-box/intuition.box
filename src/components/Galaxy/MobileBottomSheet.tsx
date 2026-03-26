import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./MobileBottomSheet.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  borderColor?: string;
  title?: string;
  headerSlot?: React.ReactNode;
  children: React.ReactNode;
  minimal?: boolean;
};

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function MobileBottomSheet({
  open,
  onClose,
  borderColor = "#333",
  title,
  headerSlot,
  children,
  minimal,
}: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const bodyStyle = document.body.style;
    const prev = {
      overflow: bodyStyle.overflow,
      position: bodyStyle.position,
      top: bodyStyle.top,
      width: bodyStyle.width,
    };
    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";

    return () => {
      bodyStyle.overflow = prev.overflow;
      bodyStyle.position = prev.position;
      bodyStyle.top = prev.top;
      bodyStyle.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Focus trap + restore focus on close
  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;

    // Focus the sheet after mount
    const timer = requestAnimationFrame(() => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const first = sheet.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? sheet).focus();
    });

    return () => {
      cancelAnimationFrame(timer);
      previousFocus.current?.focus();
    };
  }, [open]);

  // Trap Tab key inside the sheet
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;
      const sheet = sheetRef.current;
      if (!sheet) return;

      const focusable = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  if (!open) return null;

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Details"}
        style={{ "--accent-color": borderColor } as React.CSSProperties}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className={styles.grabber} aria-hidden="true" />

        {!minimal && (
          <header className={styles.header}>
            {headerSlot ? (
              <div className={styles.headerSlot}>{headerSlot}</div>
            ) : (
              title && <div className={styles.title}>{title}</div>
            )}
            <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
          </header>
        )}

        <div className={styles.body}>{children}</div>
      </div>
    </>,
    document.body
  );
}
