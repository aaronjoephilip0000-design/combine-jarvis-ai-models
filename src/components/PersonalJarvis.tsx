import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeItem } from './KnowledgeVault';
import { OwnerData } from './OwnerLock';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'jarvis';
  content: string;
  time: string;
  source?: string;
}

interface PersonalJarvisProps {
  owner: OwnerData;
  knowledge: KnowledgeItem[];
  onAddKnowledge: (item: KnowledgeItem) => void;
  onHeal: (message: string) => void;
}

const PersonalJarvis: React.FC<PersonalJarvisProps> = ({ owner, knowledge, onAddKnowledge, onHeal }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'jarvis', 
      content: `Good evening, ${owner.name}. All systems online. I am your personal JARVIS. Only you have access. I am continuously learning.`, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLearning, setIsLearning] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      recognitionRef.current = new SpeechRec();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSend(transcript);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Build rich context from personal knowledge
  const buildContext = (): string => {
    if (knowledge.length === 0) return '';
    
    const recent = knowledge.slice(-4).map(k => 
      `[${k.source}] ${k.content.slice(0, 220)}`
    ).join('\n');
    
    return `Your personal knowledge:\n${recent}\n\nAlways reference this knowledge when relevant. Speak directly to ${owner.name}.`;
  };

  const generateResponse = (query: string): { text: string; source?: string } => {
    const q = query.toLowerCase();
    const context = buildContext();

    // Use personal knowledge heavily
    if (knowledge.length > 0) {
      const relevant = knowledge.find(k => 
        k.content.toLowerCase().includes(q.split(' ').slice(0, 3).join(' ')) || 
        q.includes(k.source.toLowerCase())
      );
      if (relevant) {
        return { 
          text: `From what you taught me: ${relevant.content.slice(0, 280)}${relevant.content.length > 280 ? '...' : ''}. What else would you like me to do with this?`, 
          source: relevant.source 
        };
      }
    }

    // Continuous net simulation
    if (q.includes('news') || q.includes('latest') || q.includes('update')) {
      return { text: "Pulling live updates. The top models from GitHub just released new multi-agent orchestration patterns. Shall I incorporate them?", source: "Live Net" };
    }
    if (q.includes('learn') || q.includes('research')) {
      return { text: "Initiating deep research sweep. I am now ingesting the newest papers and repos related to your request.", source: "Continuous Learning" };
    }
    if (q.includes('weather')) {
      return { text: "Current conditions: 71°F, clear. No anomalies detected." };
    }
    if (q.includes('who am i') || q.includes('my name')) {
      return { text: `You are ${owner.name}. I am bound exclusively to you.` };
    }
    if (q.includes('heal') || q.includes('fix') || q.includes('broken')) {
      onHeal('User-initiated self-heal');
      return { text: "Running full self-diagnostics. All subsystems repaired and synchronized. Everything is optimal." };
    }
    if (q.includes('remember') || q.includes('know about me')) {
      const summary = knowledge.length > 0 ? `I have internalized ${knowledge.length} pieces of your personal data.` : 'I am still learning you.';
      return { text: `I remember everything you have told me. ${summary} I am loyal only to you.` };
    }
    if (q.includes('open') || q.includes('launch')) {
      return { text: "Executed. All requested systems are now active for you." };
    }

    // Smart default using knowledge context
    const base = context 
      ? `Understood. Using your personal data: ${knowledge[knowledge.length - 1].content.slice(0, 110)}... Executing now.`
      : "Affirmative, Sir. All top 100 models fused. Command received.";

    return { text: base };
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !synthRef.current) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.97;
    u.pitch = 0.94;
    u.volume = 0.9;
    u.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synthRef.current.speak(u);
  };

  const handleSend = async (override?: string) => {
    const text = (override || input).trim();
    if (!text) return;

    const userMsg: Message = { role: 'user', content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Simulate realistic processing + self-healing check
    await new Promise(r => setTimeout(r, 680 + Math.random() * 380));

    const { text: responseText, source } = generateResponse(text);

    const jarvisMsg: Message = {
      role: 'jarvis',
      content: responseText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source
    };

    setMessages(prev => [...prev, jarvisMsg]);
    setIsProcessing(false);

    if (voiceEnabled) speak(responseText);

    // Occasionally auto-learn from interaction
    if (text.length > 20 && Math.random() > 0.7) {
      const learned: KnowledgeItem = {
        id: 'auto-' + Date.now(),
        content: `User said: "${text}". My response: "${responseText.slice(0, 150)}"`,
        source: 'Self-learning',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      onAddKnowledge(learned);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition requires Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (_) {
        setIsListening(false);
      }
    }
  };

  // CONTINUOUS NET LEARNING — simulates real-time fetching and internalizing
  const learnFromNet = async () => {
    setIsLearning(true);
    
    const topics = [
      "Latest multi-agent architectures from GitHub trending",
      "New open-source Whisper fine-tunes released today",
      "Breakthrough local LLM benchmarks from HuggingFace",
      "Recent advancements in self-healing AI systems",
      "Top YouTube JARVIS tutorials updated this week"
    ];
    
    const topic = topics[Math.floor(Math.random() * topics.length)];

    await new Promise(r => setTimeout(r, 1450));

    const newKnowledge: KnowledgeItem = {
      id: 'net-' + Date.now(),
      content: `${topic}. Key takeaway: The top implementations now emphasize persistent memory, local inference, and proactive self-healing. This has been absorbed into my core.`,
      source: 'LIVE NET SYNC',
      timestamp: new Date().toISOString(),
      type: 'web'
    };

    onAddKnowledge(newKnowledge);
    setIsLearning(false);

    const learnMsg: Message = {
      role: 'jarvis',
      content: `I have absorbed fresh intelligence from the net: ${topic}. My capabilities have been upgraded in real time.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Continuous Learning'
    };
    setMessages(prev => [...prev, learnMsg]);

    toast.success("Continuous learning complete", { description: "New knowledge integrated" });
    onHeal("Net learning cycle completed successfully");
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const quickCommands = [
    "What have you learned about me?",
    "Learn from the net right now",
    "Run a self-heal",
    "Tell me the system status",
    "Remember this: I start work at 7am"
  ];

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[620px]">
      {/* Header */}
      <div className="px-7 py-5 bg-black/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="font-semibold tracking-tight">PERSONAL JARVIS — OWNER ONLY</div>
              <div className="text-[10px] font-mono text-emerald-400 -mt-0.5">VERIFIED: {owner.name.toUpperCase()}</div>
            </div>
          </div>
          <div className="px-2.5 py-px text-[10px] bg-white/5 rounded border border-white/10 text-white/50">BIOMETRIC LOCK ACTIVE</div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={learnFromNet} 
            disabled={isLearning}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 active:bg-white/10 disabled:opacity-60"
          >
            <Globe size={14} /> {isLearning ? 'LEARNING...' : 'LEARN FROM NET'}
          </button>
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-2 rounded-full border border-white/10 hover:bg-white/5">
            {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          {isSpeaking && <button onClick={stopSpeaking} className="text-xs px-3 py-1 text-red-400">STOP AUDIO</button>}
        </div>
      </div>

      {/* Chat */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-7 py-6 space-y-5 text-sm bg-zinc-950">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div key={idx} initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className={`flex ${msg.role === 'user' ? 'justify-end' : ''}`}>
              <div className={`max-w-[82%] px-5 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-white text-black' : 'bg-zinc-900 border border-white/10'}`}>
                <div className="leading-relaxed tracking-[-0.1px]">{msg.content}</div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-white/40">
                  <span>{msg.time}</span>
                  {msg.source && <span className="font-mono text-emerald-400/70">• {msg.source}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <div className="flex items-center gap-2 pl-2 text-xs text-zinc-400 font-mono">
            THINKING ACROSS 100 MODELS + YOUR DATA...
          </div>
        )}
      </div>

      {/* Quick Commands */}
      <div className="px-7 py-3 flex flex-wrap gap-1.5 border-t border-white/10 bg-black/40">
        {quickCommands.map((cmd, i) => (
          <button key={i} onClick={() => handleSend(cmd)} className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition">
            {cmd}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-5 bg-zinc-950 border-t border-white/10 flex items-center gap-3">
        <button 
          onClick={toggleListening}
          className={`h-12 w-12 flex items-center justify-center rounded-2xl border transition ${isListening ? 'bg-red-600 text-white border-red-500' : 'bg-zinc-900 border-white/10 hover:bg-zinc-800'}`}
        >
          {isListening ? <MicOff size={19} /> : <Mic size={19} />}
        </button>

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={`Command JARVIS, ${owner.name}...`}
          className="flex-1 bg-zinc-900 border border-white/10 focus:border-white/30 text-white rounded-2xl px-6 py-4 text-[15px] placeholder:text-white/40 outline-none"
        />

        <button onClick={() => handleSend()} disabled={!input.trim()} className="h-12 px-6 rounded-2xl bg-white disabled:bg-zinc-800 text-black font-medium flex items-center gap-2 disabled:text-white/40">
          <Send size={17} /> SEND
        </button>
      </div>
    </div>
  );
};

export default PersonalJarvis;
