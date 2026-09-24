import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioCryButtonProps {
  audioUrl?: string;
  pokemonName: string;
}

export default function AudioCryButton({ audioUrl, pokemonName }: AudioCryButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayCry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioUrl) return;

    try {
      const audio = new Audio(audioUrl);
      setIsPlaying(true);
      audio.volume = 0.6;
      audio.play().catch((err) => {
        console.warn('Audio play was prevented:', err);
        setIsPlaying(false);
      });
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
    } catch {
      setIsPlaying(false);
    }
  };

  if (!audioUrl) return null;

  return (
    <button
      onClick={handlePlayCry}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-200 border ${
        isPlaying
          ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 animate-pulse'
          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-slate-500'
      }`}
      title={`Play ${pokemonName}'s cry`}
      aria-label={`Play ${pokemonName} cry`}
    >
      {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      <span>{isPlaying ? 'Playing...' : 'Cry'}</span>
    </button>
  );
}
