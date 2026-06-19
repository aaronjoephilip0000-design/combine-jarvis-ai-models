# ⚡ QUICK APK BUILD (2 minutes)

## What you need:
✅ **Android Studio** — [download free](https://developer.android.com/studio)  
✅ **Node.js** — [download free](https://nodejs.org)  

## Run these commands:

```bash
# 1. Build the web app
npm run build

# 2. Set up Android project
npx cap add android

# 3. Sync files
npx cap sync android

# 4. Open Android Studio
npx cap open android
```

## In Android Studio:
1. Wait for Gradle sync to finish (bottom bar)
2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Click **locate** when it's done

**Your APK:** `android/app/build/outputs/apk/debug/app-debug.apk`

## Install on your phone:
1. Copy `app-debug.apk` to your phone
2. Tap it → Install (allow unknown sources if asked)
3. Done! JARVIS is now a native Android app

---

**📖 For Play Store publishing, signed APKs, and advanced options, see [`BUILD-APK.md`](BUILD-APK.md)**
