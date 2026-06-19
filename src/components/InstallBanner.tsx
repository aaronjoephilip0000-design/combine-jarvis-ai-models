import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstallBannerProps {
  ownerName: string;
}

const downloadCurrentApp = () => {
  const html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jarvis-personal.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const InstallBanner: React.FC<InstallBannerProps> = ({ ownerName }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isLocalFile = window.location.protocol === 'file:';

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt (only works on HTTPS)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // For local file, show banner with hosting instructions after 2s
    if (isLocalFile) {
      setTimeout(() => setShowBanner(true), 1500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isLocalFile]);

  const handleInstall = async () => {
    if (isLocalFile) {
      // Show guide instead
      setShowGuide(true);
      return;
    }
    if (!installPrompt) {
      // Fallback for iOS Safari
      toast(`On iOS: Tap the share icon and select "Add to Home Screen"`);
      return;
    }

    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    
    setInstallPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[300] bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white p-4 shadow-2xl"
          >
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/30">
                  <Smartphone size={26} />
                </div>
                <div>
                  <div className="font-semibold tracking-tight text-lg">
                    {isLocalFile ? 'JARVIS running from local file' : 'Install JARVIS as a real app'}
                  </div>
                  <div className="text-xs text-white/80">
                    {isLocalFile 
                      ? `${ownerName}, you opened this file locally. Host it on a free service (GitHub Pages, Vercel) to install as a native app.`
                      : `${ownerName}, install this like a native app — faster launch, works offline, full screen.`
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowGuide(true)}
                  className="px-4 py-2 text-xs font-medium rounded-full border border-white/30 hover:bg-white/10"
                >
                  PLAY STORE GUIDE
                </button>
                <button 
                  onClick={handleInstall}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 rounded-full font-semibold text-sm hover:bg-white/90 active:scale-95 transition"
                >
                  <Download size={16} /> INSTALL APP
                </button>
                <button onClick={() => setShowBanner(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play Store Publishing Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Smartphone className="text-white" size={22} />
                  </div>
                  <div>
                    <div className="font-semibold text-xl tracking-tight">Publish to Google Play Store</div>
                    <div className="text-xs text-white/50">Step-by-step guide for your JARVIS app</div>
                  </div>
                </div>
                <button onClick={() => setShowGuide(false)} className="text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 text-sm">
                {/* Step 0 - Quick local use */}
                <div className="border-2 border-blue-500/30 rounded-2xl p-5 bg-blue-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">0</span>
                    <span className="font-semibold text-blue-400">Use right now (opened this file on your phone)</span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed pl-8">
                    You opened JARVIS directly — <strong className="text-white">it works 100%!</strong> Biometrics, voice, learning, self-heal — all features run locally. 
                    The only thing that requires HTTPS is the "Install" button. So if you want it on your home screen as an app icon, host it free (next step). Otherwise, just use it here.
                  </p>
                </div>

                {/* Step 1 */}
                <div className="border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">1</span>
                    <span className="font-semibold">Host this single file on HTTPS (free, 2 minutes)</span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed pl-8">
                    Upload the one HTML file to any of these free services — they'll give you a public HTTPS URL instantly:
                  </p>
                  <div className="mt-2 ml-8 text-xs grid grid-cols-2 gap-2">
                    <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                      <strong className="text-white">netlify.com/drop</strong><br/>
                      <span className="text-white/60">Drag & drop the file. Done.</span>
                    </div>
                    <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                      <strong className="text-white">pages.github.com</strong><br/>
                      <span className="text-white/60">Upload, enable Pages. Done.</span>
                    </div>
                    <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                      <strong className="text-white">vercel.com</strong><br/>
                      <span className="text-white/60">Connect repo, deploy. Done.</span>
                    </div>
                    <div className="bg-black/40 rounded-lg p-2 border border-white/10">
                      <strong className="text-white">tiiny.host</strong><br/>
                      <span className="text-white/60">Upload single file. Instant URL.</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">2</span>
                    <span className="font-semibold">Create a Google Play Developer account</span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed pl-8">
                    Go to <a href="https://play.google.com/console" target="_blank" className="text-emerald-400 underline">play.google.com/console</a> and pay the one-time <strong className="text-white">$25 registration fee</strong>. You'll need to verify your identity.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">3</span>
                    <span className="font-semibold">Convert PWA to Android APK using PWA Builder</span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed pl-8">
                    The easiest way: go to <a href="https://www.pwabuilder.com" target="_blank" className="text-emerald-400 underline">pwabuilder.com</a>, paste your HTTPS URL, and click "Package for stores". It will generate a signed Android APK (TWA) ready for Play Store.
                  </p>
                  <div className="mt-2 ml-8 text-xs bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-emerald-400">
                    pwabuilder.com → Enter URL → Download Android package → Sign → Upload to Play Console
                  </div>
                </div>

                {/* Step 4 */}
                <div className="border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">4</span>
                    <span className="font-semibold">OR use Bubblewrap (Google's official tool)</span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed pl-8">
                    For advanced control, use <strong className="text-white">@bubblewrap/cli</strong>:
                  </p>
                  <div className="mt-2 ml-8 bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-xs text-emerald-400 space-y-1">
                    <div>$ npm i -g @bubblewrap/cli</div>
                    <div>$ bubblewrap init --manifest=https://your-url.com/manifest.json</div>
                    <div>$ bubblewrap build</div>
                    <div className="text-white/50"># Produces app-release-signed.apk</div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">5</span>
                    <span className="font-semibold">Upload to Play Console</span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed pl-8">
                    In your Play Console, create a new app → Production → upload the APK/AAB → fill out store listing, content rating, privacy policy. Review takes 1–7 days.
                  </p>
                </div>

                {/* Instant install */}
                <div className="border-2 border-emerald-500/30 rounded-2xl p-5 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="text-emerald-400" size={18} />
                    <span className="font-semibold text-emerald-400">EASIEST: Install right now (no Play Store needed)</span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed pl-7">
                    On any Android phone, just open this page in Chrome and tap the <strong className="text-white">"INSTALL APP"</strong> button above. JARVIS will appear on your home screen as a real app — instant, free, no store required. On iOS, use Safari → Share → Add to Home Screen.
                  </p>
                </div>

                {/* Build APK option */}
                <div className="border-2 border-violet-500/30 rounded-2xl p-5 bg-violet-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-6 w-6 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold text-xs">★</span>
                    <span className="font-semibold text-violet-400">Build a real APK file (for Play Store or sharing)</span>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed pl-7">
                    If you want a proper Android APK file to install or publish to the Play Store:
                  </p>
                  <div className="mt-2 ml-7 bg-black/40 rounded-lg p-3 border border-white/10 font-mono text-xs text-violet-300 space-y-1">
                    <div className="text-white/50"># On your computer, run these commands:</div>
                    <div>npm run build</div>
                    <div>npx cap add android</div>
                    <div>npx cap sync android</div>
                    <div>npx cap open android</div>
                    <div className="text-white/50"># Then in Android Studio: Build → Build APK</div>
                  </div>
                  <p className="text-white/50 text-xs mt-2 ml-7">
                    See <strong className="text-white">QUICK-APK.md</strong> or <strong className="text-white">BUILD-APK.md</strong> in your project folder for complete instructions.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a 
                  href="https://www.pwabuilder.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition"
                >
                  OPEN PWA BUILDER →
                </a>
                <button 
                  onClick={() => setShowGuide(false)}
                  className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-available download + install buttons */}
      <div className="fixed bottom-6 right-6 z-[250] flex flex-col gap-2 items-end">
        <button 
          onClick={downloadCurrentApp}
          title="Save this app as a single HTML file to share or transfer"
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white border border-white/20 rounded-full text-sm font-semibold shadow-2xl hover:bg-zinc-800 active:scale-95 transition"
        >
          <Download size={15} /> DOWNLOAD FILE
        </button>
        {!isInstalled && (
          <button 
            onClick={handleInstall}
            className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-full font-semibold shadow-2xl hover:scale-105 active:scale-95 transition"
          >
            <Smartphone size={18} /> {isLocalFile ? 'MAKE INSTALLABLE' : 'INSTALL APP'}
          </button>
        )}
      </div>
    </>
  );
};

const toast = (msg: string) => {
  alert(msg);
};

export default InstallBanner;
