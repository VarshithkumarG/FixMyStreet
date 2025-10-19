const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting FixMyStreet Application...\n');

// Start backend server
console.log('📡 Starting Backend Server...');
const backend = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

backend.on('close', (code) => {
  console.log(`📡 Backend process exited with code ${code}`);
});

// Start frontend server (if you have a simple HTTP server)
console.log('🌐 Starting Frontend Server...');
const frontend = spawn('npx', ['http-server', '.', '-p', '8080', '-c-1'], {
  stdio: 'inherit',
  cwd: __dirname
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err);
  console.log('💡 Make sure you have http-server installed: npm install -g http-server');
});

frontend.on('close', (code) => {
  console.log(`🌐 Frontend process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

console.log('\n✅ Servers starting...');
console.log('📡 Backend: http://localhost:3000');
console.log('🌐 Frontend: http://localhost:8080');
console.log('📊 Health Check: http://localhost:3000/api/health');
console.log('\nPress Ctrl+C to stop both servers\n');
