@echo off
setlocal
cd /d "%~dp0"

rem Optional machine-local runtime configuration. Ignored by Git.
if exist "start.local.cmd" call "start.local.cmd"

set "PNPM_MODE=path"
if defined BLACKJACK_PNPM_JS (
  set "PNPM_MODE=js"
  if not defined BLACKJACK_NODE set "BLACKJACK_NODE=node"
)

if "%PNPM_MODE%"=="js" (
  if not exist "%BLACKJACK_PNPM_JS%" goto :missing_runtime
) else (
  where node >nul 2>nul
  if errorlevel 1 goto :missing_runtime
  where pnpm >nul 2>nul
  if errorlevel 1 goto :missing_runtime
)

rem If the game is already running, just open it instead of starting a second
rem dev server on an incremented port.
powershell.exe -NoProfile -Command "try { $res = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173/' -TimeoutSec 2; if ($res.StatusCode -eq 200 -and $res.Content -match 'BLACKJACK 21') { exit 0 } } catch {}; exit 1"
if not errorlevel 1 (
  echo.
  echo BLACKJACK 21 is already running.
  echo Opening http://127.0.0.1:5173/ in your browser...
  start "" "http://127.0.0.1:5173/"
  exit /b 0
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Installing dependencies...
  if "%PNPM_MODE%"=="js" (
    "%BLACKJACK_NODE%" "%BLACKJACK_PNPM_JS%" install
  ) else (
    call pnpm install
  )
  if errorlevel 1 goto :fail
)

echo.
echo Starting BLACKJACK 21...
echo Your browser will open automatically in a moment.
echo If it does not, open http://127.0.0.1:5173/ manually.
echo Press Ctrl+C to stop the server.
echo.

if "%PNPM_MODE%"=="js" (
  "%BLACKJACK_NODE%" "%BLACKJACK_PNPM_JS%" dev
) else (
  call pnpm dev
)
goto :eof

:missing_runtime
echo.
echo Node.js and pnpm are required to run this project.
echo Install Node.js 22+ from https://nodejs.org/
echo Install pnpm from https://pnpm.io/installation
echo.
pause
exit /b 1

:fail
echo.
echo Could not install dependencies or start the game.
echo Check that Node.js and pnpm are installed correctly, then try again.
echo.
pause
exit /b 1
