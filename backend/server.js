/**
 * PolyStoreX - Main Server
 * Hackathon-ready, fail-safe backend
 */

const express = require('express');
const cors = require('cors');
const Logger = require('./utils/logger');
const RouteEngine = require('./router/routeEngine');
const PolyglotStore = require('./storage/polyglotStore');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    Logger.info(`${req.method} ${req.path}`, req.method === 'POST' ? req.body : null);
    next();
});

// ============================================
// API ROUTES
// ============================================

/**
 * GET /
 * Health check endpoint
 */
app.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'PolyStoreX Backend',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        databases: {
            postgresql: 'simulated - active',
            mongodb: 'simulated - active',
            redis: 'simulated - active',
            neo4j: 'simulated - active'
        },
        endpoints: {
            health: 'GET /',
            ingest: 'POST /api/ingest',
            storage: 'GET /api/storage',
            clear: 'POST /api/clear'
        }
    });
});

/**
 * GET /api/health
 * Alternative health check
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

/**
 * POST /api/ingest
 * Main data ingestion endpoint
 * Analyzes data type and routes to appropriate database
 */
app.post('/api/ingest', (req, res) => {
    try {
        const startTime = Date.now();
        const data = req.body;

        // Validate input
        if (!data || Object.keys(data).length === 0) {
            Logger.warn('Empty request body received');
            return res.status(400).json({
                success: false,
                error: 'Request body is required',
                example: {
                    type: 'transaction',
                    payload: { amount: 100, currency: 'USD' }
                }
            });
        }

        // Route and store data
        const result = RouteEngine.routeAndStore(data);

        Logger.success(`Data ingested successfully → ${result.routedToDisplay}`);

        const responseTimeMs = Date.now() - startTime;
        result.responseTimeMs = responseTimeMs;

        res.json(result);


    } catch (error) {
        Logger.error('Ingestion failed', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * GET /api/storage
 * Returns current contents of all simulated databases
 */
app.get('/api/storage', (req, res) => {
    try {
        const storage = PolyglotStore.getAllStorage();

        Logger.info('Storage contents retrieved');

        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            storage: storage
        });

    } catch (error) {
        Logger.error('Failed to retrieve storage', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve storage'
        });
    }
});

/**
 * POST /api/clear
 * Clears all storage (for demo reset)
 */
app.post('/api/clear', (req, res) => {
    try {
        PolyglotStore.clearAll();

        res.json({
            success: true,
            message: 'All storage cleared',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        Logger.error('Failed to clear storage', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear storage'
        });
    }
});

/**
 * POST /api/demo
 * Load demo data for presentation
 */
app.post('/api/demo', (req, res) => {
    try {
        // Clear existing data
        PolyglotStore.clearAll();

        // Demo data samples
        const demoData = [
            { type: 'transaction', payload: { orderId: 'ORD-001', amount: 299.99, currency: 'USD', status: 'completed' } },
            { type: 'transaction', payload: { orderId: 'ORD-002', amount: 149.50, currency: 'USD', status: 'pending' } },
            { type: 'document', payload: { title: 'Product Catalog', category: 'Electronics', items: 1500 } },
            { type: 'document', payload: { title: 'User Profile', userId: 'USR-123', preferences: { theme: 'dark' } } },
            { type: 'cache', key: 'session_abc123', payload: { userId: 'USR-123', token: 'jwt_token_here', expires: '1h' } },
            { type: 'cache', key: 'rate_limit_api', payload: { requests: 95, limit: 100, window: '1m' } },
            { type: 'graph', payload: { labels: ['User'], properties: { name: 'Alice', id: 'USR-001' }, relationships: [{ type: 'FOLLOWS', target: 'USR-002' }] } },
            { type: 'graph', payload: { labels: ['User'], properties: { name: 'Bob', id: 'USR-002' }, relationships: [{ type: 'FOLLOWS', target: 'USR-001' }] } }
        ];

        // Ingest all demo data
        const results = demoData.map(data => RouteEngine.routeAndStore(data));

        Logger.success('Demo data loaded successfully');

        res.json({
            success: true,
            message: 'Demo data loaded',
            itemsLoaded: results.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        Logger.error('Failed to load demo data', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load demo data'
        });
    }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path,
        availableEndpoints: ['GET /', 'POST /api/ingest', 'GET /api/storage', 'POST /api/clear', 'POST /api/demo']
    });
});

// Global error handler
app.use((err, req, res, next) => {
    Logger.error('Unhandled error', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    Logger.startup(PORT);
});

module.exports = app;
