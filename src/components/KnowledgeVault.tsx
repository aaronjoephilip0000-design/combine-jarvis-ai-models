import React, { useState } from 'react';
import { Upload, FileText, Trash2, Brain, Globe } from 'lucide-react';
import { toast } from 'sonner';

export interface KnowledgeItem {
  id: string;
  content: string;
  source: string;
  timestamp: string;
  type: 'file' | 'text' | 'web';
}

interface KnowledgeVaultProps {
  knowledge: KnowledgeItem[];
  onAddKnowledge: (item: KnowledgeItem) => void;
  onRemoveKnowledge: (id: string) => void;
  onClearAll: () => void;
  isLearning: boolean;
  onTriggerWebLearning: () => void;
}

const KnowledgeVault: React.FC<KnowledgeVaultProps> = ({
  knowledge,
  onAddKnowledge,
  onRemoveKnowledge,
  onClearAll,
  isLearning,
  onTriggerWebLearning,
}) => {
  const [textInput, setTextInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        const newItem: KnowledgeItem = {
          id: Date.now() + '-' + Math.random().toString(36).slice(2),
          content: content.slice(0, 2400),
          source: file.name,
          timestamp: new Date().toISOString(),
          type: 'file',
        };
        
        onAddKnowledge(newItem);
        toast.success(`Learned from ${file.name}`, { description: `${Math.round(content.length / 10)} tokens ingested` });
      };
      reader.readAsText(file);
    });
  };

  const handleAddText = () => {
    if (!textInput.trim()) return;

    const item: KnowledgeItem = {
      id: Date.now().toString(36),
      content: textInput.trim(),
      source: 'Manual Entry',
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    
    onAddKnowledge(item);
    setTextInput('');
    toast.success('Knowledge added', { description: 'JARVIS has internalized this information' });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-3xl p-7">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="text-violet-400" size={22} />
          <div>
            <div className="font-semibold tracking-tight">PERSONAL KNOWLEDGE VAULT</div>
            <div className="text-[10px] text-white/40 tracking-[1px]">JARVIS LEARNS FROM YOU — FOREVER</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onTriggerWebLearning}
            disabled={isLearning}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-50"
          >
            <Globe size={14} /> {isLearning ? 'SYNCING...' : 'LEARN FROM NET'}
          </button>
          {knowledge.length > 0 && (
            <button onClick={onClearAll} className="text-xs px-4 py-2 text-red-400 border border-red-900/50 hover:bg-red-950/30 rounded-full">CLEAR VAULT</button>
          )}
        </div>
      </div>

      {/* Upload area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 mb-5 transition-all ${isDragging ? 'border-white bg-white/5' : 'border-white/20 hover:border-white/40'}`}
      >
        <div className="flex flex-col items-center text-center">
          <Upload className="text-white/40 mb-3" size={28} />
          <div className="font-medium mb-1">DROP FILES OR CLICK TO UPLOAD</div>
          <div className="text-xs text-white/50 mb-4">TXT, MD, JSON, CSV, LOGS — Anything you want JARVIS to know</div>
          
          <label className="cursor-pointer px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm">
            CHOOSE FILES
            <input 
              type="file" 
              multiple 
              className="hidden" 
              onChange={(e) => handleFileUpload(e.target.files)}
              accept=".txt,.md,.json,.csv,.log,.js,.ts,.py" 
            />
          </label>
        </div>
      </div>

      {/* Manual input */}
      <div className="flex gap-2 mb-5">
        <input 
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
          placeholder="Tell JARVIS something important... e.g. 'I prefer meetings at 9am'"
          className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none"
        />
        <button onClick={handleAddText} className="px-6 rounded-2xl bg-white text-black text-sm font-medium">TEACH</button>
      </div>

      {/* Learned items */}
      <div>
        <div className="flex justify-between text-xs mb-2 px-1 text-white/40 font-mono">
          <div>KNOWLEDGE BASE — {knowledge.length} ITEMS</div>
          <div>USED IN EVERY RESPONSE</div>
        </div>
        
        {knowledge.length === 0 ? (
          <div className="text-center py-9 text-sm border border-white/10 rounded-2xl text-white/40">No personal knowledge yet. Upload files or teach JARVIS directly.</div>
        ) : (
          <div className="space-y-2 max-h-[270px] overflow-auto pr-1 custom-scroll">
            {knowledge.slice().reverse().map((item) => (
              <div key={item.id} className="flex gap-4 bg-zinc-900 border border-white/10 rounded-2xl p-4 text-sm group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs mb-1 text-white/40">
                    <FileText size={12} /> {item.source} • {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-white/90 leading-snug line-clamp-2">{item.content}</div>
                </div>
                <button onClick={() => onRemoveKnowledge(item.id)} className="self-start text-white/30 hover:text-red-400 opacity-70 group-hover:opacity-100 mt-1">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeVault;
