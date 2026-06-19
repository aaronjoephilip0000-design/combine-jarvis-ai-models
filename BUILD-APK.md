# 📱 Building JARVIS APK — Complete Guide

This guide will help you build a real Android APK file from your JARVIS web app.

---

## 🎯 QUICK START (5 minutes)

### Prerequisites

You need these installed on your computer:

1. **Node.js** (v18+) — [nodejs.org](https://nodejs.org)
2. **Android Studio** — [developer.android.com](https://developer.android.com/studio)
3. **Java JDK 17** — Comes with Android Studio

### Step 1: Build the web app
```bash
npm install
npm run build
```

### Step 2: Run the build script
**On Mac/Linux:**
```bash
chmod +x build-apk.sh
./build-apk.sh
```

**On Windows:**
```bash
build-apk.bat
```

Or manually:
```bash
npx cap add android
npx cap sync android
npx cap open android
```

### Step 3: Build the APK in Android Studio
1. Android Studio opens automatically
2. Wait for Gradle sync (first time: 2-5 minutes)
3. Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. Wait for build (2-3 minutes)
5. Click "locate" in the popup notification

**Your APK is ready!**
```
Location: android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 4: Install on your phone
1. Transfer `app-debug.apk` to your phone
2. On phone: Settings → Security → Enable "Install from Unknown Sources"
3. Tap the APK file → Install
4. JARVIS appears on your home screen as a native app!

---

## 🔐 BUILDING A SIGNED RELEASE APK (For Play Store)

The debug APK works fine for personal use. For Play Store or distribution, you need a signed release APK.

### Step 1: Generate a signing key (do this ONCE)

```bash
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias jarvis-key
```

Answer the questions (remember the password!). This creates `release-key.jks`.

**⚠️ IMPORTANT:** Back up this file! If you lose it, you can never update your app on Play Store.

### Step 2: Configure signing in Android

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../release-key.jks')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'jarvis-key'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Build the signed release APK

In Android Studio:
1. Menu: **Build → Generate Signed Bundle / APK**
2. Choose **APK**
3. Select your keystore file (`release-key.jks`)
4. Enter passwords
5. Choose **release** build variant
6. Click **Finish**

**Your signed APK:**
```
Location: android/app/release/app-release.apk
```

---

## 🚀 COMMAND-LINE BUILD (Advanced)

If you prefer command line over Android Studio:

```bash
# Build debug APK
cd android
./gradlew assembleDebug

# Build release APK (requires signing config)
./gradlew assembleRelease
```

APK locations:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📦 PUBLISHING TO GOOGLE PLAY STORE

### 1. Create Developer Account
- Go to [play.google.com/console](https://play.google.com/console)
- Pay $25 one-time fee
- Complete identity verification

### 2. Create App Listing
- Click "Create app"
- Fill in app details
- Upload screenshots (you can use phone screenshots of your app)

### 3. Upload APK
- Go to **Production** or **Testing → Internal testing**
- Upload your signed release APK
- Set pricing (Free)
- Set countries

### 4. Content Rating
- Complete the content rating questionnaire
- Select appropriate categories

### 5. Privacy Policy
- You need a privacy policy URL
- Use a free generator: [privacypolicies.com](https://privacypolicies.com)
- Or host a simple policy on GitHub Pages

### 6. Submit for Review
- Review takes 1-7 days typically
- Once approved, your app is live on Play Store!

---

## 🛠️ TROUBLESHOOTING

### "SDK location not found"
Create `android/local.properties`:
```
sdk.dir=/Users/YOUR_USER/Library/Android/sdk  # Mac
sdk.dir=C:\\Users\\YOUR_USER\\AppData\\Local\\Android\\Sdk  # Windows
sdk.dir=/home/YOUR_USER/Android/Sdk  # Linux
```

### Gradle sync fails
- Make sure Android Studio is updated
- File → Invalidate Caches → Invalidate and Restart
- Delete `android/.gradle` folder and retry

### Camera/Microphone not working
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

### App crashes on startup
- Check Android Studio Logcat for errors
- Make sure `dist/index.html` exists before running `npx cap sync`

---

## 📱 TESTING ON YOUR PHONE

### Method 1: USB Debug (Recommended for development)
1. Enable Developer Options on phone (tap Build Number 7 times)
2. Enable USB Debugging
3. Connect phone to computer via USB
4. In Android Studio, select your device and click Run ▶️
5. App installs and launches automatically

### Method 2: Install APK manually
1. Build APK (steps above)
2. Transfer to phone (WhatsApp, email, USB, Google Drive)
3. Tap APK file on phone
4. Allow installation from unknown sources
5. Install

---

## 🎨 CUSTOMIZING YOUR APK

### Change app name
Edit `capacitor.config.ts`:
```ts
appName: 'Your App Name'
```

### Change package ID
Edit `capacitor.config.ts`:
```ts
appId: 'com.yourname.jarvis'
```
Then delete `android/` folder and run `npx cap add android` again.

### Change app icon
Replace `android/app/src/main/res/mipmap-*/ic_launcher.png` with your icons.
Use [icon.kitchen](https://icon.kitchen) to generate all sizes.

### Change splash screen
Edit `android/app/src/main/res/values/styles.xml` or use Capacitor Splash Screen plugin.

---

## 📋 CHECKLIST FOR PLAY STORE

- [ ] Signed release APK built
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (at least 2, phone-sized)
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] Privacy policy URL
- [ ] Content rating completed
- [ ] Developer account created ($25)
- [ ] APK uploaded to Play Console
- [ ] Review submitted

---

## 💡 TIPS

- **Test thoroughly** on your phone before submitting to Play Store
- **Use internal testing** track first to test with a few users
- **Keep your keystore safe** — you need it for every update
- **Update regularly** — Play Store favors active apps
- **Respond to reviews** — improves your app's visibility

---

## 🆘 NEED HELP?

- Capacitor docs: [capacitorjs.com/docs](https://capacitorjs.com/docs)
- Android Studio: [developer.android.com](https://developer.android.com/studio)
- Play Console: [support.google.com/googleplay/android-developer](https://support.google.com/googleplay/android-developer)

---

**Your JARVIS is now a real Android app! 🎉**
