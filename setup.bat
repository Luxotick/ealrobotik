@echo off
setlocal
echo Kurulum basliyor...
call npm install
if errorlevel 1 goto :err
echo.
echo Kurulum tamamlandi. Calistirmak icin: start.bat
goto :eof
:err
echo Kurulum hatasi. npm install ciktisini kontrol edin.
exit /b 1
