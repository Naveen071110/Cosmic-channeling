// Environment configuration for deployment optimization
export const environmentConfig = {
  // Production environment settings for minimal resource usage
  production: {
    NODE_ENV: 'production',
    
    // Resource limits
    MAX_CONCURRENT_REQUESTS: '15',
    IDLE_TIMEOUT_SECONDS: '120',
    CONNECTION_TIMEOUT: '30000',
    
    // Memory optimization (handled by production-start.js since NODE_OPTIONS must be set at process startup)
    
    // Compression and performance
    ENABLE_COMPRESSION: 'true',
    ENABLE_KEEP_ALIVE: 'true',
    COMPRESSION_LEVEL: '6',
    
    // Database optimization
    DATABASE_POOL_SIZE: '5',
    DATABASE_IDLE_TIMEOUT: '10000',
    DATABASE_CONNECTION_TIMEOUT: '5000',
    
    // Session optimization
    SESSION_MEMORY_STORE: 'true',
    SESSION_CHECK_PERIOD: '900000', // 15 minutes
    
    // Monitoring and alerts
    COMPUTE_BUDGET_ALERT_THRESHOLD: '80',
    ENABLE_RESOURCE_MONITORING: 'true',
    LOG_LEVEL: 'warn', // Reduce logging overhead
    
    // Autoscale hints for Replit
    REPLIT_SCALE_TO_ZERO: 'true',
    REPLIT_MIN_REPLICAS: '0',
    REPLIT_MAX_REPLICAS: '2',
    REPLIT_TARGET_CONCURRENCY: '15'
  },

  // Development environment (current settings)
  development: {
    NODE_ENV: 'development',
    LOG_LEVEL: 'info',
    ENABLE_RESOURCE_MONITORING: 'false'
  }
};

export function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development';
  return environmentConfig[env] || environmentConfig.development;
}

export function applyEnvironmentConfig() {
  const config = getEnvironmentConfig();
  
  // Apply configuration to process.env if not already set
  Object.entries(config).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
  
  console.log(`🔧 Environment configured for: ${process.env.NODE_ENV}`);
}

export default environmentConfig;