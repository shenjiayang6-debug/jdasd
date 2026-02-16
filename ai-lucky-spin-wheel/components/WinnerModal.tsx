import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Prize } from '../types';
import { X, Trophy } from 'lucide-react';

interface WinnerModalProps {
  winner: Prize | null;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose }) => {
  useEffect(() => {
    if (winner) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: [winner.color, '#ffffff']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: [winner.color, '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 rounded-2xl max-w-sm w-full border border-slate-600 shadow-2xl transform transition-all scale-100 p-8 text-center relative overflow-hidden">
        {/* Glow effect behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
            <X className="w-6 h-6" />
        </button>

        <div className="mb-6 inline-flex p-4 rounded-full bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/50">
            <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-slate-200 mb-2">结果出炉！</h2>
        
        <div className="py-6">
            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm">
                {winner.text}
            </p>
        </div>

        <button
            onClick={onClose}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
        >
            再转一次
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
