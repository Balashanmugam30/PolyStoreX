/**
 * PolyStoreX 2.0 - Settings Module
 * Handles user preferences and system controls
 */

const Settings = {
    // Settings state
    state: {
        highLoad: false,
        randomFailures: false,
        latencyInjection: false,
        databases: {
            postgresql: true,
            mongodb: true,
            redis: true,
            neo4j: true
        },
        notifications: {
            email: true,
            browser: false
        }
    },

    /**
     * Initialize settings module
     */
    init() {
        // Load saved settings
        const saved = Utils.storage.get('settings');
        if (saved) {
            this.state = { ...this.state, ...saved };
        }

        // Update UI
        this.loadUserProfile();
        this.restoreState();
    },

    /**
     * Load user profile information
     */
    loadUserProfile() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const initials = Auth.getUserInitials(user);

        document.getElementById('profile-avatar').textContent = initials;
        document.getElementById('profile-name').textContent = user.name || 'User';
        document.getElementById('profile-email').textContent = user.email || 'user@polystorex.io';
        document.getElementById('profile-role').textContent = user.role || 'Platform Engineer';
    },

    /**
     * Restore UI state from saved settings
     */
    restoreState() {
        // Simulation toggles
        this.setToggle('toggle-high-load', this.state.highLoad);
        this.setToggle('toggle-random-failures', this.state.randomFailures);
        this.setToggle('toggle-latency', this.state.latencyInjection);

        // Database toggles
        Object.keys(this.state.databases).forEach(db => {
            this.setToggle(`toggle-${db}`, this.state.databases[db]);
        });

        // Notification toggles
        this.setToggle('toggle-email', this.state.notifications.email);
        this.setToggle('toggle-browser', this.state.notifications.browser);
    },

    /**
     * Set toggle state
     */
    setToggle(id, checked) {
        const toggle = document.getElementById(id);
        if (toggle) {
            toggle.checked = checked;
        }
    },

    /**
     * Save settings to storage
     */
    saveSettings() {
        Utils.storage.set('settings', this.state);
    },

    /**
     * Toggle high load simulation
     */
    toggleHighLoad(enabled) {
        this.state.highLoad = enabled;
        this.saveSettings();

        Auth.logActivity(
            enabled ? 'warning' : 'info',
            `High load simulation ${enabled ? 'enabled' : 'disabled'}`
        );

        // Dispatch event
        window.dispatchEvent(new CustomEvent('setting-change', {
            detail: { setting: 'highLoad', value: enabled }
        }));
    },

    /**
     * Toggle random failures
     */
    toggleRandomFailures(enabled) {
        this.state.randomFailures = enabled;
        this.saveSettings();

        Auth.logActivity(
            enabled ? 'warning' : 'info',
            `Random failures ${enabled ? 'enabled' : 'disabled'}`
        );

        window.dispatchEvent(new CustomEvent('setting-change', {
            detail: { setting: 'randomFailures', value: enabled }
        }));
    },

    /**
     * Toggle latency injection
     */
    toggleLatency(enabled) {
        this.state.latencyInjection = enabled;
        this.saveSettings();

        Auth.logActivity(
            enabled ? 'warning' : 'info',
            `Latency injection ${enabled ? 'enabled' : 'disabled'}`
        );

        window.dispatchEvent(new CustomEvent('setting-change', {
            detail: { setting: 'latencyInjection', value: enabled }
        }));
    },

    /**
     * Toggle database enabled state
     */
    toggleDatabase(db, enabled) {
        this.state.databases[db] = enabled;
        this.saveSettings();

        Auth.logActivity(
            enabled ? 'success' : 'warning',
            `${this.getDbName(db)} ${enabled ? 'enabled' : 'disabled'}`
        );

        window.dispatchEvent(new CustomEvent('database-toggle', {
            detail: { database: db, enabled: enabled }
        }));
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
     * Get current settings
     */
    getSettings() {
        return this.state;
    },

    /**
     * Check if a setting is enabled
     */
    isEnabled(setting) {
        return this.state[setting] === true;
    },

    /**
     * Check if a database is enabled
     */
    isDatabaseEnabled(db) {
        return this.state.databases[db] === true;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Settings.init();
});

// Make Settings available globally
window.Settings = Settings;
