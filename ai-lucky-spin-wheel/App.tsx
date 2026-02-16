import React, { useState } from 'react';
import Wheel from './components/Wheel';
import Controls from './components/Controls';
import WinnerModal from './components/WinnerModal';
import { Prize } from './types';
import { DEFAULT_PRIZES } from './constants';
import { Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Simple audio elements
  const spinSoundRef = React.useRef<HTMLAudioElement | null>(null);
  const winSoundRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    spinSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-click-melodic-tone-1129.mp3'); // Placeholder click
    winSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'); // Placeholder win
  }, []);

  const handleSpinEnd = (wonPrize: Prize) => {
    setWinner(wonPrize);
    if (soundEnabled && winSoundRef.current) {
      winSoundRef.current.volume = 0.5;
      winSoundRef.current.play().catch(() => {});
    }
  };

  const handleSpinStart = (spinning: boolean) => {
    setIsSpinning(spinning);
    // Note: Continuous sound loops are tricky without user interaction on some browsers.
    // For now, we'll keep it simple or just visual.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Header */}
      <header className="p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 flex items-center justify-center font-bold text-white shadow-lg">
                幸
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              幸运大转盘
            </h1>
          </div>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5"/> : <VolumeX className="w-5 h-5"/>}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-80px)]">
        
        {/* Left: Wheel */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-slate-800/30 rounded-3xl border border-slate-700/50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <Wheel 
                prizes={prizes} 
                onSpinEnd={handleSpinEnd}
                isSpinning={isSpinning}
                setIsSpinning={handleSpinStart}
            />
            
            <p className="mt-8 text-slate-400 text-sm animate-pulse">
                {isSpinning ? "祝你好运！" : "点击中间按钮开始抽奖"}
            </p>
        </div>

        {/* Right: Controls */}
        <div className="w-full lg:w-[400px]">
            <Controls prizes={prizes} setPrizes={setPrizes} />
        </div>

      </main>

      <WinnerModal winner={winner} onClose={() => setWinner(null)} />
    </div>
  );
};

export default App;
