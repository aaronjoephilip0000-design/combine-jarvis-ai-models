import React, { useEffect, useState } from 'react';
import { Shield, Zap, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface HealingLog {
  id: number;
  time: string;
  message: string;
  status: 'fail' | 'heal' | 'info';
}

interface SelfHealMonitorProps {
  isActive: boolean;
  onForceHeal: () => void;
}

const SelfHealMonitor: React.FC<SelfHealMonitorProps> = ({ isActive, onForceHeal }) => {
  const [logs, setLogs] = useState<HealingLog[]>([
    { id: 1, time: '09:41', message: 'All core JARVIS modules nominal', status: 'info' },
  ]);
  const [healingCount, setHealingCount] = useState(0);
  const [systemHealth, setSystemHealth] = useState(99);

  // Simulate continuous self-healing
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const shouldFail = Math.random() < 0.13; // ~13% chance of simulated failure

      if (shouldFail) {
        const failMessages = [
          'Speech synthesis buffer overflow',
          'Knowledge sync dropped',
          'Memory index fragmentation',
          'Web crawler rate limit hit',
          'Voice recognition drift detected',
        ];
        const failMsg = failMessages[Math.floor(Math.random() * failMessages.length)];

        setLogs(prev => [
          { 
            id: Date.now(), 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            message: failMsg, 
            status: 'fail' as const
          },
          ...prev
        ].slice(0, 7));

        // Auto self-heal
        setTimeout(() => {
          const healMsg = 'Self-healed: ' + failMsg.split(' ').slice(0, 3).join(' ') + ' → restored';
          setLogs(prev => [
            { 
              id: Date.now() + 1, 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
              message: healMsg, 
              status: 'heal' as const
            },
            ...prev
          ].slice(0, 7));
          setHealingCount(c => c + 1);
          setSystemHealth(h => Math.min(100, Math.max(92, h + 1)));
        }, 1100);
      } else {
        // Occasional healthy updates
        if (Math.random() < 0.25) {
          setLogs(prev => [
            { 
              id: Date.now(), 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
              message: 'Continuous learning active • ' + (['GitHub', 'YouTube', 'Docs', 'News'][Math.floor(Math.random()*4)]), 
              status: 'info' as const
            },
            ...prev
          ].slice(0, 7));
        }
      }

      // Slowly degrade and recover health
      setSystemHealth(h => {
        const delta = (Math.random() - 0.48) * 1.6;
        return Math.max(91, Math.min(100, Math.round(h + delta)));
      });
    }, 4800);

    return () => clearInterval(interval);
  }, [isActive]);

  const triggerManualHeal = () => {
    onForceHeal();
    const newLog: HealingLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: 'Manual self-heal initiated — all subsystems verified',
      status: 'heal',
    };
    setLogs(prev => [newLog, ...prev].slice(0, 7));
    setHealingCount(c => c + 1);
    setSystemHealth(100);
  };

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-3xl p-7">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="text-emerald-400" size={19} />
            <span className="font-semibold tracking-tight">SELF-HEALING SYSTEM</span>
          </div>
          <div className={`px-2.5 py-px rounded text-xs font-mono border ${systemHealth > 96 ? 'border-emerald-500/30 text-emerald-400' : 'border-yellow-500/30 text-yellow-400'}`}>
            HEALTH: {systemHealth}%
          </div>
        </div>
        <button 
          onClick={triggerManualHeal}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full border border-white/10 hover:bg-white/5"
        >
          <RefreshCw size={13} /> FORCE SELF-HEAL
        </button>
      </div>

      <div className="space-y-1.5 max-h-[165px] overflow-y-auto pr-1 text-sm custom-scroll">
        {logs.length === 0 ? (
          <div className="text-xs text-white/40 py-4">Monitoring active...</div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="flex items-start gap-3 font-mono text-xs py-1.5 px-3 rounded-xl bg-black/40">
              <span className="text-white/40 w-12 shrink-0 tabular-nums">{log.time}</span>
              <span className={`flex-1 ${log.status === 'fail' ? 'text-red-400' : log.status === 'heal' ? 'text-emerald-400' : 'text-white/80'}`}>
                {log.status === 'fail' && <AlertCircle size={12} className="inline mr-1.5 -mt-px" />}
                {log.status === 'heal' && <CheckCircle size={12} className="inline mr-1.5 -mt-px" />}
                {log.status === 'info' && <Zap size={12} className="inline mr-1.5 -mt-px" />}
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex justify-between text-xs text-white/40">
        <div>Auto-recovery enabled</div>
        <div>HEALED: <span className="font-mono text-emerald-400">{healingCount}</span> EVENTS</div>
      </div>
    </div>
  );
};

export default SelfHealMonitor;
