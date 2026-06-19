import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Shield, Check, AlertTriangle, User } from 'lucide-react';

interface OwnerLockProps {
  onUnlock: (ownerData: OwnerData) => void;
}

export interface OwnerData {
  faceImage: string;
  voiceSample: string | null;
  name: string;
  enrolledAt: string;
}

const OwnerLock: React.FC<OwnerLockProps> = ({ onUnlock }) => {
  const [step, setStep] = useState<'welcome' | 'face' | 'voice' | 'complete'>('welcome');
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [voiceSample, setVoiceSample] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [ownerName, setOwnerName] = useState('Tony Stark');
  const [error, setError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Check for previously enrolled owner
  useEffect(() => {
    const saved = localStorage.getItem('jarvis_owner');
    if (saved) {
      const data: OwnerData = JSON.parse(saved);
      // Auto-unlock if already enrolled (demo mode with re-verify)
      setTimeout(() => {
        onUnlock(data);
      }, 1200);
    }
  }, [onUnlock]);

  const startCamera = async () => {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStep('face');
    } catch (e) {
      setError('Camera access denied. Please allow camera to continue. (This is required for biometric security)');
    }
  };

  const captureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 360;

    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Create a high quality snapshot
    const imageData = canvas.toDataURL('image/jpeg', 0.92);
    setFaceImage(imageData);

    // Stop camera after capture
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    setTimeout(() => {
      setStep('voice');
    }, 900);
  };

  const retakeFace = () => {
    setFaceImage(null);
    startCamera();
  };

  const startVoiceRecording = async () => {
    setError('');
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setVoiceSample(base64Audio);
          audioStream.getTracks().forEach(t => t.stop());
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      setError('Microphone access required for voice verification.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const completeEnrollment = () => {
    if (!faceImage) {
      setError('Face capture required.');
      return;
    }

    const ownerData: OwnerData = {
      faceImage,
      voiceSample,
      name: ownerName.trim() || 'Sir',
      enrolledAt: new Date().toISOString(),
    };

    // Persist owner
    localStorage.setItem('jarvis_owner', JSON.stringify(ownerData));

    setStep('complete');

    setTimeout(() => {
      onUnlock(ownerData);
    }, 1600);
  };

  const resetAll = () => {
    localStorage.removeItem('jarvis_owner');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center">
      <div className="max-w-[680px] w-full px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded bg-white flex items-center justify-center">
              <Shield className="text-black" size={21} />
            </div>
            <div>
              <div className="font-semibold tracking-[-1.5px] text-3xl">J.A.R.V.I.S.</div>
              <div className="text-xs font-mono text-red-400 tracking-[3px] -mt-1">SECURE • OWNER-ONLY</div>
            </div>
          </div>
          <button onClick={resetAll} className="text-xs px-4 py-1.5 text-white/40 hover:text-white border border-white/10 rounded">RESET OWNER</button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-9">
          {step === 'welcome' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 mb-8 border border-red-600/30">
                <Shield className="text-red-500" size={32} />
              </div>
              <h1 className="text-5xl font-semibold tracking-[-2.5px] mb-3">IDENTITY VERIFICATION</h1>
              <p className="text-xl text-white/60 max-w-md mx-auto">
                This system is locked to its owner only.<br />It will remember your face and voice.
              </p>

              <div className="mt-9">
                <div className="inline-block text-left mb-6 text-sm bg-zinc-900 border border-white/10 rounded-2xl p-5">
                  <div className="text-red-400 font-mono text-xs tracking-widest mb-2">SECURITY PROTOCOL ACTIVE</div>
                  <ul className="space-y-1.5 text-white/70 text-sm">
                    <li>• Facial recognition scan required</li>
                    <li>• Voiceprint verification</li>
                    <li>• Only YOU can access or command JARVIS</li>
                    <li>• Unauthorized access will be denied</li>
                  </ul>
                </div>
              </div>

              <button 
                onClick={startCamera}
                className="mt-4 px-10 py-4 bg-white hover:bg-white/95 active:bg-white text-black font-semibold rounded-2xl flex items-center gap-3 mx-auto text-lg transition"
              >
                <Camera size={22} /> BEGIN OWNER ENROLLMENT
              </button>
              <div className="mt-3 text-[10px] text-white/40 tracking-widest">CAMERA + MIC REQUIRED</div>
            </div>
          )}

          {/* FACE SCAN */}
          {step === 'face' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Camera className="text-cyan-400" />
                <div>
                  <div className="text-lg font-medium tracking-tight">FACE CAPTURE — OWNER BIOMETRIC</div>
                  <div className="text-xs text-white/50">Look straight into camera. We store a secure reference.</div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video flex items-center justify-center">
                {!faceImage ? (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover scale-x-[-1]" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-[3px] mb-1 text-white/50">CENTER YOUR FACE</div>
                        <div className="border border-white/30 rounded-full w-52 h-52" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={faceImage} alt="Your face" className="w-full h-full object-cover scale-x-[-1]" />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-3 mt-5">
                {!faceImage ? (
                  <button onClick={captureFace} className="flex-1 bg-white text-black py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 active:bg-zinc-200">
                    <Check size={19} /> CAPTURE FACE
                  </button>
                ) : (
                  <>
                    <button onClick={retakeFace} className="flex-1 border border-white/20 py-3.5 rounded-2xl text-sm hover:bg-white/5">RETAKE PHOTO</button>
                    <button onClick={() => setStep('voice')} className="flex-1 bg-white text-black py-3.5 rounded-2xl font-semibold">CONTINUE TO VOICE</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* VOICE PRINT */}
          {step === 'voice' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Mic className="text-red-400" />
                <div>
                  <div className="text-lg font-medium tracking-tight">VOICEPRINT ENROLLMENT</div>
                  <div className="text-xs text-white/50">Say your name clearly — “I am [Name], owner of this JARVIS.”</div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 text-center min-h-[200px] flex items-center justify-center">
                {!voiceSample ? (
                  <div>
                    <button
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      className={`inline-flex items-center gap-3 rounded-full px-9 py-4 text-sm font-semibold transition ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-white text-black'}`}
                    >
                      {isRecording ? <>STOP RECORDING <div className="w-2 h-2 rounded-full bg-white animate-ping" /></> : <><Mic size={18} /> RECORD VOICE SAMPLE (5s)</>}
                    </button>
                    <div className="text-[10px] mt-4 text-white/40 tracking-widest">SPEAK LOUD AND CLEAR</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 mb-3">
                      <Check className="text-emerald-400" />
                    </div>
                    <div className="font-medium text-emerald-400">VOICE SAMPLE CAPTURED</div>
                    <div className="text-xs text-white/50 mt-1">Reference voiceprint saved</div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <button onClick={() => { setVoiceSample(null); setIsRecording(false); }} className="flex-1 border border-white/20 py-3 rounded-2xl text-sm">RE-RECORD</button>
                <button 
                  onClick={() => setStep('complete')} 
                  disabled={!voiceSample && !faceImage}
                  className="flex-1 bg-white disabled:bg-zinc-800 py-3 text-black font-semibold rounded-2xl disabled:text-white/50"
                >
                  PROCEED TO FINALIZE
                </button>
              </div>
            </div>
          )}

          {/* FINALIZE */}
          {step === 'complete' && (
            <div className="text-center py-10">
              <div className="mx-auto mb-7 w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                <User className="text-emerald-400" size={38} />
              </div>
              <div className="text-4xl tracking-tighter font-semibold mb-1">WELCOME BACK, {ownerName.toUpperCase()}</div>
              <div className="text-emerald-400 text-sm tracking-[3px]">BIOMETRICS VERIFIED • SYSTEM UNLOCKED</div>

              <div className="mt-8">
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="bg-black border border-white/20 px-6 py-3 rounded-2xl text-center text-lg w-72 focus:outline-none focus:border-white/40"
                  placeholder="Your name"
                />
              </div>

              <button onClick={completeEnrollment} className="mt-8 px-16 py-4 bg-white text-black font-semibold rounded-2xl inline-flex items-center gap-3 text-lg">
                ACTIVATE PERSONAL JARVIS <Check size={22} />
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 text-center text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg py-2 px-4 flex items-center gap-2 justify-center">
              <AlertTriangle size={15} /> {error}
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-[10px] font-mono tracking-[1.5px] text-white/30">
          THIS INSTANCE WILL ONLY RESPOND TO THE ENROLLED OWNER
        </div>
      </div>
    </div>
  );
};

export default OwnerLock;
