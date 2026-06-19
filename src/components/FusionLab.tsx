import React from 'react';
import { X, Zap, Star } from 'lucide-react';
import { JarvisModel } from './ModelCard';

interface FusionLabProps {
  fusedModels: JarvisModel[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onLaunchCombined: () => void;
}

const FusionLab: React.FC<FusionLabProps> = ({ fusedModels, onRemove, onClear, onLaunchCombined }) => {
  if (fusedModels.length === 0) return null;

  const combinedName = fusedModels.length > 1 
    ? `HYBRID: ${fusedModels.map(m => m.name.split(' ')[0]).join(' + ')}`
    : fusedModels[0].name;

  const totalStars = fusedModels.reduce((acc, m) => acc + (m.stars || 0), 0);
  const allFeatures = Array.from(new Set(fusedModels.flatMap(m => m.features))).slice(0, 7);

  const generatedPrompt = `You are the ULTIMATE JARVIS, a fusion of ${fusedModels.length} top AI assistants from GitHub and YouTube. 
Capabilities include: ${allFeatures.join(', ')}. 
Personality: Witty, calm, ultra-efficient like Tony Stark's JARVIS. 
Prioritize: Privacy, speed, offline capability. Always respond in a confident, elegant tone.`;

  return (
    <div className="sticky top-4 z-50 mx-auto mb-8 w-full max-w-5xl rounded-3xl border border-white/10 bg-zinc-950/95 p-7 backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-violet-500/10 border border-amber-500/20">
              <Zap size={15} className="text-amber-400" />
              <span className="font-mono uppercase tracking-[2px] text-xs text-amber-400">FUSION LAB — ACTIVE</span>
            </div>
            <span className="text-white text-xl font-semibold tracking-tighter">{combinedName}</span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">Combined intelligence of {fusedModels.length} elite JARVIS implementations</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClear} className="rounded-xl border border-white/10 px-5 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition">CLEAR ALL</button>
          <button 
            onClick={onLaunchCombined}
            className="rounded-xl bg-white px-6 py-2 text-sm font-semibold text-black active:bg-white/90 flex items-center gap-2 transition"
          >
            <Zap size={17} /> LAUNCH COMBINED JARVIS
          </button>
        </div>
      </div>

      {/* Selected models */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {fusedModels.map(model => (
          <div key={model.id} className="flex justify-between items-center rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`rounded-lg px-2 py-px text-[10px] uppercase tracking-widest flex-shrink-0 ${model.type === 'github' ? 'bg-blue-500/20 text-blue-400' : model.type === 'youtube' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {model.type}
              </div>
              <span className="font-medium text-white truncate">{model.name}</span>
            </div>
            <button onClick={() => onRemove(model.id)} className="p-1 text-white/40 hover:text-red-400 ml-2">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Stats + Generated Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white/5 px-6 py-4 text-sm border border-white/10">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Star size={17} /> <span className="font-semibold">COMBINED METRICS</span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-white">
            <div><span className="text-zinc-400">Total Stars:</span> {(totalStars / 1000).toFixed(1)}k</div>
            <div><span className="text-zinc-400">Models:</span> {fusedModels.length}</div>
            <div><span className="text-zinc-400">Unique Features:</span> {allFeatures.length}</div>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-zinc-900/80 border border-white/10 p-5">
          <div className="text-xs text-white/60 tracking-[1px] font-mono mb-2">COMBINED SYSTEM PROMPT</div>
          <div className="text-[13px] text-zinc-300 leading-relaxed font-light">
            {generatedPrompt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FusionLab;
