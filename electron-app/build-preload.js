const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['preload.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/preload.js',
  external: ['electron'],
  minify: true,
  sourcemap: false,
  loader: {
    '.ts': 'ts',  // ✅ TypeScript 지원 추가
  },
  resolveExtensions: ['.ts', '.js'],  // ✅ .ts 확장자 자동 해석
}).then(() => {
  console.log('✅ preload.js bundled successfully with TypeScript support');
}).catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
