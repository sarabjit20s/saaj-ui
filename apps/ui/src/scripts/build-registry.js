#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const rootDir = path.join(__dirname, '..', '..');
const webAppDir = path.join(__dirname, '..', '..', '..', 'www');

console.log('🔨 Executing "shadcn build"...');

exec('shadcn build', { stdio: 'inherit', cwd: rootDir }, error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  try {
    console.log(`📄 Copying registry.json...`);
    fs.copyFileSync(
      path.join(rootDir, 'registry.json'),
      path.join(webAppDir, 'registry.json'),
    );

    console.log(`📦 Copying public/r directory to web app...`);
    fs.cpSync(
      path.join(rootDir, 'public', 'r'),
      path.join(webAppDir, 'public', 'r'),
      { recursive: true },
    );

    console.log('🧹 Cleaning up build artifacts...');
    fs.rmSync(path.join(rootDir, 'public', 'r'), { recursive: true });

    console.log('✅ Registry built successfully!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});
