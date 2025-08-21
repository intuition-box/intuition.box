import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./MobileBottomSheet.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  borderColor?: string;
  title?: string;
  children: React.ReactNode;
  minimal?: boolean;
};

export default function MobileBottomSheet({
  open,
  onClose,
  borderColor = "#333",
  title,
  children,
  minimal,
}: Props) {
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

  if (!open) return null;

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Details"}
        style={{ "--accent-color": borderColor } as React.CSSProperties}
      >
        <div className={styles.grabber} aria-hidden="true" />
        
        {!minimal && (
          <header className={styles.header}>
            {title && <div className={styles.title}>{title}</div>}
            <button className={styles.close} onClick={onClose} aria-label="Close">
              ✕
            </button>
          </header>
        )}

        <div className={styles.body}>{children}</div>
      </div>
    </>,
    document.body
  );
}
