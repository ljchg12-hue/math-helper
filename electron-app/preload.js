// Preload 스크립트 - 보안 브리지
// Electron의 보안을 유지하면서 필요한 API만 노출

const { contextBridge } = require('electron');

// 안전한 API 노출
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron
});

console.log('Preload script loaded');
