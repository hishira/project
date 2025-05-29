// Simple test script to verify logger functionality
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Logger Functionality...\n');

// Test 1: Check if logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (fs.existsSync(logsDir)) {
  console.log('✅ Logs directory exists');
  
  // List log files
  const logFiles = fs.readdirSync(logsDir);
  console.log('📁 Log files found:');
  logFiles.forEach(file => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   - ${file} (${stats.size} bytes)`);
  });
} else {
  console.log('❌ Logs directory does not exist');
}

// Test 2: Check if logger service files exist
const loggerFiles = [
  'src/common/logger/logger.service.ts',
  'src/common/logger/logger.module.ts',
  'src/common/logger/logging.interceptor.ts',
  'src/common/logger/logger.decorators.ts',
  'src/common/logger/index.ts'
];

console.log('\n📄 Logger service files:');
loggerFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file}`);
  }
});

// Test 3: Check if services have logger integration
const servicesWithLogging = [
  'src/auth/auth.service.ts',
  'src/activities/activities.service.ts',
  'src/users/users.service.ts'
];

console.log('\n🔧 Services with logging integration:');
servicesWithLogging.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasLoggerImport = content.includes('LoggerService');
    const hasLoggerInjection = content.includes('private readonly logger: LoggerService');
    const hasLogCalls = content.includes('this.logger.log');
    
    console.log(`   📝 ${file}:`);
    console.log(`      - Logger import: ${hasLoggerImport ? '✅' : '❌'}`);
    console.log(`      - Logger injection: ${hasLoggerInjection ? '✅' : '❌'}`);
    console.log(`      - Log calls: ${hasLogCalls ? '✅' : '❌'}`);
  } else {
    console.log(`   ❌ ${file} not found`);
  }
});

console.log('\n🎯 Logger Integration Test Complete!');
