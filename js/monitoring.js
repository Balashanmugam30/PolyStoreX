/**
 * PolyStoreX 2.0 - Monitoring Module
 * Handles observability metrics and incident timeline
 */

const Monitoring = {
    refreshInterval: null,

    /**
     * Initialize monitoring module
     */
    init() {
        this.loadMetrics();
        this.renderCharts();
        this.loadIncidentTimeline();

        // Auto-refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadMetrics();
        }, 30000);

        // Listen for time range changes
        document.getElementById('time-range')?.addEventListener('change', () => {
            this.refresh();
        });
    },

    /**
     * Refresh all data
     */
    refresh() {
        this.loadMetrics();
        this.renderCharts();
        this.loadIncidentTimeline();
    },

    /**
     * Load and display metrics
     */
    loadMetrics() {
        const metrics = Utils.generateMetrics();

        // Update metric values
        this.setMetric('metric-latency', Utils.random.int(8, 20) + 'ms');
        this.setMetric('metric-cache', Utils.random.float(92, 98, 1) + '%');
        this.setMetric('metric-sync', '4/4');
        this.setMetric('metric-errors', Utils.random.float(0.05, 0.25, 2) + '%');
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
     * Render mini charts
     */
    renderCharts() {
        this.renderMiniChart('chart-latency', 5, 25, 'var(--accent-blue)');
        this.renderMiniChart('chart-cache', 88, 100, 'var(--success)');
        this.renderMiniChart('chart-errors', 0, 1, 'var(--error)');
    },

    /**
     * Render a mini bar chart
     */
    renderMiniChart(containerId, min, max, color) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const data = Utils.generateChartData(8, min, max);
        const maxVal = Math.max(...data);

        container.innerHTML = '';
        container.style.display = 'flex';
        container.style.alignItems = 'flex-end';
        container.style.gap = '3px';

        data.forEach((value, index) => {
            const height = (value / maxVal) * 100;
            const bar = document.createElement('div');
            bar.style.flex = '1';
            bar.style.height = height + '%';
            bar.style.backgroundColor = color;
            bar.style.opacity = 0.3 + (index / data.length) * 0.7;
            bar.style.borderRadius = '2px';
            bar.style.minHeight = '4px';
            container.appendChild(bar);
        });
    },

    /**
     * Load incident timeline
     */
    loadIncidentTimeline() {
        const timeline = document.getElementById('incident-timeline');
        if (!timeline) return;

        const incidents = Utils.generateIncidentTimeline(5);

        timeline.innerHTML = incidents.map(incident => `
      <div class="timeline-item ${incident.type}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-title">${incident.title}</span>
            <span class="timeline-time">${Utils.formatRelativeTime(incident.timestamp)}</span>
          </div>
          <div class="timeline-body">${incident.body}</div>
        </div>
      </div>
    `).join('');
    },

    /**
     * Update performance table
     */
    updatePerformanceTable() {
        const tbody = document.getElementById('perf-table');
        if (!tbody) return;

        const databases = [
            { name: 'PostgreSQL', status: 'healthy' },
            { name: 'MongoDB', status: 'healthy' },
            { name: 'Redis', status: 'healthy' },
            { name: 'Neo4j', status: 'healthy' }
        ];

        tbody.innerHTML = databases.map(db => {
            const latencyP50 = Utils.random.int(5, 20);
            const latencyP99 = latencyP50 * Utils.random.int(3, 6);
            const throughput = Utils.random.int(100, 2000);
            const errorRate = Utils.random.float(0, 0.1, 2);
            const connections = Utils.random.int(5, 50);
            const maxConn = connections * Utils.random.int(2, 5);

            return `
        <tr>
          <td class="flex items-center gap-sm">
            <span class="status-dot ${db.status}"></span>
            ${db.name}
          </td>
          <td><span class="badge badge-success">Healthy</span></td>
          <td>${latencyP50}ms</td>
          <td>${latencyP99}ms</td>
          <td>${Utils.formatNumber(throughput)} req/s</td>
          <td>${errorRate}%</td>
          <td>${connections}/${maxConn}</td>
        </tr>
      `;
        }).join('');
    },

    /**
     * Cleanup on page leave
     */
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Monitoring.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    Monitoring.destroy();
});

// Make Monitoring available globally
window.Monitoring = Monitoring;
