import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-givd-dark/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-black w-full max-w-5xl aspect-video relative shadow-neo border-4 border-givd-dark animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-givd-blue transition-colors flex items-center gap-2"
        >
          <span className="font-bold font-display uppercase tracking-widest text-sm">Fermer</span>
          <X size={32} />
        </button>
        
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
          title="GIVD Demo" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="w-full h-full bg-gray-900"
        ></iframe>
      </div>
    </div>
  );
};