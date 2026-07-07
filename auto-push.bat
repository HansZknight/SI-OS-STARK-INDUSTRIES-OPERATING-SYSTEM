@echo off
echo [J.A.R.V.I.S] Syncing Stark Industries OS to the Cloud...

:: Add all changes
git add .

:: Commit with a dynamic timestamp
git commit -m "Update: %date% %time%"

:: Push to remote main branch (use -f to force replace if needed, but normally normal push is safer)
git push origin main

echo [J.A.R.V.I.S] Update complete. The system is now on the latest version.
pause
