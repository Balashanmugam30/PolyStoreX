/**
 * PolyStoreX 2.0 - Utility Functions
 * Shared utilities for data generation, formatting, and localStorage operations
 */

const Utils = {
  // =====================================================
  // Storage Operations
  // =====================================================
  
  storage: {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(`polystorex_${key}`);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error('Storage get error:', e);
        return defaultValue;
      }
    },
    
    set(key, value) {
      try {
        localStorage.setItem(`polystorex_${key}`, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('Storage set error:', e);
        return false;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(`polystorex_${key}`);
        return true;
      } catch (e) {
        console.error('Storage remove error:', e);
        return false;
      }
    },
    
    clear() {
      try {
        Object.keys(localStorage)
          .filter(key => key.startsWith('polystorex_'))
          .forEach(key => localStorage.removeItem(key));
        return true;
      } catch (e) {
        console.error('Storage clear error:', e);
        return false;
      }
    }
  },

  // =====================================================
  // Data Formatting
  // =====================================================
  
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },
  
  formatPercent(value, decimals = 1) {
    return value.toFixed(decimals) + '%';
  },
  
  formatLatency(ms) {
    if (ms < 1) {
      return (ms * 1000).toFixed(0) + 'μs';
    }
    if (ms < 1000) {
      return ms.toFixed(0) + 'ms';
    }
    return (ms / 1000).toFixed(2) + 's';
  },
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  },
  
  formatTime(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  },
  
  formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  },
  
  formatRelativeTime(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return this.formatDate(date);
  },

  // =====================================================
  // Random Data Generation
  // =====================================================
  
  random: {
    int(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    float(min, max, decimals = 2) {
      return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    },
    
    bool(probability = 0.5) {
      return Math.random() < probability;
    },
    
    pick(array) {
      return array[Math.floor(Math.random() * array.length)];
    },
    
    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  },

  // =====================================================
  // Simulated Data Generators
  // =====================================================
  
  generateMetrics() {
    return {
      healthScore: this.random.int(85, 99),
      activeDatabases: 4,
      requestsPerSecond: this.random.int(1200, 2500),
      errorRate: this.random.float(0.01, 0.5),
      latency: this.random.int(5, 45),
      cacheHitRatio: this.random.float(85, 98),
      syncStatus: this.random.pick(['synced', 'syncing', 'pending']),
      uptime: this.random.float(99.5, 99.99)
    };
  },
  
  generateDatabaseStatus() {
    const statuses = ['healthy', 'degraded', 'down'];
    const weights = [0.85, 0.12, 0.03];
    const rand = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulative += weights[i];
      if (rand < cumulative) {
        return statuses[i];
      }
    }
    return 'healthy';
  },
  
  generateActivityLog(count = 10) {
    const types = [
      { type: 'route', icon: 'route', messages: [
        'Routed transaction data to PostgreSQL',
        'Document stored in MongoDB',
        'Session cached in Redis',
        'Graph relationship created in Neo4j'
      ]},
      { type: 'sync', icon: 'sync', messages: [
        'Database sync completed',
        'Cross-database consistency check passed',
        'Replication lag resolved'
      ]},
      { type: 'error', icon: 'error', messages: [
        'Connection timeout to Redis',
        'Query execution failed',
        'Replication delay detected'
      ]},
      { type: 'success', icon: 'check', messages: [
        'Transaction committed successfully',
        'Batch processing completed',
        'Health check passed'
      ]}
    ];
    
    const activities = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
      const typeInfo = this.random.pick(types);
      activities.push({
        id: this.random.uuid(),
        type: typeInfo.type,
        icon: typeInfo.icon,
        message: this.random.pick(typeInfo.messages),
        timestamp: new Date(now - i * this.random.int(30000, 300000))
      });
    }
    
    return activities;
  },
  
  generateChartData(points = 12, min = 50, max = 100) {
    const data = [];
    let value = this.random.int(min, max);
    
    for (let i = 0; i < points; i++) {
      // Add some variance but keep it smooth
      const change = this.random.int(-10, 10);
      value = Math.max(min, Math.min(max, value + change));
      data.push(value);
    }
    
    return data;
  },
  
  generateIncidentTimeline(count = 5) {
    const incidents = [
      { type: 'error', title: 'Database Connection Failure', body: 'PostgreSQL primary node became unreachable' },
      { type: 'warning', title: 'High Latency Detected', body: 'MongoDB query latency exceeded threshold' },
      { type: 'success', title: 'Auto-Recovery Complete', body: 'Redis cluster successfully rebalanced' },
      { type: 'info', title: 'Traffic Rerouted', body: 'Requests redirected to backup instance' },
      { type: 'warning', title: 'Disk Usage Alert', body: 'Neo4j storage approaching 80% capacity' },
      { type: 'success', title: 'Failover Successful', body: 'Seamless switchover to replica node' },
      { type: 'error', title: 'Transaction Rollback', body: 'Cross-database transaction failed, changes reverted' }
    ];
    
    const timeline = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
      const incident = this.random.pick(incidents);
      timeline.push({
        ...incident,
        id: this.random.uuid(),
        timestamp: new Date(now - i * this.random.int(600000, 3600000))
      });
    }
    
    return timeline;
  },
  
  generateTransactionSteps() {
    return [
      { id: 1, title: 'Validate Request', description: 'Schema validation and authentication check', status: 'pending' },
      { id: 2, title: 'Begin Transaction', description: 'Initialize distributed transaction context', status: 'pending' },
      { id: 3, title: 'Execute PostgreSQL', description: 'Insert financial record with ACID guarantees', status: 'pending' },
      { id: 4, title: 'Update MongoDB', description: 'Store document metadata and references', status: 'pending' },
      { id: 5, title: 'Invalidate Cache', description: 'Clear related Redis cache entries', status: 'pending' },
      { id: 6, title: 'Update Graph', description: 'Create/update Neo4j relationship nodes', status: 'pending' },
      { id: 7, title: 'Commit Transaction', description: 'Finalize all database operations', status: 'pending' }
    ];
  },

  // =====================================================
  // DOM Utilities
  // =====================================================
  
  $(selector) {
    return document.querySelector(selector);
  },
  
  $$(selector) {
    return document.querySelectorAll(selector);
  },
  
  createElement(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
  },
  
  // =====================================================
  // Event Utilities
  // =====================================================
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Make Utils available globally
window.Utils = Utils;
