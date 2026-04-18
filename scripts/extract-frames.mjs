import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// ffmpeg-static ships a pre-built binary — no system install needed
const ffmpegPath = require('ffmpeg-static');

const input = join(root, 'avatar.mp4');
const output = join(root, 'public', 'avatar-frames', 'frame_%04d.webp');

console.log('Using ffmpeg:', ffmpegPath);
console.log('Input:', input);
console.log('Output:', output);
console.log('Extracting frames...');

execFileSync(ffmpegPath, [
  '-i', input,
  '-vf', 'fps=24,scale=320:-1',
  '-c:v', 'libwebp',
  '-quality', '85',
  output,
], { stdio: 'inherit' });

console.log('\nDone! Frames saved to public/avatar-frames/');
