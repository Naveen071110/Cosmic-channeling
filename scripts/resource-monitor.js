// Resource monitoring script for compute unit optimization
import process from 'process';
import os from 'os';

class ResourceMonitor {
  constructor() {
    this.budgetThreshold = parseFloat(process.env.COMPUTE_BUDGET_ALERT_THRESHOLD || '80');
    this.maxMemoryMB = 512; // Target memory limit
    this.maxCPUPercent = 70; // Target CPU utilization
    this.monitoringInterval = 30000; // 30 seconds
  }

  start() {
    console.log('🔍 Resource Monitor: Starting optimization monitoring...');
    
    setInterval(() => {
      this.checkMemoryUsage();
      this.checkCPUUsage();
      this.triggerGarbageCollection();
    }, this.monitoringInterval);

    // Monitor process events
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }

  checkMemoryUsage() {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    const rssUsedMB = memUsage.rss / 1024 / 1024;

    if (heapUsedMB > this.maxMemoryMB * 0.8) {
      console.warn(`⚠️  High memory usage: Heap ${heapUsedMB.toFixed(2)}MB / RSS ${rssUsedMB.toFixed(2)}MB`);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        console.log('🗑️  Forced garbage collection triggered');
      }
    }
  }

  checkCPUUsage() {
    const cpuUsage = process.cpuUsage();
    const totalCPU = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
    
    // Log CPU usage for monitoring
    if (totalCPU > 1) {
      console.log(`📊 CPU Usage: ${totalCPU.toFixed(2)}s`);
    }
  }

  triggerGarbageCollection() {
    if (global.gc && Math.random() < 0.1) { // 10% chance
      global.gc();
    }
  }

  gracefulShutdown() {
    console.log('🛑 Resource Monitor: Graceful shutdown initiated');
    process.exit(0);
  }

  static logResourceStats() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    console.log('📊 Resource Stats:', {
      heapMB: (memUsage.heapUsed / 1024 / 1024).toFixed(2),
      rssMB: (memUsage.rss / 1024 / 1024).toFixed(2),
      cpuUser: (cpuUsage.user / 1000).toFixed(2) + 'ms',
      cpuSystem: (cpuUsage.system / 1000).toFixed(2) + 'ms'
    });
  }
}

export default ResourceMonitor;