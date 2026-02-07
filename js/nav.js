/**
 * PolyStoreX 2.0 - Navigation Component
 * Shared sidebar navigation for all authenticated pages
 */

const Nav = {
    // Navigation items configuration
    items: [
        {
            section: 'Overview',
            links: [
                { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' }
            ]
        },
        {
            section: 'Infrastructure',
            links: [
                { id: 'databases', label: 'Databases', href: 'databases.html', icon: 'database' },
                { id: 'routing', label: 'Data Routing', href: 'routing.html', icon: 'route' }
            ]
        },
        {
            section: 'Operations',
            links: [
                { id: 'transactions', label: 'Transactions', href: 'transactions.html', icon: 'transaction' },
                { id: 'monitoring', label: 'Monitoring', href: 'monitoring.html', icon: 'monitoring' }
            ]
        },
        {
            section: 'System',
            links: [
                { id: 'settings', label: 'Settings', href: 'settings.html', icon: 'settings' }
            ]
        }
    ],

    // SVG Icons
    icons: {
        logo: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" opacity="0.8"/>
      <rect x="18" y="2" width="12" height="12" rx="2" fill="currentColor" opacity="0.6"/>
      <rect x="2" y="18" width="12" height="12" rx="2" fill="currentColor" opacity="0.6"/>
      <rect x="18" y="18" width="12" height="12" rx="2" fill="currentColor" opacity="0.4"/>
      <circle cx="16" cy="16" r="4" fill="currentColor"/>
    </svg>`,

        dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"/>
      <rect x="14" y="3" width="7" height="5" rx="1"/>
      <rect x="14" y="12" width="7" height="9" rx="1"/>
      <rect x="3" y="16" width="7" height="5" rx="1"/>
    </svg>`,

        database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>`,

        route: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <path d="M6 9v6"/>
      <path d="M9 18h6c3 0 6-2 6-6s-3-6-6-6h-3"/>
      <polyline points="12 6 9 3 12 0"/>
    </svg>`,

        transaction: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>`,

        monitoring: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>`,

        settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`,

        logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>`
    },

    /**
     * Initialize navigation
     */
    init() {
        // Check authentication
        if (!Auth.requireAuth()) return;

        // Render sidebar
        this.render();

        // Set active page
        this.setActivePage();
    },

    /**
     * Render the sidebar navigation
     */
    render() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const user = Auth.getCurrentUser();
        const initials = Auth.getUserInitials(user);

        sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-logo">
          ${this.icons.logo}
          <div>
            <h1>PolyStoreX</h1>
            <span>v2.0</span>
          </div>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        ${this.items.map(section => `
          <div class="nav-section">
            <div class="nav-section-title">${section.section}</div>
            ${section.links.map(link => `
              <a href="${link.href}" class="nav-item" data-page="${link.id}">
                ${this.icons[link.icon]}
                <span>${link.label}</span>
              </a>
            `).join('')}
          </div>
        `).join('')}
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-info" onclick="Nav.showUserMenu()">
          <div class="user-avatar">${initials}</div>
          <div class="user-details">
            <div class="user-name">${user?.name || 'User'}</div>
            <div class="user-role">${user?.role || 'Engineer'}</div>
          </div>
        </div>
        <button class="btn btn-ghost w-full mt-sm" onclick="Auth.logout()">
          ${this.icons.logout}
          <span>Logout</span>
        </button>
      </div>
    `;
    },

    /**
     * Set active page in navigation
     */
    setActivePage() {
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            if (item.dataset.page === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    /**
     * Show user menu (placeholder for future expansion)
     */
    showUserMenu() {
        // Could expand to show a dropdown menu
        console.log('User menu clicked');
    }
};

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Nav.init();
});

// Make Nav available globally
window.Nav = Nav;
