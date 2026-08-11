@echo off
setlocal
if not exist node_modules (
  echo Once setup.bat calistirin.
  exit /b 1
)
call npm run dev
