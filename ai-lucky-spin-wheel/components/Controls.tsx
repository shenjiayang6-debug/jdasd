import React, { useState } from 'react';
import { Prize } from '../types';
import { Sparkles, Trash2, Plus, RefreshCw, Dice5 } from 'lucide-react';
import { SEGMENT_COLORS, DEFAULT_THEMES } from '../constants';
import { generatePrizesWithGemini } from '../services/geminiService';

interface ControlsProps {
  prizes: Prize[];
  setPrizes: (prizes: Prize[]) => void;
}

const Controls: React.FC<ControlsProps> = ({ prizes, setPrizes }) => {
  const [newPrizeText, setNewPrizeText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const addPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrizeText.trim()) return;
    
    const color = SEGMENT_COLORS[prizes.length % SEGMENT_COLORS.length];
    const newPrize: Prize = {
      id: Date.now().toString(),
      text: newPrizeText.trim(),
      color
    };
    
    setPrizes([...prizes, newPrize]);
    setNewPrizeText('');
  };

  const removePrize = (id: string) => {
    if (prizes.length <= 2) {
      alert("至少需要保留2个选项！");
      return;
    }
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const handleAiGenerate = async (theme: string) => {
    setIsGenerating(true);
    try {
      const texts = await generatePrizesWithGemini(theme, 8);
      const generatedPrizes: Prize[] = texts.map((text, index) => ({
        id: `ai-${Date.now()}-${index}`,
        text,
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length]
      }));
      setPrizes(generatedPrizes);
      setAiPrompt('');
    } catch (err) {
      alert("生成失败，请检查 API Key 或重试。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700 h-full flex flex-col gap-6 shadow-xl">
      
      {/* AI Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          <Sparkles className="w-5 h-5 text-purple-400" />
          AI 主题生成
        </h3>
        <div className="flex gap-2">
            <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="例如：'午餐吃什么' 或 '惩罚挑战'"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button 
                onClick={() => handleAiGenerate(aiPrompt || '有趣的主题')}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            >
                {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Sparkles className="w-5 h-5"/>}
            </button>
        </div>
        
        {/* Quick Chips */}
        <div className="flex flex-wrap gap-2">
            {DEFAULT_THEMES.slice(0, 4).map(theme => (
                <button
                    key={theme}
                    onClick={() => handleAiGenerate(theme)}
                    disabled={isGenerating}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-md transition-colors text-slate-300"
                >
                    {theme}
                </button>
            ))}
             <button
                    onClick={() => handleAiGenerate("随机有趣")}
                    disabled={isGenerating}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-md transition-colors text-slate-300 flex items-center gap-1"
                >
                    <Dice5 className="w-3 h-3"/> 随机
            </button>
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* Manual List */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-[300px]">
        <h3 className="text-lg font-bold mb-3 flex justify-between items-center">
            <span>当前选项 <span className="text-slate-400 text-sm">({prizes.length})</span></span>
        </h3>
        
        <form onSubmit={addPrize} className="flex gap-2 mb-4">
            <input 
                type="text" 
                value={newPrizeText}
                onChange={(e) => setNewPrizeText(e.target.value)}
                placeholder="添加新选项..."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg">
                <Plus className="w-5 h-5"/>
            </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {prizes.map((prize, idx) => (
                <div key={prize.id} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-lg group hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: prize.color }}></div>
                        <span className="text-sm font-medium">{prize.text}</span>
                    </div>
                    <button 
                        onClick={() => removePrize(prize.id)}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                        <Trash2 className="w-4 h-4"/>
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Controls;
