/**
 * PolyStoreX - Polyglot Store
 * In-memory storage simulating PostgreSQL, MongoDB, Redis, Neo4j
 */

const Logger = require('../utils/logger');

const PolyglotStore = {
    // Simulated database storage
    databases: {
        postgresql: [],
        mongodb: [],
        redis: {},
        neo4j: []
    },

    // Counters for unique IDs
    counters: {
        postgresql: 1,
        mongodb: 1,
        neo4j: 1
    },

    /**
     * Store data in PostgreSQL (relational/transactional)
     */
    storeInPostgreSQL(data) {
        const record = {
            id: this.counters.postgresql++,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...data
        };
        this.databases.postgresql.push(record);
        Logger.success(`Stored in PostgreSQL with ID: ${record.id}`);
        return record;
    },

    /**
     * Store data in MongoDB (documents)
     */
    storeInMongoDB(data) {
        const document = {
            _id: `doc_${this.counters.mongodb++}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...data
        };
        this.databases.mongodb.push(document);
        Logger.success(`Stored in MongoDB with _id: ${document._id}`);
        return document;
    },

    /**
     * Store data in Redis (cache/session)
     */
    storeInRedis(key, data) {
        const cacheKey = key || `cache_${Date.now()}`;
        const entry = {
            value: data,
            storedAt: new Date().toISOString(),
            ttl: 3600 // 1 hour TTL (simulated)
        };
        this.databases.redis[cacheKey] = entry;
        Logger.success(`Stored in Redis with key: ${cacheKey}`);
        return { key: cacheKey, ...entry };
    },

    /**
     * Store data in Neo4j (graph)
     */
    storeInNeo4j(data) {
        const node = {
            nodeId: `node_${this.counters.neo4j++}`,
            labels: data.labels || ['Entity'],
            properties: data.properties || data,
            relationships: data.relationships || [],
            createdAt: new Date().toISOString()
        };
        this.databases.neo4j.push(node);
        Logger.success(`Stored in Neo4j with nodeId: ${node.nodeId}`);
        return node;
    },

    /**
     * Get all storage contents
     */
    getAllStorage() {
        return {
            postgresql: {
                name: 'PostgreSQL',
                type: 'Relational/Transactional',
                recordCount: this.databases.postgresql.length,
                records: this.databases.postgresql
            },
            mongodb: {
                name: 'MongoDB',
                type: 'Document Store',
                documentCount: this.databases.mongodb.length,
                documents: this.databases.mongodb
            },
            redis: {
                name: 'Redis',
                type: 'Cache/Key-Value',
                keyCount: Object.keys(this.databases.redis).length,
                entries: this.databases.redis
            },
            neo4j: {
                name: 'Neo4j',
                type: 'Graph Database',
                nodeCount: this.databases.neo4j.length,
                nodes: this.databases.neo4j
            }
        };
    },

    /**
     * Clear all storage (for testing)
     */
    clearAll() {
        this.databases = {
            postgresql: [],
            mongodb: [],
            redis: {},
            neo4j: []
        };
        this.counters = {
            postgresql: 1,
            mongodb: 1,
            neo4j: 1
        };
        Logger.info('All storage cleared');
    }
};

module.exports = PolyglotStore;
