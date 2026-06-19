@echo off
REM JARVIS APK Builder Script for Windows

echo 🚀 JARVIS APK Builder
echo ====================
echo.

REM Check if web build exists
if not exist "dist\index.html" (
    echo ❌ Error: dist\index.html not found
    echo Run 'npm run build' first
    pause
    exit /b 1
)

echo ✅ Web build found
echo.

REM Check if Capacitor is installed
if not exist "node_modules\@capacitor\core" (
    echo 📦 Installing Capacitor...
    call npm install @capacitor/core @capacitor/cli @capacitor/android
)

echo 📱 Initializing Android project...
echo.

REM Add Android platform if not exists
if not exist "android" (
    echo Adding Android platform...
    call npx cap add android
) else (
    echo ✅ Android platform already exists
)

echo.
echo 🔄 Syncing web assets to Android...
call npx cap sync android

echo.
echo ✅ Setup complete!
echo.
echo 📋 NEXT STEPS:
echo 1. Open Android Studio:
echo    npx cap open android
echo.
echo 2. In Android Studio:
echo    - Wait for Gradle sync to complete
echo    - Build → Build Bundle^(s^) / APK^(s^) → Build APK^(s^)
echo    - APK will be in: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 3. Install on your phone:
echo    - Transfer app-debug.apk to your phone
echo    - Enable 'Install from Unknown Sources' in Settings
echo    - Tap the APK file to install
echo.
echo 🔐 For signed release APK (for Play Store):
echo    See BUILD-APK.md for signing instructions
echo.
pause
