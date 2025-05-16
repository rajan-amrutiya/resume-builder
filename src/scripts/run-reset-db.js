#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('Running database reset script...');

try {
  execSync('npx ts-node src/scripts/reset-db.ts', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../../')
  });
  console.log('Database reset script completed successfully!');
} catch (error) {
  console.error('Error running database reset script:', error);
  process.exit(1);
} 