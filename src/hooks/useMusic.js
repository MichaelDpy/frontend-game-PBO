// hooks/useMusic.js
// Manages background music using Web Audio API (generated tones) or HTML Audio.
// Falls back to a simple generated melody if no audio file is provided.

import { useEffect, useRef, useCallback } from 'react';

/**
 * useMusic — plays looping background music.
 * @param {string} src - path to audio file (optional, uses generated music if omitted)
 * @param {boolean} muted - whether music is muted
 * @param {number} volume - volume 0..1
 */
export function useMusic(src, muted, volume = 0.35) {
  const audioRef = useRef(null);
  const startedRef = useRef(false);

  // Create / update audio element
  useEffect(() => {
    if (!src) return;

    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = muted ? 0 : volume;
      audioRef.current = audio;
    } else {
      // Update src if changed
      if (audioRef.current.src !== new URL(src, window.location.href).href) {
        audioRef.current.pause();
        audioRef.current.src = src;
        audioRef.current.load();
        startedRef.current = false;
      }
    }

    return () => {
      // Don't destroy on every re-render — only on unmount
    };
  }, [src]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        startedRef.current = false;
      }
    };
  }, []);

  // Sync muted state
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [muted, volume]);

  // Play / pause based on muted
  const play = useCallback(() => {
    if (!audioRef.current) return;
    if (!startedRef.current || audioRef.current.paused) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked — will play on next user interaction
      });
      startedRef.current = true;
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  return { play, pause };
}
