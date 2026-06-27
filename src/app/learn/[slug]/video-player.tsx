"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import { motion } from "motion/react";

export function StickyVideoPlayer({ youtubeId }: { youtubeId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger sticky only when scrolling down past the video
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setIsSticky(true);
        } else if (entry.isIntersecting) {
          setIsSticky(false);
          setIsDismissed(false); // Reset dismissal if the user scrolls back to the top
        }
      },
      { threshold: 0.1 } // Trigger when only 10% is visible
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleClose = () => {
    setIsDismissed(true);
    // Pause the YouTube video using the JS API
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
        '*'
      );
    }
  };

  if (!youtubeId) return null;

  // Determine actual display state
  const shouldBeSticky = isSticky && !isDismissed;

  return (
    <div ref={containerRef} className="w-full aspect-video mb-10 relative">
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className={cn(
          "overflow-hidden bg-black",
          // Inline state
          !shouldBeSticky && "relative w-full h-full rounded-2xl border border-fd-border",
          // Sticky state: framer-motion handles the position/scale tweening perfectly
          shouldBeSticky && "fixed bottom-6 right-6 lg:bottom-12 lg:right-12 w-[320px] lg:w-[500px] aspect-video z-40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-xl border border-fd-border/50"
        )}
      >
        {shouldBeSticky && (
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition-all hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <iframe 
          ref={iframeRef}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&enablejsapi=1&disablekb=1`} 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </motion.div>
    </div>
  );
}
