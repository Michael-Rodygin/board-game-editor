@echo off
setlocal
where.exe node >nul 2>nul
if %errorlevel%==0 goto use_path_node
set "NODE_EXE=C:\Users\Michael Rodygin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" (
  echo Node.js was not found. Install Node.js or add it to PATH, then run this launcher again.
  pause
  exit /b 1
)
start "Hex Tile Workshop server" cmd.exe /k ""%NODE_EXE%" "%~dp0serve.mjs""
goto open_page

:use_path_node
start "Hex Tile Workshop server" cmd.exe /k node "%~dp0serve.mjs"

:open_page
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4177/"
endlocal
