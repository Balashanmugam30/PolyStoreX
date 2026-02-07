/**
 * PolyStoreX 2.0 - Databases Module
 * Handles database status management and simulation
 */

const Databases = {
    // Database states
    state: {
        postgresql: { status: 'healthy', enabled: true },
        mongodb: { status: 'healthy', enabled: true },
        redis: { status: 'healthy', enabled: true },
        neo4j: { status: 'healthy', enabled: true }
    },

    /**
     * Initialize databases module
     */
    init() {
        // Load saved state
        const saved = Utils.storage.get('database_state');
        if (saved) {
            this.state = saved;
            this.restoreState();
        }

        // Start metric updates
        this.updateMetrics();
        setInterval(() => this.updateMetrics(), 10000);
    },

    /**
     * Restore state from storage
     */
    restoreState() {
        Object.keys(this.state).forEach(db => {
            const toggle = document.querySelector(`[data-db="${db}"] input[type="checkbox"]`);
            if (toggle) {
                toggle.checked = this.state[db].status !== 'healthy';
            }
            this.updateStatusBadge(db, this.state[db].status);
        });
    },

    /**
     * Toggle database status (simulate failure/recovery)
     */
    toggleStatus(db, failed) {
        const newStatus = failed ? 'down' : 'healthy';
        this.state[db].status = newStatus;

        // Save state
        Utils.storage.set('database_state', this.state);

        // Update UI
        this.updateStatusBadge(db, newStatus);

        // Log activity
        Auth.logActivity(
            failed ? 'error' : 'success',
            `${this.getDbName(db)} ${failed ? 'failure simulated' : 'recovered'}`
        );

        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('database-status-change', {
            detail: { database: db, status: newStatus }
        }));
    },

    /**
     * Update status badge UI
     */
    updateStatusBadge(db, status) {
        const dbKey = db.replace('postgresql', 'pg').replace('mongodb', 'mongo');
        const badge = document.getElementById(`${dbKey}-status`);

        if (!badge) return;

        const statusConfig = {
            healthy: { class: 'badge-success', dot: 'healthy', text: 'Healthy' },
            degraded: { class: 'badge-warning', dot: 'degraded', text: 'Degraded' },
            down: { class: 'badge-error', dot: 'down', text: 'Down' }
        };

        const config = statusConfig[status];
        badge.className = `badge ${config.class}`;
        badge.innerHTML = `
      <span class="status-dot ${config.dot}"></span>
      ${config.text}
    `;

        // Update card styling
        const card = document.querySelector(`[data-db="${db}"]`);
        if (card) {
            card.style.borderColor = status === 'down' ? 'var(--error)' :
                status === 'degraded' ? 'var(--warning)' : '';
        }
    },

    /**
     * Update database metrics
     */
    updateMetrics() {
        // PostgreSQL
        if (this.state.postgresql.status === 'healthy') {
            this.setMetric('pg-connections', Utils.random.int(20, 30));
            this.setMetric('pg-queries', Utils.formatNumber(Utils.random.int(1000, 1500)));
            this.setMetric('pg-latency', Utils.random.int(5, 15) + 'ms');
            this.setMetric('pg-sync', Utils.random.int(1, 5) + 'm ago');
        }

        // MongoDB
        if (this.state.mongodb.status === 'healthy') {
            this.setMetric('mongo-connections', Utils.random.int(15, 25));
            this.setMetric('mongo-queries', Utils.random.int(700, 1000));
            this.setMetric('mongo-latency', Utils.random.int(8, 20) + 'ms');
            this.setMetric('mongo-sync', Utils.random.int(1, 3) + 'm ago');
        }

        // Redis
        if (this.state.redis.status === 'healthy') {
            this.setMetric('redis-connections', Utils.random.int(35, 50));
            this.setMetric('redis-queries', Utils.formatNumber(Utils.random.int(4000, 6000)));
            this.setMetric('redis-latency', Utils.random.float(0.5, 1.5, 1) + 'ms');
            this.setMetric('redis-hit', Utils.random.float(92, 98, 1) + '%');
        }

        // Neo4j
        if (this.state.neo4j.status === 'healthy') {
            this.setMetric('neo4j-connections', Utils.random.int(5, 12));
            this.setMetric('neo4j-queries', Utils.random.int(180, 300));
            this.setMetric('neo4j-latency', Utils.random.int(12, 25) + 'ms');
            this.setMetric('neo4j-nodes', Utils.formatNumber(Utils.random.int(1100000, 1300000)));
        }
    },

    /**
     * Set metric value in UI
     */
    setMetric(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    },

    /**
     * Get display name for database
     */
    getDbName(db) {
        const names = {
            postgresql: 'PostgreSQL',
            mongodb: 'MongoDB',
            redis: 'Redis',
            neo4j: 'Neo4j'
        };
        return names[db] || db;
    },

    /**
     * Get current state of all databases
     */
    getState() {
        return this.state;
    },

    /**
     * Check if database is healthy
     */
    isHealthy(db) {
        return this.state[db]?.status === 'healthy';
    },

    /**
     * Get count of healthy databases
     */
    getHealthyCount() {
        return Object.values(this.state).filter(s => s.status === 'healthy').length;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Databases.init();
});

// Make Databases available globally
window.Databases = Databases;
