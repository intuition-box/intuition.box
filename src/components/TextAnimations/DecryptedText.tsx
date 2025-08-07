import React, { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  duration?: number; // ms
  chars?: string;
  style?: React.CSSProperties;
};

export const DecryptedText: React.FC<Props> = ({
  text,
  duration = 800,
  chars = "@3<01>&#*",
  style,
}) => {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef<NodeJS.Timeout>();
  useEffect(() => {
    let frame = 0;
    clearInterval(ref.current!);
    ref.current = setInterval(() => {
      frame++;
      setDisplayed((prev) =>
        text
          .split("")
          .map((c, i) =>
            frame > i + 3
              ? c
              : chars[Math.floor(Math.random() * chars.length)] ?? c
          )
          .join("")
      );
      if (frame >= text.length + 4) clearInterval(ref.current!);
    }, duration / (text.length + 3));
    return () => clearInterval(ref.current!);
  }, [text, duration, chars]);
  return <span style={style}>{displayed}</span>;
};
