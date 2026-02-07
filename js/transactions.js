/**
 * PolyStoreX 2.0 - Transactions Module
 * Handles cross-database transaction simulation and visualization
 */

const Transactions = {
    isRunning: false,
    currentStep: 0,
    totalSteps: 7,

    /**
     * Initialize transactions module
     */
    init() {
        this.reset();
    },

    /**
     * Run a simulated transaction
     */
    async runTransaction() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.currentStep = 0;

        const failStep = parseInt(document.getElementById('fail-step').value);
        const txId = 'tx_' + Utils.random.uuid().substring(0, 12);

        // Update UI state
        document.getElementById('run-btn').disabled = true;
        this.updateStatus('running', 'Running');
        this.clearLogs();
        this.reset();

        this.log('info', `Starting transaction ${txId}`);
        this.log('info', 'Transaction type: Cross-Database Write (SAGA)');

        const startTime = Date.now();
        let success = true;

        // Execute steps
        for (let step = 1; step <= this.totalSteps; step++) {
            this.currentStep = step;

            // Check for simulated failure
            if (step === failStep) {
                await this.executeStep(step, 'error');
                this.log('error', `Step ${step} failed: Database connection timeout`);
                success = false;

                // Start rollback
                this.log('warning', 'Initiating compensating transactions...');
                await this.rollback(step - 1);
                break;
            }

            await this.executeStep(step, 'success');
        }

        const duration = Date.now() - startTime;

        if (success) {
            this.updateStatus('success', 'Committed');
            this.log('success', `Transaction ${txId} committed successfully`);
            this.log('info', `Total duration: ${duration}ms`);
            this.addToHistory(txId, 'Cross-DB Write', duration, 'committed');
        } else {
            this.updateStatus('error', 'Rolled Back');
            this.log('error', `Transaction ${txId} rolled back`);
            this.addToHistory(txId, 'Cross-DB Write', null, 'rolledback');
        }

        document.getElementById('run-btn').disabled = false;
        this.isRunning = false;
    },

    /**
     * Execute a single step
     */
    async executeStep(step, status) {
        const stepEl = document.querySelector(`[data-step="${step}"]`);
        if (!stepEl) return;

        // Mark as active
        stepEl.classList.add('active');
        stepEl.classList.remove('success', 'error');

        const stepName = this.getStepName(step);
        this.log('info', `Executing: ${stepName}...`);

        // Simulate processing time
        await this.sleep(Utils.random.int(300, 800));

        // Mark result
        stepEl.classList.remove('active');
        stepEl.classList.add(status);

        if (status === 'success') {
            this.log('success', `✓ ${stepName} completed`);
        }
    },

    /**
     * Rollback completed steps
     */
    async rollback(fromStep) {
        for (let step = fromStep; step >= 1; step--) {
            const stepEl = document.querySelector(`[data-step="${step}"]`);
            if (!stepEl) continue;

            const stepName = this.getStepName(step);
            this.log('warning', `Rolling back: ${stepName}...`);

            await this.sleep(Utils.random.int(200, 400));

            stepEl.classList.remove('success');
            stepEl.classList.add('error');

            this.log('warning', `↩ ${stepName} rolled back`);
        }
    },

    /**
     * Reset transaction state
     */
    reset() {
        this.currentStep = 0;
        this.isRunning = false;

        // Reset all steps
        document.querySelectorAll('.transaction-step').forEach(step => {
            step.classList.remove('active', 'success', 'error');
        });

        this.updateStatus('ready', 'Ready');
        document.getElementById('run-btn').disabled = false;
    },

    /**
     * Update transaction status badge
     */
    updateStatus(type, text) {
        const badge = document.getElementById('tx-status');
        if (!badge) return;

        const classes = {
            ready: 'badge-neutral',
            running: 'badge-info',
            success: 'badge-success',
            error: 'badge-error'
        };

        badge.className = `badge ${classes[type] || 'badge-neutral'}`;
        badge.textContent = text;
    },

    /**
     * Get step name
     */
    getStepName(step) {
        const names = {
            1: 'Validate Request',
            2: 'Begin Transaction',
            3: 'PostgreSQL Write',
            4: 'MongoDB Update',
            5: 'Redis Cache Invalidation',
            6: 'Neo4j Graph Update',
            7: 'Commit Transaction'
        };
        return names[step] || `Step ${step}`;
    },

    /**
     * Log a message
     */
    log(level, message) {
        const log = document.getElementById('transaction-log');
        if (!log) return;

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
      <span class="log-time">${Utils.formatTime(new Date())}</span>
      <span class="log-level ${level}">${level.toUpperCase()}</span>
      <span class="log-message">${message}</span>
    `;

        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    },

    /**
     * Clear logs
     */
    clearLogs() {
        const log = document.getElementById('transaction-log');
        if (log) {
            log.innerHTML = '';
        }
    },

    /**
     * Add transaction to history
     */
    addToHistory(txId, type, duration, status) {
        const table = document.getElementById('history-table');
        if (!table) return;

        const row = document.createElement('tr');
        row.innerHTML = `
      <td class="font-mono text-xs">${txId}</td>
      <td>${type}</td>
      <td>
        <span class="badge badge-info">PG</span>
        <span class="badge badge-info">Mongo</span>
        <span class="badge badge-info">Redis</span>
        <span class="badge badge-info">Neo4j</span>
      </td>
      <td>${duration ? duration + 'ms' : '--'}</td>
      <td><span class="badge ${status === 'committed' ? 'badge-success' : 'badge-error'}">${status === 'committed' ? 'Committed' : 'Rolled Back'}</span></td>
      <td class="text-muted">Just now</td>
    `;

        table.insertBefore(row, table.firstChild);

        // Keep only last 10 entries
        while (table.children.length > 10) {
            table.removeChild(table.lastChild);
        }
    },

    /**
     * Sleep helper
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Transactions.init();
});

// Make Transactions available globally
window.Transactions = Transactions;
