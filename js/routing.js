/**
 * PolyStoreX 2.0 - Routing Module
 * Handles data routing visualization and simulation
 */

const Routing = {
    // Node information for details panel
    nodeInfo: {
        orchestrator: {
            title: 'PolyStore Orchestrator',
            description: 'Central routing engine that analyzes incoming requests and routes them to the optimal database based on data characteristics and policies.',
            details: [
                { label: 'Role', value: 'Request Router' },
                { label: 'Decisions/min', value: '2,450' },
                { label: 'Avg Decision Time', value: '0.3ms' },
                { label: 'Policy Engine', value: 'Active' }
            ],
            explanation: 'The orchestrator evaluates each request against defined routing rules, considering data type, ACID requirements, read/write patterns, and relationship complexity.'
        },
        postgresql: {
            title: 'PostgreSQL',
            description: 'Primary relational database for transactional data requiring ACID compliance and complex queries.',
            details: [
                { label: 'Use Case', value: 'Transactions' },
                { label: 'Data Characteristics', value: 'Structured' },
                { label: 'Query Type', value: 'SQL / Joins' },
                { label: 'Consistency', value: 'Strong' }
            ],
            explanation: 'Routes to PostgreSQL when: data requires ACID guarantees, complex joins are needed, or financial/critical transactions are involved.',
            rules: [
                'Financial transactions → Always',
                'Complex reporting → Preferred',
                'Multi-table joins → Required'
            ]
        },
        mongodb: {
            title: 'MongoDB',
            description: 'Document database for flexible schemas and hierarchical data structures.',
            details: [
                { label: 'Use Case', value: 'Documents' },
                { label: 'Data Characteristics', value: 'Semi-structured' },
                { label: 'Query Type', value: 'Document / Aggregation' },
                { label: 'Consistency', value: 'Eventual' }
            ],
            explanation: 'Routes to MongoDB when: schema flexibility is needed, data is hierarchical, or document-based queries are optimal.',
            rules: [
                'User profiles → Primary',
                'Content/articles → Preferred',
                'Nested objects → Required'
            ]
        },
        redis: {
            title: 'Redis',
            description: 'In-memory data store for caching, sessions, and real-time operations.',
            details: [
                { label: 'Use Case', value: 'Cache / Sessions' },
                { label: 'Data Characteristics', value: 'Key-Value' },
                { label: 'Query Type', value: 'Get / Set' },
                { label: 'Consistency', value: 'Immediate' }
            ],
            explanation: 'Routes to Redis when: sub-millisecond latency is required, data is temporary, or high read throughput is needed.',
            rules: [
                'Session data → Always',
                'API responses → Cache layer',
                'Rate limiting → Required'
            ]
        },
        neo4j: {
            title: 'Neo4j',
            description: 'Graph database for relationship-heavy data and network analysis.',
            details: [
                { label: 'Use Case', value: 'Relationships' },
                { label: 'Data Characteristics', value: 'Graph' },
                { label: 'Query Type', value: 'Cypher / Traversal' },
                { label: 'Consistency', value: 'Strong' }
            ],
            explanation: 'Routes to Neo4j when: data involves complex relationships, graph traversals are needed, or recommendation systems are involved.',
            rules: [
                'Social connections → Primary',
                'Recommendations → Required',
                'Fraud detection → Preferred'
            ]
        }
    },

    selectedNode: null,

    /**
     * Initialize routing module
     */
    init() {
        this.populateRoutingLog();
        this.selectNode('orchestrator');

        // Listen for database status changes
        window.addEventListener('database-status-change', (e) => {
            this.updateNodeStatus(e.detail.database, e.detail.status);
        });
    },

    /**
     * Select a node and show details
     */
    selectNode(nodeId) {
        // Update visual selection
        document.querySelectorAll('.routing-node').forEach(node => {
            node.classList.remove('active');
        });

        const nodeGroup = document.getElementById(`node-${nodeId}`);
        if (nodeGroup) {
            nodeGroup.querySelector('.routing-node').classList.add('active');
        }

        // Highlight path if not orchestrator
        document.querySelectorAll('.routing-path').forEach(path => {
            path.classList.remove('active');
        });

        if (nodeId !== 'orchestrator') {
            const pathId = `path-${nodeId.replace('postgresql', 'pg').replace('mongodb', 'mongo')}`;
            const path = document.getElementById(pathId);
            if (path) {
                path.classList.add('active');
            }
        }

        // Update details panel
        this.showNodeDetails(nodeId);
        this.selectedNode = nodeId;
    },

    /**
     * Show node details in panel
     */
    showNodeDetails(nodeId) {
        const info = this.nodeInfo[nodeId];
        if (!info) return;

        const panel = document.getElementById('routing-details');
        const title = document.getElementById('panel-title');

        title.textContent = info.title;

        let rulesHtml = '';
        if (info.rules) {
            rulesHtml = `
        <div class="mt-md">
          <h4 class="text-sm font-semibold mb-sm">Routing Rules</h4>
          <ul class="text-sm text-muted" style="padding-left: 1rem;">
            ${info.rules.map(r => `<li style="margin-bottom: 0.25rem;">${r}</li>`).join('')}
          </ul>
        </div>
      `;
        }

        panel.innerHTML = `
      <p class="text-sm text-muted mb-md">${info.description}</p>
      
      <div class="grid grid-2 gap-sm mb-md">
        ${info.details.map(d => `
          <div class="p-sm" style="background: var(--bg-tertiary); border-radius: var(--radius-md);">
            <div class="text-xs text-muted">${d.label}</div>
            <div class="text-sm font-medium">${d.value}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="p-md" style="background: var(--bg-tertiary); border-radius: var(--radius-md);">
        <h4 class="text-sm font-semibold mb-sm">Why Route Here?</h4>
        <p class="text-sm text-muted">${info.explanation}</p>
      </div>
      
      ${rulesHtml}
    `;
    },

    /**
     * Update node status indicator
     */
    updateNodeStatus(database, status) {
        const statusColors = {
            healthy: '#22c55e',
            degraded: '#f59e0b',
            down: '#ef4444'
        };

        const statusId = `status-${database.replace('postgresql', 'pg').replace('mongodb', 'mongo')}`;
        const statusCircle = document.getElementById(statusId);

        if (statusCircle) {
            statusCircle.setAttribute('fill', statusColors[status] || statusColors.healthy);
        }
    },

    /**
     * Simulate a routing request
     */
    simulateRequest() {
        const dataTypes = ['Financial Transaction', 'User Profile', 'Session Data', 'Relationship Query'];
        const targets = ['postgresql', 'mongodb', 'redis', 'neo4j'];

        const randomIndex = Utils.random.int(0, dataTypes.length - 1);
        const dataType = dataTypes[randomIndex];
        const target = targets[randomIndex];

        // Animate the routing
        this.animateRouting(target);

        // Add to log
        this.addRoutingLogEntry(dataType, target);
    },

    /**
     * Animate routing path
     */
    animateRouting(target) {
        // First highlight orchestrator
        this.selectNode('orchestrator');

        // Then animate to target
        setTimeout(() => {
            const pathId = `path-${target.replace('postgresql', 'pg').replace('mongodb', 'mongo')}`;
            const path = document.getElementById(pathId);

            if (path) {
                path.classList.add('active');
                path.style.strokeDasharray = '10,5';
                path.style.animation = 'dash 0.5s linear';

                setTimeout(() => {
                    path.style.strokeDasharray = '';
                    path.style.animation = '';
                    this.selectNode(target);
                }, 500);
            }
        }, 300);
    },

    /**
     * Add entry to routing log
     */
    addRoutingLogEntry(dataType, target) {
        const log = document.getElementById('routing-log');
        if (!log) return;

        const targetNames = {
            postgresql: 'PostgreSQL',
            mongodb: 'MongoDB',
            redis: 'Redis',
            neo4j: 'Neo4j'
        };

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
      <span class="log-time">${Utils.formatTime(new Date())}</span>
      <span class="log-level info">ROUTE</span>
      <span class="log-message">${dataType} → ${targetNames[target]}</span>
    `;

        log.insertBefore(entry, log.firstChild);

        // Keep only last 20 entries
        while (log.children.length > 20) {
            log.removeChild(log.lastChild);
        }
    },

    /**
     * Populate initial routing log
     */
    populateRoutingLog() {
        const log = document.getElementById('routing-log');
        if (!log) return;

        const entries = [
            { type: 'Financial Transaction', target: 'PostgreSQL', level: 'info' },
            { type: 'User Session', target: 'Redis', level: 'info' },
            { type: 'Profile Update', target: 'MongoDB', level: 'info' },
            { type: 'Friend Request', target: 'Neo4j', level: 'info' },
            { type: 'Payment Record', target: 'PostgreSQL', level: 'success' },
            { type: 'Cache Miss', target: 'Redis', level: 'warning' },
            { type: 'Document Query', target: 'MongoDB', level: 'info' }
        ];

        const now = Date.now();

        log.innerHTML = entries.map((e, i) => `
      <div class="log-entry">
        <span class="log-time">${Utils.formatTime(new Date(now - i * 30000))}</span>
        <span class="log-level ${e.level}">ROUTE</span>
        <span class="log-message">${e.type} → ${e.target}</span>
      </div>
    `).join('');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Routing.init();
});

// Make Routing available globally
window.Routing = Routing;
