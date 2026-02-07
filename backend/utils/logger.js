/**
 * PolyStoreX - Logger Utility
 * Provides consistent, timestamped logging for demo visibility
 */

const Logger = {
    /**
     * Format timestamp for logs
     */
    getTimestamp() {
        return new Date().toISOString();
    },

    /**
     * Log info message
     */
    info(message, data = null) {
        const timestamp = this.getTimestamp();
        console.log(`[${timestamp}] ℹ️  INFO: ${message}`);
        if (data) {
            console.log(`    └─ Data:`, JSON.stringify(data, null, 2));
        }
    },

    /**
     * Log success message
     */
    success(message, data = null) {
        const timestamp = this.getTimestamp();
        console.log(`[${timestamp}] ✅ SUCCESS: ${message}`);
        if (data) {
            console.log(`    └─ Data:`, JSON.stringify(data, null, 2));
        }
    },

    /**
     * Log warning message
     */
    warn(message, data = null) {
        const timestamp = this.getTimestamp();
        console.log(`[${timestamp}] ⚠️  WARN: ${message}`);
        if (data) {
            console.log(`    └─ Data:`, JSON.stringify(data, null, 2));
        }
    },

    /**
     * Log error message
     */
    error(message, error = null) {
        const timestamp = this.getTimestamp();
        console.log(`[${timestamp}] ❌ ERROR: ${message}`);
        if (error) {
            console.log(`    └─ Error:`, error.message || error);
        }
    },

    /**
     * Log routing decision (main feature for demo)
     */
    route(dataType, database, reason) {
        const timestamp = this.getTimestamp();
        console.log(`[${timestamp}] 🔀 ROUTING DECISION:`);
        console.log(`    ├─ Data Type: ${dataType}`);
        console.log(`    ├─ Routed To: ${database}`);
        console.log(`    └─ Reason: ${reason}`);
    },

    /**
     * Log server startup
     */
    startup(port) {
        console.log('\n╔════════════════════════════════════════════════════════╗');
        console.log('║                                                          ║');
        console.log('║   🚀 PolyStoreX Backend Server                          ║');
        console.log('║   Intelligent Polyglot Persistence Orchestration        ║');
        console.log('║                                                          ║');
        console.log(`║   🌐 Running on: http://localhost:${port}                  ║`);
        console.log('║                                                          ║');
        console.log('║   📊 Simulated Databases:                               ║');
        console.log('║      • PostgreSQL (Transactions)                        ║');
        console.log('║      • MongoDB (Documents)                              ║');
        console.log('║      • Redis (Cache/Session)                            ║');
        console.log('║      • Neo4j (Graph)                                    ║');
        console.log('║                                                          ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');
    }
};

module.exports = Logger;
