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
}).then(() => {
  console.log('✅ preload.js bundled successfully with mathjs included');
}).catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
