@echo off
title J.A.R.V.I.S OS Launcher
echo ==============================================
echo       STARTING STARK INDUSTRIES OS
echo ==============================================
echo.
echo [1] Starting Python Bridge...
start cmd /k "cd stark-bridge && title Stark Local Bridge && py server.py"

echo [2] Starting UI and Desktop App...
npm run electron:dev
