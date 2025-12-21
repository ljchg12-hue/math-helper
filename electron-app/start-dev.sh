#!/bin/bash

# Vite 서버 시작
NODE_ENV=development node node_modules/vite/bin/vite.js &
VITE_PID=$!

# Vite 서버 준비 대기
sleep 3

# Electron 앱 시작
NODE_ENV=development node node_modules/electron/cli.js . --no-sandbox &
ELECTRON_PID=$!

echo "Vite PID: $VITE_PID"
echo "Electron PID: $ELECTRON_PID"
echo "앱이 실행 중입니다. Ctrl+C로 종료하세요."

# 종료 신호 처리
trap "kill $VITE_PID $ELECTRON_PID 2>/dev/null; exit" INT TERM

# 프로세스 유지
wait
