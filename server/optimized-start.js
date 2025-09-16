// DEPRECATED: This script is deprecated in favor of server/production-start.js
// The new script properly applies NODE_OPTIONS at process startup instead of runtime
// This approach of setting NODE_OPTIONS at runtime doesn't work because Node.js only
// reads these flags at process startup

// NOTE: The NODE_OPTIONS setting below does not work and has been moved to production-start.js

// Apply resource optimization before starting the server
function optimizeForDeployment() {
  // Memory optimization
  if (process.env.NODE_ENV === 'production') {
    // Set Node.js memory limits
    const maxMemoryMB = parseInt(process.env.MAX_MEMORY_MB || '384');
    
    // Enable garbage collection optimization
    if (global.gc) {
      // Run garbage collection every 30 seconds
      setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance to avoid overhead
          global.gc();
        }
      }, 30000);
    }
    
    // Monitor memory usage
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      
      if (heapUsedMB > maxMemoryMB * 0.9) {
        console.warn(`⚠️ High memory usage: ${heapUsedMB.toFixed(2)}MB`);
        if (global.gc) global.gc();
      }
    }, 60000); // Check every minute
    
    console.log(`🚀 Production mode: Memory limit ${maxMemoryMB}MB`);
  }
}

// Resource monitoring for compute unit optimization
function startResourceMonitoring() {
  if (process.env.ENABLE_RESOURCE_MONITORING === 'true') {
    const startTime = Date.now();
    let requestCount = 0;
    
    // Log resource stats periodically
    setInterval(() => {
      const uptime = (Date.now() - startTime) / 1000;
      const memUsage = process.memoryUsage();
      
      console.log(`📊 Stats: Uptime ${uptime.toFixed(0)}s, Requests ${requestCount}, Heap ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      requestCount = 0; // Reset counter
    }, 300000); // Every 5 minutes
    
    // Track request count
    process.on('request-handled', () => {
      requestCount++;
    });
  }
}

// Graceful shutdown for compute unit optimization
function setupGracefulShutdown() {
  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  
  signals.forEach(signal => {
    process.on(signal, () => {
      console.log(`🛑 Received ${signal}, initiating graceful shutdown...`);
      
      // Give time for active requests to complete
      setTimeout(() => {
        console.log('💤 Shutting down to save compute units');
        process.exit(0);
      }, 5000); // 5 second grace period
    });
  });
}

// Initialize optimizations
optimizeForDeployment();
startResourceMonitoring();
setupGracefulShutdown();

// Start the main server
console.log('🔧 Starting optimized server...');
import('./index.js').catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});