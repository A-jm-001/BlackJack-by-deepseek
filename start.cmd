@echo off
setlocal
cd /d "%~dp0"

set "BUNDLED_NODE_DIR=%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin"
set "BUNDLED_NODE=%BUNDLED_NODE_DIR%\node.exe"
set "BUNDLED_PNPM=%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.mjs"

if exist "%BUNDLED_NODE%" (
  set "NODE_EXE=%BUNDLED_NODE%"
  set "PNPM_JS=%BUNDLED_PNPM%"
  set "PATH=%BUNDLED_NODE_DIR%;%PATH%"
) else (
  set "NODE_EXE=node"
  set "PNPM_JS="
)

rem If a BLACKJACK server is already running, just open it instead of
rem starting a second dev server on an incremented port.
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
  if defined PNPM_JS (
    "%NODE_EXE%" "%PNPM_JS%" install
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

if defined PNPM_JS (
  "%NODE_EXE%" "%PNPM_JS%" dev
) else (
  call pnpm dev
)
goto :eof

:fail
echo.
echo Could not install dependencies. Check Node.js/pnpm and try again.
pause
exit /b 1
