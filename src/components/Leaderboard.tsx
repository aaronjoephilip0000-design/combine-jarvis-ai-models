import React from 'react';
import { Star, Play, Trophy } from 'lucide-react';
import { JarvisModel } from './ModelCard';

interface LeaderboardProps {
  models: JarvisModel[];
  onTryDemo: (model: JarvisModel) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ models, onTryDemo }) => {
  const sortedByStars = [...models].filter(m => m.stars).sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 6);
  const sortedByViews = [...models].filter(m => m.views).sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* GitHub Stars */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-7">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="text-amber-400" />
          <div>
            <div className="font-semibold tracking-tight">TOP GITHUB JARVIS</div>
            <div className="text-xs text-white/40">BY STARS</div>
          </div>
        </div>
        <div className="space-y-px">
          {sortedByStars.map((model, idx) => (
            <div key={idx} onClick={() => onTryDemo(model)} className="flex items-center justify-between group py-[13px] px-4 -mx-1 hover:bg-white/5 cursor-pointer rounded-xl transition">
              <div className="flex items-center gap-3">
                <span className="font-mono w-5 text-xs text-white/50">{idx + 1}</span>
                <span className="text-sm text-white group-hover:text-amber-300 transition">{model.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-mono flex items-center gap-1 text-amber-400"><Star size={13} />{(model.stars! / 1000).toFixed(1)}k</span>
                <button className="opacity-50 group-hover:opacity-100 transition px-2 py-px text-[10px] rounded bg-white/5">DEMO</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Views */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-7">
        <div className="flex items-center gap-3 mb-5">
          <Play className="text-red-400" />
          <div>
            <div className="font-semibold tracking-tight">TOP YOUTUBE JARVIS</div>
            <div className="text-xs text-white/40">BY VIEWS</div>
          </div>
        </div>
        <div className="space-y-px">
          {sortedByViews.map((model, idx) => (
            <div key={idx} onClick={() => onTryDemo(model)} className="flex items-center justify-between group py-[13px] px-4 -mx-1 hover:bg-white/5 cursor-pointer rounded-xl transition">
              <div className="flex items-center gap-3">
                <span className="font-mono w-5 text-xs text-white/50">{idx + 1}</span>
                <span className="text-sm text-white group-hover:text-red-300 transition">{model.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-mono flex items-center gap-1 text-red-400"><Play size={13} />{(model.views! / 1000000).toFixed(1)}M</span>
                <button className="opacity-50 group-hover:opacity-100 transition px-2 py-px text-[10px] rounded bg-white/5">DEMO</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
