import React, { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  duration?: number; // ms
  cursor?: boolean;
  cursorBlink?: boolean;
  style?: React.CSSProperties;
};

export const TextType: React.FC<Props> = ({
  text,
  duration = 700,
  cursor = true,
  cursorBlink = true,
  style,
}) => {
  const [displayed, setDisplayed] = useState("");
  const interval = useRef<NodeJS.Timeout>();
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    clearInterval(interval.current!);
    interval.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval.current!);
      }
    }, duration / (text.length + 1));
    return () => clearInterval(interval.current!);
  }, [text, duration]);
  return (
    <span style={style}>
      {displayed}
      {cursor && (
        <span
          style={{
            opacity: cursorBlink ? 0.7 : 1,
            animation: cursorBlink ? "blink .9s steps(1) infinite" : undefined,
          }}
        >
          |
        </span>
      )}
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
    </span>
  );
};
