# J.A.R.V.I.S. — Personal AI Assistant

Your complete JARVIS app that works as:
- 📱 **Real Android APK** (native app)
- 🌐 **Progressive Web App** (installable from browser)
- 📄 **Single HTML file** (fully portable)

---

## 🎯 FASTEST PATH: BUILD THE APK (Android app)

Full instructions in [`BUILD-APK.md`](BUILD-APK.md)

```bash
# 1. Install dependencies
npm install

# 2. Build web app
npm run build

# 3. Run the APK builder (Mac/Linux)
chmod +x build-apk.sh && ./build-apk.sh

# OR on Windows:
build-apk.bat

# 4. Open Android Studio and build APK
npx cap open android
# Then: Build → Build APK
# Your APK: android/app/build/outputs/apk/debug/app-debug.apk
```

**Requirements:** Android Studio + Java JDK (both free)

See [`BUILD-APK.md`](BUILD-APK.md) for full instructions including:
- Signed release APK for Play Store
- Customizing icons and name
- Publishing to Google Play Store

---

## 📄 OR: Use as a Single HTML File

Your file: `dist/index.html` (~460 KB)

Just copy it to your phone (WhatsApp, email, USB) and tap to open.

---

## 🚀 3 WAYS TO USE IT ON YOUR PHONE

### Way 1 — Just open the file (works instantly)
1. Copy `dist/index.html` to your phone (WhatsApp, email, USB, Google Drive)
2. Tap it → Opens in Chrome
3. **Everything works:** face lock, voice, learning, self-heal
4. You can use it like this forever

### Way 2 — Install as a native app (recommended)
1. Upload `dist/index.html` to any free hosting service:
   - **netlify.com/drop** → Drag the file. Get URL in 5 seconds.
   - **tiiny.host** → Upload. Get URL instantly.
   - **pages.github.com** → Upload to a repo. Enable Pages.
2. Open the URL on your phone in Chrome
3. Tap the purple **"INSTALL APP"** button at the top
4. JARVIS installs on your home screen like a native app
5. Works offline, full screen, no browser bar

### Way 3 — Publish to Google Play Store
1. Host the file (Way 2)
2. Go to **pwabuilder.com** → paste your URL → Download Android APK
3. Go to **play.google.com/console** → $25 one-time → Upload APK
4. Your app is on the Play Store!

---

## ✨ What's Inside This Single File

✅ All JavaScript (React + all libraries) — inlined  
✅ All CSS (Tailwind) — inlined  
✅ App manifest — embedded as data URL  
✅ Service worker — embedded as blob URL  
✅ App icon — embedded as SVG data URL  
✅ Biometric owner lock (face + voice)  
✅ Continuous net learning  
✅ Self-healing system  
✅ Personal knowledge vault  
✅ Voice + text chat with JARVIS  
✅ 100% portable — no external dependencies  

---

## 📱 Install Experience

**Android Chrome:** Tap INSTALL APP → appears on home screen  
**iOS Safari:** Share → Add to Home Screen  
**Desktop:** Same install button works  
**From file:// (no host):** Fully functional, just can't install as native icon  

---

## 🔒 Security

- First launch requires face capture + voice recording
- Only the enrolled owner can ever access JARVIS
- All data stored locally on device
- Biometric lock is permanent (must reset to re-enroll)

---

## 🛠️ Developer Note

To rebuild from source:
```
npm install
npm run build
```
The output is `dist/index.html` — always a single portable file.
