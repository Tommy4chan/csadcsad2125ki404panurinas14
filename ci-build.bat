@echo off
setlocal

:: Define directories
set CLIENT_DIR=client-rock-paper-scissors
set SERVER_DIR=server-rock-paper-scissors

:: Run Jest tests
echo Running tests for %CLIENT_DIR%...
cd %CLIENT_DIR%
set CI=true
cmd /C "npm run test"

:: Build Vite project
echo Building Vite project for %CLIENT_DIR%...
cmd /C "npm run build"
cd ..

:: Copy build artifacts
set CLIENT_BUILD_DIR=dist
set CLIENT_ARTIFACT_DIR=artifacts\client-build
echo Saving client build artifacts to %CLIENT_ARTIFACT_DIR%...
mkdir %CLIENT_ARTIFACT_DIR%
xcopy %CLIENT_DIR%\%CLIENT_BUILD_DIR% %CLIENT_ARTIFACT_DIR% /E /I /Y

:: Build and upload PlatformIO project
echo Build and upload PlatformIO project...
cd %SERVER_DIR%
cmd /C "pio run --target=upload"
cd ..

:: Copy PlatformIO build artifacts
set SERVER_BUILD_DIR=.pio\build
set SERVER_ARTIFACT_DIR=artifacts\server-build
echo Saving server build artifacts to %SERVER_ARTIFACT_DIR%...
mkdir %SERVER_ARTIFACT_DIR%
xcopy %SERVER_DIR%\%SERVER_BUILD_DIR% %SERVER_ARTIFACT_DIR% /E /I /Y

echo Build process completed successfully!
endlocal