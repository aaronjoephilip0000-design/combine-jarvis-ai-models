import React from 'react';
import { Star, Play, Code, Video, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export interface JarvisModel {
  id: number;
  name: string;
  type: 'github' | 'youtube' | 'combined';
  description: string;
  stars?: number;
  views?: number;
  language: string;
  tags: string[];
  githubUrl?: string;
  youtubeUrl?: string;
  features: string[];
  year: number;
}

interface ModelCardProps {
  model: JarvisModel;
  onAddToFusion: (model: JarvisModel) => void;
  onTryDemo: (model: JarvisModel) => void;
  isInFusion: boolean;
  rank: number;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onAddToFusion, onTryDemo, isInFusion, rank }) => {
  const isGithub = model.type === 'github';
  const isYoutube = model.type === 'youtube';
  const isCombined = model.type === 'combined';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 p-6 backdrop-blur-xl hover:border-white/20 transition-all"
    >
      {/* Rank badge */}
      <div className="absolute -top-px -right-px px-3 py-1 text-[10px] font-mono tracking-[2px] bg-white/5 border-l border-b border-white/10 rounded-bl-lg rounded-tr-2xl">
        #{rank}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
            isGithub ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
            isYoutube ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            'bg-gradient-to-br from-amber-500/10 to-violet-500/10 border-amber-500/30 text-amber-400'
          }`}>
            {isGithub && <Code size={18} />}
            {isYoutube && <Video size={18} />}
            {isCombined && <Zap size={18} />}
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-tight text-[15px] leading-tight pr-8">{model.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-[10px] uppercase tracking-[1.5px] text-zinc-500">
              {model.language} • {model.year}
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-zinc-400 line-clamp-3 flex-1 leading-relaxed mb-5">
        {model.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        {model.stars && (
          <div className="flex items-center gap-1.5 text-sm">
            <Star className="text-amber-400" size={15} />
            <span className="font-mono text-white font-medium">{(model.stars / 1000).toFixed(1)}k</span>
            <span className="text-[10px] text-zinc-500">STARS</span>
          </div>
        )}
        {model.views && (
          <div className="flex items-center gap-1.5 text-sm">
            <Play className="text-red-400" size={15} />
            <span className="font-mono text-white font-medium">{(model.views / 1000000).toFixed(1)}M</span>
            <span className="text-[10px] text-zinc-500">VIEWS</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {model.tags.slice(0, 4).map((tag, idx) => (
          <span key={idx} className="text-[10px] px-2.5 py-px bg-white/5 border border-white/10 text-zinc-400 rounded">
            {tag}
          </span>
        ))}
      </div>

      {/* Features */}
      <div className="mb-5">
        <div className="text-[10px] font-mono tracking-[1px] text-zinc-500 mb-1.5">KEY CAPABILITIES</div>
        <div className="flex flex-wrap gap-x-2 gap-y-px text-xs text-zinc-300">
          {model.features.slice(0, 3).map((f, i) => (
            <span key={i}>• {f}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-4 border-t border-white/10">
        <button
          onClick={() => onTryDemo(model)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2 transition active:scale-[0.985]"
        >
          <Play size={14} /> TRY DEMO
        </button>
        
        <button
          onClick={() => onAddToFusion(model)}
          disabled={isInFusion}
          className={`flex items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition active:scale-[0.985] ${
            isInFusion 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default' 
              : 'bg-white hover:bg-white/90 text-black'
          }`}
        >
          {isInFusion ? <><Heart size={14} /> ADDED</> : <><Zap size={14} /> FUSE</>}
        </button>

        <div className="flex gap-px">
          {model.githubUrl && (
            <a href={model.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition">
              <Code size={15} />
            </a>
          )}
          {model.youtubeUrl && (
            <a href={model.youtubeUrl} target="_blank" rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition">
              <Video size={15} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ModelCard;
