import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JarvisModel } from './ModelCard';

interface Message {
  role: 'user' | 'jarvis';
  content: string;
  time: string;
}

interface JarvisDemoProps {
  model: JarvisModel | null;
  onClose: () => void;
}

const JARVIS_RESPONSES = [
  "Affirmative. Executing now.",
  "Sir, I've completed the task.",
  "Analyzing the situation... Done.",
  "At your service. What else can I assist with?",
  "All systems operational. Shall I proceed?",
  "I've pulled the latest data for you.",
  "Voice interface ready. Awaiting further instructions.",
  "Processing multi-model fusion response.",
  "Done. Would you like me to optimize that further?",
  "Sir, I've combined the top models to provide this answer."
];

const JarvisDemo: React.FC<JarvisDemoProps> = ({ model, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'jarvis', 
      content: model 
        ? `Good evening, Sir. ${model.name} online. All systems combined and operational.` 
        : "J.A.R.V.I.S. online. All 100 models fused and ready.", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRec();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Auto send after voice
        setTimeout(() => handleSend(transcript), 350);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const generateJarvisResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Smart contextual responses based on top JARVIS features
    if (q.includes('weather') || q.includes('temperature')) {
      return "Current weather: 72°F. Clear skies, Sir. Shall I pull up the extended forecast?";
    }
    if (q.includes('time') || q.includes('clock')) {
      return `The current time is ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`;
    }
    if (q.includes('open') || q.includes('launch')) {
      const site = q.match(/(youtube|github|twitter|gmail|notion|spotify)/)?.[0] || 'a site';
      return `Opening ${site}. Executed.`;
    }
    if (q.includes('search') || q.includes('find')) {
      return "I've searched across the top 100 repositories. The strongest match appears to be a multi-agent offline JARVIS built with Ollama and LangGraph.";
    }
    if (q.includes('combine') || q.includes('fusion') || q.includes('merge')) {
      return "Fusing models. Combining GitHub multi-model orchestration with YouTube voice + vision pipeline. Hybrid agent ready.";
    }
    if (q.includes('music') || q.includes('play')) {
      return "Playing your favorite playlist. The Iron Man soundtrack is queued.";
    }
    if (q.includes('system') || q.includes('status')) {
      return "All core modules operational. 97 models from GitHub and 3 from YouTube integrated. Battery 100%. CPU at 12%.";
    }
    if (q.includes('who') || q.includes('what are you')) {
      return model 
        ? `${model.name} is a top-tier JARVIS implementation. Features: ${model.features.slice(0,2).join(', ')}.`
        : "I am the combined intelligence of the top 100 JARVIS models from GitHub and YouTube.";
    }
    if (q.includes('offline') || q.includes('local')) {
      return "Fully offline capable using Ollama + Whisper + Piper. All top models include local inference support.";
    }

    // Default witty JARVIS-style
    return JARVIS_RESPONSES[Math.floor(Math.random() * JARVIS_RESPONSES.length)];
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 0.96;
    utterance.volume = 0.85;
    
    // Try to pick a deeper British voice if available
    const voices = synthRef.current.getVoices();
    const britishVoice = voices.find(v => v.lang.includes('en-GB') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('uk'));
    if (britishVoice) utterance.voice = britishVoice;

    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  const handleSend = (overrideInput?: string) => {
    const text = (overrideInput || input).trim();
    if (!text) return;

    const userMsg: Message = { 
      role: 'user', 
      content: text, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Simulate thinking + smart response
    setTimeout(() => {
      const responseText = generateJarvisResponse(text);
      const jarvisMsg: Message = {
        role: 'jarvis',
        content: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, jarvisMsg]);
      setIsProcessing(false);
      
      if (voiceEnabled) {
        speak(responseText);
      }
    }, 680);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const quickCommands = [
    "What's the weather?",
    "Open GitHub",
    "Combine the top models",
    "System status",
    "Play some music",
    "Tell me the time"
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-[860px] rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-8 py-5 bg-black/40">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center">
              <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
            </div>
            <div>
              <div className="font-semibold text-lg tracking-[-0.3px] text-white">J.A.R.V.I.S.</div>
              <div className="text-[10px] text-cyan-400 font-mono -mt-1 tracking-[1.5px]">FUSED • {model ? model.name.toUpperCase() : 'ALL 100 MODELS'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setVoiceEnabled(!voiceEnabled)} 
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs hover:bg-white/5 transition"
            >
              {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              VOICE {voiceEnabled ? 'ON' : 'OFF'}
            </button>
            {isSpeaking && (
              <button onClick={stopSpeaking} className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400 flex items-center gap-1">
                STOP SPEAKING
              </button>
            )}
            <button onClick={onClose} className="text-white/60 hover:text-white p-2">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={chatRef} className="h-[420px] overflow-y-auto px-8 py-7 space-y-6 bg-zinc-950 text-sm">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[78%] rounded-2xl px-5 py-3.5 ${msg.role === 'user' 
                  ? 'bg-white text-black' 
                  : 'bg-zinc-900 border border-white/10 text-white'}`}>
                  <div className="leading-relaxed tracking-[-0.1px]">{msg.content}</div>
                  <div className={`text-[10px] mt-1 font-mono ${msg.role === 'user' ? 'text-black/50' : 'text-white/40'}`}>{msg.time}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <div className="flex items-center gap-3 pl-1 text-zinc-400 text-xs tracking-[1px]">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
              </div>
              THINKING ACROSS 100 MODELS...
            </div>
          )}
        </div>

        {/* Quick Commands */}
        <div className="px-8 flex flex-wrap gap-2 border-t border-white/10 py-3 bg-zinc-950/90">
          {quickCommands.map((cmd, i) => (
            <button 
              key={i} 
              onClick={() => { setInput(cmd); handleSend(cmd); }}
              className="px-4 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition text-zinc-400 hover:text-white"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 bg-black/60 p-5 flex items-center gap-3">
          <button 
            onClick={toggleListening}
            className={`h-12 w-12 flex items-center justify-center rounded-2xl border transition-all active:scale-95 ${isListening 
              ? 'bg-red-600 border-red-500 text-white animate-pulse' 
              : 'bg-zinc-900 hover:bg-zinc-800 border-white/10 text-zinc-400 hover:text-white'}`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Speak or type a command — e.g. 'open GitHub' or 'combine top models'"
            className="flex-1 bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-500 rounded-2xl px-6 py-[17px] focus:outline-none focus:border-white/30 text-[15px]"
          />

          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white disabled:bg-zinc-800 text-black disabled:text-white/40 hover:bg-white/90 active:bg-white/70 transition disabled:cursor-not-allowed"
          >
            <Send size={19} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default JarvisDemo;
