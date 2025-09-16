#!/usr/bin/env node

// Production startup script with optimized Node.js flags
// This script applies memory and GC optimizations that must be set at process startup

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set production environment
process.env.NODE_ENV = 'production';

// Define optimized Node.js flags for production
const nodeFlags = [
  '--expose-gc',                    // Enable global.gc for manual garbage collection
  '--max-old-space-size=384',       // Limit heap size for minimal compute usage
  '--gc-interval=100',              // More frequent GC to keep memory low
  '--optimize-for-size'             // Optimize for smaller memory footprint
];

// Path to the built server
const serverPath = join(__dirname, '../dist/index.js');

console.log('🚀 Starting production server with optimizations...');
console.log(`📊 Node flags: ${nodeFlags.join(' ')}`);

// Spawn the optimized Node.js process
const child = spawn('node', [...nodeFlags, serverPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

// Forward process signals to child
['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach(signal => {
  process.on(signal, () => {
    console.log(`🛑 Received ${signal}, forwarding to server...`);
    child.kill(signal);
  });
});

// Handle child process exit
child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`💤 Server terminated by signal: ${signal}`);
  } else {
    console.log(`💤 Server exited with code: ${code}`);
  }
  process.exit(code || 0);
});

child.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});