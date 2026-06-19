#!/bin/bash

# JARVIS APK Builder Script
# This script automates the Android project setup

echo "🚀 JARVIS APK Builder"
echo "===================="
echo ""

# Check if web build exists
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: dist/index.html not found"
    echo "Run 'npm run build' first"
    exit 1
fi

echo "✅ Web build found"
echo ""

# Check if Capacitor is installed
if [ ! -d "node_modules/@capacitor/core" ]; then
    echo "📦 Installing Capacitor..."
    npm install @capacitor/core @capacitor/cli @capacitor/android
fi

echo "📱 Initializing Android project..."
echo ""

# Add Android platform if not exists
if [ ! -d "android" ]; then
    echo "Adding Android platform..."
    npx cap add android
else
    echo "✅ Android platform already exists"
fi

echo ""
echo "🔄 Syncing web assets to Android..."
npx cap sync android

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Open Android Studio:"
echo "   npx cap open android"
echo ""
echo "2. In Android Studio:"
echo "   - Wait for Gradle sync to complete"
echo "   - Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "   - APK will be in: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "3. Install on your phone:"
echo "   - Transfer app-debug.apk to your phone"
echo "   - Enable 'Install from Unknown Sources' in Settings"
echo "   - Tap the APK file to install"
echo ""
echo "🔐 For signed release APK (for Play Store):"
echo "   See BUILD-APK.md for signing instructions"
echo ""
