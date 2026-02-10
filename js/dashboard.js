/**
 * PolyStoreX 2.0 - Dashboard Logic
 * Handles dashboard metrics, charts, and activity log
 */

const Dashboard = {
    refreshInterval: null,

    /**
     * Initialize dashboard
     */
    init() {
        this.loadMetrics();
        this.renderTrafficChart();
        this.renderDistribution();
        this.loadActivityLog();

        // Auto-refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadMetrics();
        }, 30000);
    },

    /**
     * Refresh dashboard data
     */
    refresh() {
        this.loadMetrics();
        this.renderTrafficChart();
        this.renderDistribution();
        this.loadActivityLog();
    },

    /**
     * Load and display metrics
     */
    loadMetrics() {
        const metrics = Utils.generateMetrics();

        this.setMetric('metric-health', metrics.healthScore + '%');
        this.setMetric('metric-databases', '4/4');
        this.setMetric('metric-rps', Utils.formatNumber(metrics.requestsPerSecond));
        this.setMetric('metric-errors', metrics.errorRate.toFixed(2) + '%');
    },

    /**
     * Set metric value safely
     */
    setMetric(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    },

    /**
     * Render traffic chart
     */
    renderTrafficChart() {
        const chartContainer = document.getElementById('traffic-chart');
        if (!chartContainer) return;

        const data = Utils.generateChartData(12, 40, 100);
        const max = Math.max(...data);

        chartContainer.innerHTML = '';
        chartContainer.style.display = 'flex';
        chartContainer.style.alignItems = 'flex-end';
        chartContainer.style.gap = '8px';
        chartContainer.style.padding = '1rem 0';

        data.forEach((value, index) => {
            const height = (value / max) * 100;
            const bar = document.createElement('div');
            bar.style.flex = '1';
            bar.style.height = height + '%';
            bar.style.minHeight = '4px';
            bar.style.borderRadius = '4px 4px 0 0';
            bar.style.transition = 'height 0.3s ease';

            const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'];
            bar.style.backgroundColor = colors[index % colors.length];
            bar.style.opacity = '0.8';

            bar.title = `${value} req/s`;
            chartContainer.appendChild(bar);
        });
    },

    /**
     * Render request distribution
     */
    renderDistribution() {
        const container = document.getElementById('distribution');
        if (!container) return;

        const distribution = [
            { name: 'PostgreSQL', percent: 42, class: 'postgres' },
            { name: 'MongoDB', percent: 28, class: 'mongodb' },
            { name: 'Redis', percent: 22, class: 'redis' },
            { name: 'Neo4j', percent: 8, class: 'neo4j' }
        ];

        container.innerHTML = distribution.map(item => `
            <div class="distribution-item">
                <div class="distribution-bar">
                    <div class="distribution-fill ${item.class}" style="width: ${item.percent}%;"></div>
                </div>
                <div class="distribution-label">
                    <span>${item.name}</span>
                    <span class="distribution-value">${item.percent}%</span>
                </div>
            </div>
        `).join('');
    },

    /**
     * Load activity log
     */
    loadActivityLog() {
        const container = document.getElementById('activity-log');
        if (!container) return;

        const activities = Utils.generateActivityLog(8);

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${this.getActivityIconClass(activity.type)}">
                    ${this.getActivityIcon(activity.type)}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.message}</div>
                    <div class="activity-meta">${Utils.formatRelativeTime(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Get activity icon class
     */
    getActivityIconClass(type) {
        const classes = {
            route: 'metric-icon blue',
            sync: 'metric-icon green',
            error: 'metric-icon red',
            success: 'metric-icon green'
        };
        return classes[type] || 'metric-icon blue';
    },

    /**
     * Get activity icon SVG
     */
    getActivityIcon(type) {
        const icons = {
            route: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="6" cy="6" r="3"/>
                <circle cx="6" cy="18" r="3"/>
                <path d="M6 9v6"/>
                <path d="M9 18h6c3 0 6-2 6-6s-3-6-6-6h-3"/>
            </svg>`,
            sync: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>`,
            error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>`,
            success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>`
        };
        return icons[type] || icons.route;
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
    Dashboard.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    Dashboard.destroy();
});

// Make Dashboard available globally
window.Dashboard = Dashboard;


const API_BASE = "https://polystorex.onrender.com";

async function sendDataToBackend() {
    const input = document.getElementById("jsonInput");
    const output = document.getElementById("output");

    if (!input || !output) return;

    output.textContent = "Sending request to PolyStoreX backend...";

    let payload;
    try {
        payload = JSON.parse(input.value);
    } catch (e) {
        output.textContent = "❌ Invalid JSON format";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/ingest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        output.innerHTML = formatOutput(data);
    } catch (err) {
        output.textContent = "❌ Backend not reachable (check port 5000)";
    }
}

async function loadDemoData() {
    const output = document.getElementById("output");
    output.textContent = "Loading demo data...";

    try {
        const res = await fetch(`${API_BASE}/api/demo`, { method: "POST" });
        const data = await res.json();
        output.textContent = JSON.stringify(data, null, 2);
    } catch {
        output.textContent = "❌ Failed to load demo data";
    }
}

async function viewStorage() {
    const output = document.getElementById("output");
    output.textContent = "Fetching storage...";

    try {
        const res = await fetch(`${API_BASE}/api/storage`);
        const data = await res.json();
        output.textContent = JSON.stringify(data, null, 2);
    } catch {
        output.textContent = "❌ Failed to fetch storage";
    }
}

/* expose to HTML */
window.sendDataToBackend = sendDataToBackend;
window.loadDemoData = loadDemoData;
window.viewStorage = viewStorage;

function formatOutput(data) {
    if (!data || !data.routedToDisplay) {
        return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    const colorMap = {
        PostgreSQL: '#3b82f6',
        MongoDB: '#22c55e',
        Redis: '#f59e0b',
        Neo4j: '#8b5cf6'
    };

    const color = colorMap[data.routedToDisplay] || '#e5e7eb';

    return `
        <div>
            <strong>Status:</strong>
            <span style="color:#22c55e; font-weight:600">SUCCESS</span><br><br>

            <strong>Routed To:</strong>
            <span style="color:${color}; font-weight:600">
                ${data.routedToDisplay}
            </span><br>

            <strong>Reason:</strong> ${data.reason}<br>
            <strong>Type:</strong> ${data.dataType}<br>
            <strong>Response Time:</strong>
            <span style="color:#22c55e; font-weight:600">
             ${data.responseTimeMs} ms
            </span><br><br>


            <strong>Record:</strong>
            <pre>${JSON.stringify(data.record, null, 2)}</pre>
        </div>
    `;
}
