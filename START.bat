

@echo off
cd /d "%~dp0"

if not exist package.json ren Package.json package.json
if not exist app.json ren App.json app.json

echo Installing web dependencies...
call npx.cmd expo install react-native-web react-dom

echo Starting Moonii for web...
call npx.cmd expo start --web

pause
