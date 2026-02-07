/**
 * PolyStoreX - Route Engine
 * Intelligent routing logic for polyglot persistence
 */

const Logger = require('../utils/logger');
const PolyglotStore = require('../storage/polyglotStore');

const RouteEngine = {
    /**
     * Routing rules - deterministic mapping
     */
    routingRules: {
        // PostgreSQL - Transactional & Relational
        postgresql: {
            types: ['transaction', 'transactional', 'relational', 'sql', 'financial', 'order', 'payment', 'account', 'user'],
            reason: 'ACID compliance required for transactional integrity'
        },
        // MongoDB - Documents & JSON
        mongodb: {
            types: ['document', 'json', 'content', 'article', 'post', 'profile', 'log', 'event', 'metadata'],
            reason: 'Flexible schema for unstructured document storage'
        },
        // Redis - Cache & Session
        redis: {
            types: ['cache', 'session', 'token', 'temp', 'temporary', 'fast', 'realtime', 'counter', 'rate'],
            reason: 'In-memory speed for cache and session data'
        },
        // Neo4j - Graph & Relationships
        neo4j: {
            types: ['graph', 'relationship', 'network', 'connection', 'social', 'recommendation', 'path', 'link', 'friend'],
            reason: 'Graph traversal for relationship-heavy queries'
        }
    },

    /**
     * Analyze data type and route to appropriate database
     */
    analyzeAndRoute(data) {
        const dataType = (data.type || 'unknown').toLowerCase().trim();

        // Find matching database
        let targetDb = 'postgresql'; // Default safe path
        let reason = 'Default routing - PostgreSQL provides safe transactional guarantees';

        for (const [database, config] of Object.entries(this.routingRules)) {
            if (config.types.some(type => dataType.includes(type) || type.includes(dataType))) {
                targetDb = database;
                reason = config.reason;
                break;
            }
        }

        // Log the routing decision
        Logger.route(dataType, targetDb.toUpperCase(), reason);

        return {
            database: targetDb,
            reason: reason,
            dataType: dataType
        };
    },

    /**
     * Route and store data
     */
    routeAndStore(data) {
        // Analyze and determine routing
        const routing = this.analyzeAndRoute(data);

        // Store in appropriate database
        let storedRecord;
        const payload = data.payload || data;

        switch (routing.database) {
            case 'postgresql':
                storedRecord = PolyglotStore.storeInPostgreSQL(payload);
                break;
            case 'mongodb':
                storedRecord = PolyglotStore.storeInMongoDB(payload);
                break;
            case 'redis':
                const key = data.key || payload.key || null;
                storedRecord = PolyglotStore.storeInRedis(key, payload);
                break;
            case 'neo4j':
                storedRecord = PolyglotStore.storeInNeo4j(payload);
                break;
            default:
                storedRecord = PolyglotStore.storeInPostgreSQL(payload);
        }

        return {
            success: true,
            routedTo: routing.database.charAt(0).toUpperCase() + routing.database.slice(1),
            routedToDisplay: this.getDatabaseDisplayName(routing.database),
            reason: routing.reason,
            dataType: routing.dataType,
            stored: true,
            record: storedRecord,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Get display name for database
     */
    getDatabaseDisplayName(db) {
        const names = {
            postgresql: 'PostgreSQL',
            mongodb: 'MongoDB',
            redis: 'Redis',
            neo4j: 'Neo4j'
        };
        return names[db] || db;
    }
};

module.exports = RouteEngine;
