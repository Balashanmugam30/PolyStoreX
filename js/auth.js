/**
 * PolyStoreX 2.0 - Authentication Module
 * Handles login, logout, and session management
 */

const Auth = {
    // Session key for localStorage
    SESSION_KEY: 'session',

    // Default user for simulation
    defaultUser: {
        id: 'usr_001',
        email: 'demo@polystorex.io',
        name: 'Demo User',
        role: 'Platform Engineer',
        avatar: null,
        preferences: {
            theme: 'dark',
            notifications: true
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const session = Utils.storage.get(this.SESSION_KEY);
        return session && session.user && session.expiresAt > Date.now();
    },

    /**
     * Get current user
     */
    getCurrentUser() {
        const session = Utils.storage.get(this.SESSION_KEY);
        return session ? session.user : null;
    },

    /**
     * Get user initials for avatar
     */
    getUserInitials(user) {
        if (!user || !user.name) return 'U';
        const parts = user.name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    },

    /**
     * Simulate login with email/password
     */
    async loginWithEmail(email, password) {
        if (!window.firebaseAuth || !window.firebaseProviders) {
            throw new Error("Firebase not initialized");
        }

        const result = await window.firebaseProviders.signInWithEmailAndPassword(
            window.firebaseAuth,
            email,
            password
        );

        const firebaseUser = result.user;

        const user = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.email.split('@')[0],
            role: "Platform Engineer",
            avatar: null,
            provider: "email",
            preferences: {
                theme: "dark",
                notifications: true
            }
        };

        this.createSession(user);
        return user;
    },


    /**
     * Simulate login with Google
     */
    async loginWithGoogle() {
        if (!window.firebaseAuth || !window.firebaseProviders) {
            throw new Error("Firebase not initialized");
        }

        const result = await window.firebaseProviders.signInWithPopup(
            window.firebaseAuth,
            window.firebaseProviders.google
        );

        const firebaseUser = result.user;

        const user = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || "Google User",
            role: "Platform Engineer",
            avatar: firebaseUser.photoURL,
            provider: "google",
            preferences: {
                theme: "dark",
                notifications: true
            }
        };

        this.createSession(user);
        return user;
    },


    /**
     * Simulate login with phone/OTP
     */
    sendOTP(phone) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!phone || phone.length < 10) {
                    reject(new Error('Invalid phone number'));
                    return;
                }

                // Store phone for verification
                Utils.storage.set('pending_phone', phone);
                resolve({ message: 'OTP sent successfully' });
            }, 500);
        });
    },

    verifyOTP(otp) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const phone = Utils.storage.get('pending_phone');

                if (!phone) {
                    reject(new Error('Please request OTP first'));
                    return;
                }

                // Accept any 6-digit OTP for demo
                if (!otp || otp.length !== 6) {
                    reject(new Error('Invalid OTP'));
                    return;
                }

                const user = {
                    ...this.defaultUser,
                    phone: phone,
                    name: 'Phone User',
                    provider: 'phone'
                };

                Utils.storage.remove('pending_phone');
                this.createSession(user);
                resolve(user);
            }, 800);
        });
    },

    /**
     * Create user session
     */
    createSession(user) {
        const session = {
            user: user,
            createdAt: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        Utils.storage.set(this.SESSION_KEY, session);

        // Log activity
        this.logActivity('login', `User logged in via ${user.provider || 'email'}`);
    },

    /**
     * Logout user
     */
    logout() {
        this.logActivity('logout', 'User logged out');
        Utils.storage.remove(this.SESSION_KEY);
        window.location.href = 'index.html';
    },

    /**
     * Log user activity
     */
    logActivity(type, message) {
        const activities = Utils.storage.get('user_activities', []);
        activities.unshift({
            id: Utils.random.uuid(),
            type: type,
            message: message,
            timestamp: new Date().toISOString()
        });

        // Keep only last 100 activities
        Utils.storage.set('user_activities', activities.slice(0, 100));
    },

    /**
     * Check authentication and redirect if needed
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    /**
     * Redirect if already authenticated
     */
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
            return true;
        }
        return false;
    }
};

// Make Auth available globally
window.Auth = Auth;
