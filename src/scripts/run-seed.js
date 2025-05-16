#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('Running database seed script...');

try {
  execSync('npx ts-node src/scripts/direct-seed.ts', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../../')
  });
  console.log('Database seed script completed successfully!');
} catch (error) {
  console.error('Error running database seed script:', error);
  process.exit(1);
} 