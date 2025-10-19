// Global variables and state management
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let problems = JSON.parse(localStorage.getItem('fixMyStreetProblems')) || [];
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

// Theme management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
});

// Theme toggle functionality
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// Initialize theme
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

// Sample data for demonstration
const sampleProblems = [
    {
        id: 1,
        type: 'pothole',
        location: 'Main Street, Downtown',
        description: 'Large pothole causing traffic issues and potential vehicle damage.',
        severity: 'high',
        status: 'resolved',
        date: '2024-01-15',
        photos: [],
        contactEmail: 'user@example.com',
        reporter: 'John Doe',
        assignedTo: 'Road Maintenance Dept.',
        resolutionDate: '2024-01-17',
        resolutionNotes: 'Pothole filled and road resurfaced'
    },
    {
        id: 2,
        type: 'road-damage',
        location: 'Oak Avenue, Residential Area',
        description: 'Cracked pavement with loose debris creating safety hazards.',
        severity: 'medium',
        status: 'in-progress',
        date: '2024-01-14',
        photos: [],
        contactEmail: 'resident@example.com',
        reporter: 'Sarah Miller',
        assignedTo: 'Road Maintenance Dept.',
        estimatedCompletion: '2024-01-20'
    },
    {
        id: 3,
        type: 'sanitation',
        location: 'Park Street, Near School',
        description: 'Overflowing trash bins and scattered garbage affecting the area.',
        severity: 'medium',
        status: 'resolved',
        date: '2024-01-10',
        photos: [],
        contactEmail: 'parent@example.com',
        reporter: 'Robert Brown',
        assignedTo: 'Sanitation Dept.',
        resolutionDate: '2024-01-12',
        resolutionNotes: 'Trash collected and bins replaced'
    }
];

const sampleNotifications = [
    {
        id: 1,
        type: 'success',
        title: 'Issue Resolved',
        message: 'Your pothole report on Oak Street has been fixed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
    },
    {
        id: 2,
        type: 'info',
        title: 'Status Update',
        message: 'Your sanitation report is now in progress',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false
    },
    {
        id: 3,
        type: 'success',
        title: 'Thank You!',
        message: 'Your report helped improve community safety',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: true
    }
];

// Initialize with REAL (empty) data so stats start at 0. Uncomment below to seed.
// if (problems.length === 0) { problems = sampleProblems; saveProblems(); }
// if (notifications.length === 0) { notifications = sampleNotifications; saveNotifications(); }

// Authentication functions
function login(email, password) {
    // Simulate authentication
    const user = {
        id: 1,
        name: 'John Doe',
        email: email,
        avatar: 'https://via.placeholder.com/40x40/667eea/ffffff?text=J',
        role: email && email.toLowerCase().includes('admin') ? 'admin' : 'citizen',
        joinDate: '2024-01-01'
    };
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
}

function register(userData) {
    // Simulate registration
    const user = {
        id: Date.now(),
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        avatar: `https://via.placeholder.com/40x40/667eea/ffffff?text=${userData.firstName[0]}${userData.lastName[0]}`,
        role: (userData.email || '').toLowerCase().includes('admin') ? 'admin' : 'citizen',
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Navigation functions
function navigateToUpload() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    window.location.href = 'upload.html';
}

function navigateToViewAll() {
    window.location.href = 'reports.html';
}

function navigateToDashboard() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    window.location.href = 'dashboard.html';
}

// Ensure navigateToReport exists for CTA buttons
function navigateToReport() {
    navigateToUpload();
}

function navigateToReports() {
    window.location.href = 'reports.html';
}

function navigateToAnalytics() {
    window.location.href = 'analytics.html';
}

function navigateToProfile() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    window.location.href = 'profile.html';
}

// Admin helpers
function isAdmin() { return currentUser && currentUser.role === 'admin'; }
function requireAdmin() {
    if (!currentUser) { window.location.href = 'index.html'; return; }
    if (!isAdmin()) { window.location.href = 'index.html'; }
}

function goBack() {
    window.history.back();
}

// User menu functions
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.toggle('show');
    }
}

// Notifications functions
function toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

function closeNotifications() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
        panel.classList.remove('show');
    }
}

function addNotification(notification) {
    notifications.unshift(notification);
    saveNotifications();
    updateNotificationBadge();
}

function markNotificationAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        saveNotifications();
        updateNotificationBadge();
    }
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const unreadCount = notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Make site publicly accessible; only restrict protected pages
    const path = window.location.pathname;
    const protectedPaths = ['dashboard.html', 'upload.html', 'profile.html', 'settings.html'];
    const isProtected = protectedPaths.some(p => path.includes(p));
    if (!currentUser && isProtected) {
        window.location.href = 'index.html';
        return;
    }

    // Update user info in header
    updateUserInfo();
    ensureAdminNavLink();

    // Initialize page-specific functionality
    // path already defined above
    
    if (path.includes('index.html')) {
        initializeLoginPage();
    } else if (path.includes('register.html')) {
        initializeRegisterPage();
    } else if (path.includes('dashboard.html')) {
        initializeDashboard();
    } else if (path.includes('reports.html')) {
        initializeReportsPage();
    } else if (path.includes('analytics.html')) {
        initializeAnalyticsPage();
    } else if (path.includes('upload.html')) {
        initializeUploadPage();
    } else if (path.includes('admin.html')) {
        // Admin page renders via inline script; ensure badge
    }

    // Update notification badge
    updateNotificationBadge();

    // Update homepage live stats if present
    updateHomeStats();
});

function updateUserInfo() {
    if (currentUser) {
        const userNameElements = document.querySelectorAll('.user-name');
        const userAvatarElements = document.querySelectorAll('.user-avatar');
        
        userNameElements.forEach(el => {
            el.textContent = currentUser.name;
        });
        
        userAvatarElements.forEach(el => {
            el.src = currentUser.avatar;
            el.alt = currentUser.name;
        });
    }
}

function ensureAdminNavLink() {
    if (!isAdmin()) return;
    const navs = document.querySelectorAll('.main-nav');
    navs.forEach(nav => {
        if (!nav.querySelector('a[href="admin.html"]')) {
            const a = document.createElement('a');
            a.href = 'admin.html';
            a.className = 'nav-link';
            a.textContent = 'Admin';
            nav.appendChild(a);
        }
    });
}

// Login page initialization
function initializeLoginPage() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (login(email, password)) {
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showMessage('Invalid credentials. Please try again.', 'error');
    }
}

// Register page initialization
function initializeRegisterPage() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', handleRegister);
    }
    
    // Password strength checker
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        password: formData.get('password')
    };
    
    if (formData.get('password') !== formData.get('confirmPassword')) {
        showMessage('Passwords do not match.', 'error');
        return;
    }
    
    if (register(userData)) {
        showMessage('Registration successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    let strength = 0;
    let strengthLabel = 'Weak';
    let strengthColor = '#dc3545';
    
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    if (strength >= 75) {
        strengthLabel = 'Strong';
        strengthColor = '#28a745';
    } else if (strength >= 50) {
        strengthLabel = 'Medium';
        strengthColor = '#ffc107';
    }
    
    strengthFill.style.width = strength + '%';
    strengthFill.style.background = strengthColor;
    strengthText.textContent = strengthLabel;
    strengthText.style.color = strengthColor;
}

// Upload page initialization
function initializeUploadPage() {
    const form = document.getElementById('problemForm');
    const fileInput = document.getElementById('photos');
    const photoPreview = document.getElementById('photoPreview');
    const useLocationBtn = document.getElementById('useLocationBtn');

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', fillWithGeolocation);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Handle file uploads
    const files = document.getElementById('photos').files;
    // Validation: up to 5 images, max 5MB, allowed types
    const MAX_FILES = 5;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

    if (files.length > MAX_FILES) {
        showMessage(`Please upload up to ${MAX_FILES} photos.`, 'error');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!ALLOWED.includes(f.type)) {
            showMessage('Only JPG, PNG, or WebP images are allowed.', 'error');
            return;
        }
        if (f.size > MAX_SIZE) {
            showMessage('Each image must be under 5MB.', 'error');
            return;
        }
    }

    // Prepare issue data for API
    const issueData = {
        title: formData.get('description').substring(0, 200), // Use description as title
        description: formData.get('description'),
        type: formData.get('problemType'),
        severity: formData.get('severity'),
        location: formData.get('location'),
        photos: Array.from(files) // Convert FileList to Array
    };

    try {
        // Try to submit to backend API first
        const response = await API.createIssue(issueData);
        
        // Add to local storage as backup
        const problemData = {
            id: response.issue.id,
            type: issueData.type,
            location: issueData.location,
            description: issueData.description,
            severity: issueData.severity,
            status: 'reported',
            date: new Date().toISOString().split('T')[0],
            photos: response.issue.photos || [],
            contactEmail: formData.get('contactEmail') || '',
            reporter: currentUser.name,
            assignedTo: null,
            estimatedCompletion: null,
            resolutionDate: null,
            resolutionNotes: null
        };
        
        problems.push(problemData);
        saveProblems();
        
        // Add notification
        addNotification({
            id: Date.now(),
            type: 'success',
            title: 'Report Submitted',
            message: `Your ${issueData.type} report has been submitted successfully`,
            timestamp: new Date(),
            read: false
        });
        
        showMessage('Problem reported successfully! Thank you for helping improve our streets.', 'success');
        
        // Reset form
        const form = document.getElementById('problemForm');
        if (form) {
            form.reset();
        }
        
        const photoPreview = document.getElementById('photoPreview');
        if (photoPreview) {
            photoPreview.innerHTML = '';
        }
        
        // Redirect to confirmation page after 2 seconds
        setTimeout(() => {
            window.location.href = 'report-success.html';
        }, 2000);
        
    } catch (apiError) {
        console.log('API not available, using local storage');
        // Fallback to local storage
        const problemData = {
            id: Date.now(),
            type: issueData.type,
            location: issueData.location,
            description: issueData.description,
            severity: issueData.severity,
            status: 'reported',
            date: new Date().toISOString().split('T')[0],
            photos: [],
            contactEmail: formData.get('contactEmail') || '',
            reporter: currentUser.name,
            assignedTo: null,
            estimatedCompletion: null,
            resolutionDate: null,
            resolutionNotes: null
        };

        if (files.length > 0) {
            processFiles(files, problemData);
        } else {
            saveProblem(problemData);
        }
    }
}

function processFiles(files, problemData) {
    let processedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                problemData.photos.push({
                    id: Date.now() + i,
                    filename: file.name,
                    originalName: file.name,
                    fileSize: file.size,
                    mimeType: file.type,
                    url: e.target.result // Data URL for local storage
                });
                processedCount++;
                
                if (processedCount === files.length) {
                    saveProblem(problemData);
                }
            };
            reader.readAsDataURL(file);
        } else {
            processedCount++;
        }
    }
    
    if (processedCount === files.length && problemData.photos.length === 0) {
        saveProblem(problemData);
    }
}

function saveProblem(problemData) {
    problems.push(problemData);
    saveProblems();
    
    // Add notification
    addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Report Submitted',
        message: `Your ${problemData.type} report has been submitted successfully`,
        timestamp: new Date(),
        read: false
    });
    
    showMessage('Problem reported successfully! Thank you for helping improve our streets.', 'success');
    
    // Reset form
    const form = document.getElementById('problemForm');
    if (form) {
        form.reset();
    }
    
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview) {
        photoPreview.innerHTML = '';
    }
    
    // Redirect to confirmation page after 2 seconds
    setTimeout(() => {
        window.location.href = 'report-success.html';
    }, 2000);
}

function handleFileSelect(e) {
    const files = e.target.files;
    const preview = document.getElementById('photoPreview');
    if (!preview) return;
    
    preview.innerHTML = '';
    const MAX_THUMBS = 5;
    const count = Math.min(files.length, MAX_THUMBS);
    for (let i = 0; i < count; i++) {
        const file = files[i];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Problem photo';
                img.style.cssText = 'width: 100%; height: 150px; object-fit: cover; border-radius: 10px; border:2px solid #e1e5e9;';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }
}

// Geolocation helper
function fillWithGeolocation() {
    const locationInput = document.getElementById('location');
    if (!navigator.geolocation) {
        showMessage('Geolocation is not supported by your browser.', 'error');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            showMessage('Location captured from device.', 'success');
        },
        (err) => {
            showMessage('Unable to retrieve your location.', 'error');
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
}

// Dashboard initialization
async function initializeDashboard() {
    await loadDashboardStats();
    loadRecentReports();
    loadActivityTimeline();
}

async function loadDashboardStats() {
    try {
        // Try to load from API first, fallback to local data
        let dashboardStats;
        try {
            dashboardStats = await API.getDashboardStats();
        } catch (apiError) {
            console.log('API not available, using local data for dashboard');
            // Fallback to local data
            const userReports = currentUser ? problems.filter(p => p.reporter === currentUser.name) : [];
            const resolvedReports = userReports.filter(p => p.status === 'resolved').length;
            const inProgressReports = userReports.filter(p => p.status === 'in-progress').length;
            const totalReports = userReports.length;
            
            dashboardStats = {
                totalReports: totalReports,
                resolved: resolvedReports,
                inProgress: inProgressReports,
                communityRating: '4.8'
            };
        }
        
        // Update stats with real data
        const statElements = {
            totalReports: dashboardStats.totalReports || 0,
            resolvedReports: dashboardStats.resolved || 0,
            inProgressReports: dashboardStats.inProgress || 0,
            communityRating: dashboardStats.communityRating || '4.8'
        };
        
        Object.keys(statElements).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = statElements[key];
            }
        });
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function updateHomeStats() {
    try {
        // Try to load from API first, fallback to local data
        let stats;
        try {
            const dashboardStats = await API.getDashboardStats();
            stats = {
                total: dashboardStats.totalReports || 0,
                resolved: dashboardStats.resolved || 0,
                rate: dashboardStats.resolutionRate || 0,
                avgDays: dashboardStats.avgResponseTime || 0,
                cities: 50 // This could be calculated from location data
            };
        } catch (apiError) {
            console.log('API not available, using local data for home stats');
            // Fallback to local data
            const total = problems.length;
            const resolved = problems.filter(p => p.status === 'resolved').length;
            const rate = total === 0 ? 0 : Math.round((resolved / total) * 100);
            
            stats = {
                total: total,
                resolved: resolved,
                rate: rate,
                avgDays: 0,
                cities: 0
            };
        }

        const map = {
            homeTotalReports: stats.total,
            homeResolutionRate: `${stats.rate}%`,
            homeAvgResponse: `${stats.avgDays} Days`,
            homeCities: stats.cities
        };

        Object.keys(map).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = map[id];
        });
        
    } catch (error) {
        console.error('Error loading home stats:', error);
    }
}

function loadRecentReports() {
    const userReports = problems.filter(p => p.reporter === currentUser.name)
                               .sort((a, b) => new Date(b.date) - new Date(a.date))
                               .slice(0, 3);
    
    const reportsList = document.querySelector('.reports-list');
    if (!reportsList) return;
    
    reportsList.innerHTML = '';
    
    userReports.forEach(report => {
        const reportItem = createReportItem(report);
        reportsList.appendChild(reportItem);
    });
}

function createReportItem(report) {
    const item = document.createElement('div');
    item.className = 'report-item';
    
    const typeLabel = report.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const statusClass = `status-${report.status.replace('-', '-')}`;
    
    item.innerHTML = `
        <div class="report-info">
            <div class="report-type-badge ${report.type}">${typeLabel}</div>
            <h4>${report.description.substring(0, 50)}${report.description.length > 50 ? '...' : ''}</h4>
            <p class="report-location"><i class="fas fa-map-marker-alt"></i> ${report.location}</p>
        </div>
        <div class="report-status ${statusClass}">${report.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
    `;
    
    return item;
}

function loadActivityTimeline() {
    const userReports = problems.filter(p => p.reporter === currentUser.name)
                               .sort((a, b) => new Date(b.date) - new Date(a.date))
                               .slice(0, 3);
    
    const timeline = document.querySelector('.activity-timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    userReports.forEach(report => {
        const activityItem = createActivityItem(report);
        timeline.appendChild(activityItem);
    });
}

function createActivityItem(report) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    let icon = 'fas fa-plus';
    let title = 'New Report';
    let message = `You reported a ${report.type} issue`;
    
    if (report.status === 'resolved') {
        icon = 'fas fa-check-circle';
        title = 'Issue Resolved';
        message = `Your ${report.type} report has been fixed`;
    } else if (report.status === 'in-progress') {
        icon = 'fas fa-clock';
        title = 'Status Update';
        message = `Your ${report.type} report is now in progress`;
    }
    
    item.innerHTML = `
        <div class="activity-icon">
            <i class="${icon}"></i>
        </div>
        <div class="activity-content">
            <h4>${title}</h4>
            <p>${message}</p>
            <span class="activity-time">${formatDate(report.date)}</span>
        </div>
    `;
    
    return item;
}

// Reports page initialization
async function initializeReportsPage() {
    await loadReports();
    await updateReportsStats();
    setupFilters();
}

// Admin rendering
function renderAdminReports() {
    const grid = document.getElementById('adminReportsGrid');
    if (!grid) return;
    const statusFilter = document.getElementById('adminStatusFilter')?.value || 'all';
    let items = problems.slice().sort((a,b)=> new Date(b.date)-new Date(a.date));
    if (statusFilter !== 'all') items = items.filter(p => p.status === statusFilter);
    grid.innerHTML = '';
    if (items.length === 0) {
        grid.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><h3>No issues</h3><p>Nothing to manage right now.</p></div>';
        return;
    }
    items.forEach(p => grid.appendChild(adminCard(p)));
}

function adminCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card';
    const typeLabel = report.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    card.innerHTML = `
        <div class="report-header">
            <div class="report-type-badge ${report.type}">${typeLabel}</div>
            <div class="report-status status-${report.status}">${report.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
        </div>
        <div class="report-content">
            <h3>${report.description.substring(0, 60)}${report.description.length>60?'...':''}</h3>
            <p class="report-location"><i class="fas fa-map-marker-alt"></i> ${report.location}</p>
            <div class="report-meta">
                <div>${formatDate(report.date)}</div>
                <div class="report-severity severity-${report.severity}">${report.severity}</div>
            </div>
            <div class="quick-actions" style="margin-top:1rem; grid-template-columns: repeat(3,1fr);">
                <button class="quick-action-btn" onclick="adminUpdateStatus(${report.id}, 'reported')"><i class="fas fa-flag"></i><span>Reported</span></button>
                <button class="quick-action-btn" onclick="adminUpdateStatus(${report.id}, 'in-progress')"><i class="fas fa-spinner"></i><span>In Progress</span></button>
                <button class="quick-action-btn" onclick="adminUpdateStatus(${report.id}, 'resolved')"><i class="fas fa-check"></i><span>Resolved</span></button>
            </div>
        </div>`;
    return card;
}

function adminUpdateStatus(id, status) {
    const r = problems.find(p => p.id === id);
    if (!r) return;
    r.status = status;
    if (status === 'resolved') r.resolutionDate = new Date().toISOString().split('T')[0];
    saveProblems();
    renderAdminReports();
    showMessage('Status updated.', 'success');
}

async function loadReports() {
    const reportsGrid = document.getElementById('reportsGrid');
    if (!reportsGrid) return;
    
    try {
        // Try to load from API first, fallback to local data
        let userReports;
        try {
            const response = await API.getMyIssues();
            userReports = response.issues || [];
        } catch (apiError) {
            console.log('API not available, using local data for reports');
            // Fallback to local data
            userReports = problems.filter(p => p.reporter === currentUser.name)
                                   .sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        reportsGrid.innerHTML = '';
        
        userReports.forEach(report => {
            const reportCard = createReportCard(report);
            reportsGrid.appendChild(reportCard);
        });
        
    } catch (error) {
        console.error('Error loading reports:', error);
        reportsGrid.innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><h3>Error loading reports</h3><p>Please try again later.</p></div>';
    }
}

function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card';
    
    const typeLabel = report.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const statusClass = `status-${report.status.replace('-', '-')}`;
    const severityClass = `severity-${report.severity}`;
    
    card.innerHTML = `
        <div class="report-header">
            <div class="report-type-badge ${report.type}">${typeLabel}</div>
            <div class="report-status ${statusClass}">${report.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
        </div>
        <div class="report-image">
            ${report.photos && report.photos.length > 0 ? 
                `<img src="${report.photos[0].url}" alt="Report Image" style="width: 100%; height: 200px; object-fit: cover;">` :
                `<img src="https://via.placeholder.com/300x200/667eea/ffffff?text=${typeLabel}" alt="Report Image">`
            }
            <div class="report-overlay">
                <button class="view-btn" onclick="viewReport(${report.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        <div class="report-content">
            <h3>${report.description.substring(0, 60)}${report.description.length > 60 ? '...' : ''}</h3>
            <p class="report-location">
                <i class="fas fa-map-marker-alt"></i> ${report.location}
            </p>
            <p class="report-description">
                ${report.description}
            </p>
            <div class="report-meta">
                <div class="report-severity ${severityClass}">${report.severity.charAt(0).toUpperCase() + report.severity.slice(1)} Priority</div>
                <div class="report-date">${formatDate(report.date)}</div>
            </div>
        </div>
        <div class="report-footer">
            <div class="report-actions">
                <button class="action-btn" onclick="editReport(${report.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="shareReport(${report.id})">
                    <i class="fas fa-share"></i>
                </button>
                <button class="action-btn" onclick="deleteReport(${report.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

async function updateReportsStats() {
    try {
        // Try to load from API first, fallback to local data
        let reportsData;
        try {
            const response = await API.getMyIssues();
            reportsData = response.issues || [];
        } catch (apiError) {
            console.log('API not available, using local data for reports');
            // Fallback to local data
            reportsData = problems.filter(p => p.reporter === currentUser.name);
        }
        
        const resolvedReports = reportsData.filter(p => p.status === 'resolved').length;
        const inProgressReports = reportsData.filter(p => p.status === 'in-progress').length;
        const totalReports = reportsData.length;
        const newReports = reportsData.filter(p => {
            const reportDate = new Date(p.date);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return reportDate > weekAgo;
        }).length;
        
        const stats = {
            totalReports: totalReports,
            resolvedReports: resolvedReports,
            inProgressReports: inProgressReports,
            newReports: newReports
        };
        
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = stats[key];
            }
        });
        
    } catch (error) {
        console.error('Error loading reports stats:', error);
    }
}

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const severityFilter = document.getElementById('severityFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterReports);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterReports);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', filterReports);
    }
    if (severityFilter) {
        severityFilter.addEventListener('change', filterReports);
    }
}

function filterReports() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    const severityFilter = document.getElementById('severityFilter')?.value || 'all';
    
    const userReports = problems.filter(p => p.reporter === currentUser.name);
    
    let filteredReports = userReports.filter(report => {
        const matchesSearch = report.description.toLowerCase().includes(searchTerm) ||
                            report.location.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        const matchesType = typeFilter === 'all' || report.type === typeFilter;
        const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
        
        return matchesSearch && matchesStatus && matchesType && matchesSeverity;
    });
    
    displayFilteredReports(filteredReports);
}

function displayFilteredReports(filteredReports) {
    const reportsGrid = document.getElementById('reportsGrid');
    if (!reportsGrid) return;
    
    reportsGrid.innerHTML = '';
    
    if (filteredReports.length === 0) {
        reportsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No reports found</h3>
                <p>Try adjusting your filters or <a href="upload.html">report a new problem</a>.</p>
            </div>
        `;
        return;
    }
    
    filteredReports.forEach(report => {
        const reportCard = createReportCard(report);
        reportsGrid.appendChild(reportCard);
    });
}

// Report actions
function viewReport(reportId) {
    const report = problems.find(p => p.id === reportId);
    if (!report) return;
    
    const modal = document.getElementById('reportModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const typeLabel = report.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const statusClass = `status-${report.status.replace('-', '-')}`;
    const severityClass = `severity-${report.severity}`;
    
    modalBody.innerHTML = `
        <div class="report-details">
            <div class="detail-section">
                <h3>Report Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Type:</label>
                        <span class="report-type-badge ${report.type}">${typeLabel}</span>
                    </div>
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="report-status ${statusClass}">${report.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                    <div class="detail-item">
                        <label>Severity:</label>
                        <span class="report-severity ${severityClass}">${report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Date Reported:</label>
                        <span>${formatDate(report.date)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Location:</label>
                        <span>${report.location}</span>
                    </div>
                    <div class="detail-item">
                        <label>Reporter:</label>
                        <span>${report.reporter}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Description</h3>
                <p>${report.description}</p>
            </div>
            
            ${report.photos && report.photos.length > 0 ? `
                <div class="detail-section">
                    <h3>Photos</h3>
                    <div class="photo-gallery">
                        ${report.photos.map(photo => `
                            <img src="${photo.url || photo}" alt="Report photo" class="report-photo">
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${report.assignedTo ? `
                <div class="detail-section">
                    <h3>Assignment</h3>
                    <p><strong>Assigned to:</strong> ${report.assignedTo}</p>
                    ${report.estimatedCompletion ? `<p><strong>Estimated completion:</strong> ${formatDate(report.estimatedCompletion)}</p>` : ''}
                </div>
            ` : ''}
            
            ${report.resolutionDate ? `
                <div class="detail-section">
                    <h3>Resolution</h3>
                    <p><strong>Resolved on:</strong> ${formatDate(report.resolutionDate)}</p>
                    ${report.resolutionNotes ? `<p><strong>Notes:</strong> ${report.resolutionNotes}</p>` : ''}
                </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('show');
}

function editReport(reportId) {
    // Implementation for editing reports
    showMessage('Edit functionality coming soon!', 'info');
}

function shareReport(reportId) {
    const report = problems.find(p => p.id === reportId);
    if (!report) return;
    
    const shareUrl = `${window.location.origin}/reports.html?id=${reportId}`;
    
    if (navigator.share) {
        navigator.share({
            title: `Street Issue Report: ${report.type}`,
            text: report.description,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showMessage('Report link copied to clipboard!', 'success');
        });
    }
}

function deleteReport(reportId) {
    if (confirm('Are you sure you want to delete this report?')) {
        const index = problems.findIndex(p => p.id === reportId);
        if (index > -1) {
            problems.splice(index, 1);
            saveProblems();
            loadReports();
            updateReportsStats();
            showMessage('Report deleted successfully', 'success');
        }
    }
}

function closeModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Analytics page initialization
async function initializeAnalyticsPage() {
    await loadAnalyticsData();
    initializeCharts();
}

async function loadAnalyticsData() {
    try {
        // Try to load from API first, fallback to localStorage
        let dashboardStats;
        try {
            dashboardStats = await API.getDashboardStats();
        } catch (apiError) {
            console.log('API not available, using local data');
            // Fallback to local data
            const total = problems.length;
            const resolved = problems.filter(p => p.status === 'resolved').length;
            const rate = total === 0 ? 0 : Math.round((resolved / total) * 100);
            
            dashboardStats = {
                totalReports: total,
                resolutionRate: rate,
                avgResponseTime: 0,
                citiesCovered: '50+'
            };
        }
        
        // Update metrics with real data
        const metrics = {
            totalReports: dashboardStats.totalReports || 0,
            resolutionRate: dashboardStats.resolutionRate || 0,
            avgResponseTime: dashboardStats.avgResponseTime || 0,
            citiesCovered: dashboardStats.citiesCovered || '50+'
        };
        
        Object.keys(metrics).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = metrics[key];
            }
        });
        
        // Load additional analytics data
        await loadAnalyticsCharts();
        
    } catch (error) {
        console.error('Error loading analytics data:', error);
        showNotification('Failed to load analytics data', 'error');
    }
}

async function loadAnalyticsCharts() {
    try {
        // Try to load from API first, fallback to local data
        let issuesByType, issuesBySeverity, issuesOverTime, topReporters;
        
        try {
            [issuesByType, issuesBySeverity, issuesOverTime, topReporters] = await Promise.all([
                API.getIssuesByType(),
                API.getIssuesBySeverity(),
                API.getIssuesOverTime('30d'),
                API.getTopReporters(5)
            ]);
        } catch (apiError) {
            console.log('API not available, using local data for charts');
            // Generate local data from problems array
            issuesByType = { issuesByType: generateLocalIssuesByType() };
            issuesBySeverity = { issuesBySeverity: generateLocalIssuesBySeverity() };
            issuesOverTime = { issuesOverTime: generateLocalIssuesOverTime() };
            topReporters = { topReporters: generateLocalTopReporters() };
        }
        
        // Update charts with real data
        updateReportsOverTimeChart(issuesOverTime.issuesOverTime);
        updateIssuesByTypeChart(issuesByType.issuesByType);
        updateIssuesBySeverityChart(issuesBySeverity.issuesBySeverity);
        updateTopReportersChart(topReporters.topReporters);
        
    } catch (error) {
        console.error('Error loading analytics charts:', error);
        showNotification('Failed to load analytics charts', 'error');
    }
}

function initializeCharts() {
    // Initialize Chart.js charts with real data
    if (typeof Chart === 'undefined') return;
    
    // Charts will be updated by loadAnalyticsCharts()
}

function updateReportsOverTimeChart(data) {
    const reportsCtx = document.getElementById('reportsChart');
    if (!reportsCtx || !data) return;
    
    const labels = data.map(item => item.period);
    const totalData = data.map(item => item.total);
    const resolvedData = data.map(item => item.resolved);
    
    new Chart(reportsCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Reports',
                data: totalData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }, {
                label: 'Resolved',
                data: resolvedData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
    
    // Issue types distribution chart
    const typesCtx = document.getElementById('typesChart');
    if (typesCtx) {
        new Chart(typesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pothole', 'Road Damage', 'Sanitation', 'Street Light', 'Other'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Resolution timeline chart
    const resolutionCtx = document.getElementById('resolutionChart');
    if (resolutionCtx) {
        new Chart(resolutionCtx, {
            type: 'bar',
            data: {
                labels: ['< 1 day', '1-2 days', '3-5 days', '1-2 weeks', '> 2 weeks'],
                datasets: [{
                    label: 'Reports',
                    data: [25, 40, 20, 10, 5],
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Geographic distribution chart
    const geoCtx = document.getElementById('geoChart');
    if (geoCtx) {
        new Chart(geoCtx, {
            type: 'bar',
            data: {
                labels: ['Downtown', 'Residential', 'Commercial', 'Industrial', 'Suburbs'],
                datasets: [{
                    label: 'Reports',
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: '#764ba2'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }


function updateIssuesByTypeChart(data) {
    const typeCtx = document.getElementById('typesChart');
    if (!typeCtx || !data) return;
    
    const labels = data.map(item => item.type);
    const counts = data.map(item => item.count);
    const resolved = data.map(item => item.resolved);
    
    new Chart(typeCtx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c',
                    '#4facfe',
                    '#43e97b',
                    '#fa709a'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateIssuesBySeverityChart(data) {
    const severityCtx = document.getElementById('severityChart');
    if (!severityCtx || !data) return;
    
    const labels = data.map(item => item.severity);
    const counts = data.map(item => item.count);
    const colors = {
        'critical': '#ef4444',
        'high': '#f97316',
        'medium': '#eab308',
        'low': '#22c55e'
    };
    
    new Chart(severityCtx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: labels.map(severity => colors[severity] || '#6b7280'),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateTopReportersChart(data) {
    const reportersCtx = document.getElementById('reportersChart');
    if (!reportersCtx || !data) return;
    
    const labels = data.map(item => item.name);
    const counts = data.map(item => item.totalReports);
    
    new Chart(reportersCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Reports',
                data: counts,
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Helper functions to generate local analytics data
function generateLocalIssuesByType() {
    const typeCounts = {};
    problems.forEach(problem => {
        typeCounts[problem.type] = (typeCounts[problem.type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([type, count]) => ({
        type: type,
        count: count,
        resolved: problems.filter(p => p.type === type && p.status === 'resolved').length
    }));
}

function generateLocalIssuesBySeverity() {
    const severityCounts = {};
    problems.forEach(problem => {
        severityCounts[problem.severity] = (severityCounts[problem.severity] || 0) + 1;
    });
    
    return Object.entries(severityCounts).map(([severity, count]) => ({
        severity: severity,
        count: count,
        resolved: problems.filter(p => p.severity === severity && p.status === 'resolved').length
    }));
}

function generateLocalIssuesOverTime() {
    // Generate last 30 days of data
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayProblems = problems.filter(p => p.date === dateStr);
        const resolved = dayProblems.filter(p => p.status === 'resolved').length;
        
        data.push({
            period: dateStr,
            total: dayProblems.length,
            resolved: resolved,
            inProgress: dayProblems.filter(p => p.status === 'in-progress').length,
            reported: dayProblems.filter(p => p.status === 'reported').length
        });
    }
    return data;
}

function generateLocalTopReporters() {
    const reporterCounts = {};
    problems.forEach(problem => {
        const reporter = problem.reporter;
        if (!reporterCounts[reporter]) {
            reporterCounts[reporter] = {
                name: reporter,
                totalReports: 0,
                resolvedReports: 0
            };
        }
        reporterCounts[reporter].totalReports++;
        if (problem.status === 'resolved') {
            reporterCounts[reporter].resolvedReports++;
        }
    });
    
    return Object.values(reporterCounts)
        .sort((a, b) => b.totalReports - a.totalReports)
        .slice(0, 5);
}

// Utility functions
function saveProblems() {
    localStorage.setItem('fixMyStreetProblems', JSON.stringify(problems));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Add to top of page
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function togglePassword(inputId = 'password') {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function refreshDashboard() {
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardStats();
        loadRecentReports();
        loadActivityTimeline();
        showMessage('Dashboard refreshed!', 'success');
    }
}

function exportReports() {
    const userReports = problems.filter(p => p.reporter === currentUser.name);
    const csvContent = generateCSV(userReports);
    downloadCSV(csvContent, 'my-reports.csv');
    showMessage('Reports exported successfully!', 'success');
}

function exportAnalytics() {
    const analyticsData = {
        totalReports: problems.length,
        resolutionRate: Math.round((problems.filter(p => p.status === 'resolved').length / problems.length) * 100),
        avgResponseTime: '2.3',
        citiesCovered: '50+'
    };
    
    const csvContent = generateAnalyticsCSV(analyticsData);
    downloadCSV(csvContent, 'analytics-data.csv');
    showMessage('Analytics data exported successfully!', 'success');
}

function generateCSV(reports) {
    const headers = ['ID', 'Type', 'Location', 'Description', 'Severity', 'Status', 'Date', 'Reporter'];
    const rows = reports.map(report => [
        report.id,
        report.type,
        report.location,
        report.description,
        report.severity,
        report.status,
        report.date,
        report.reporter
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateAnalyticsCSV(data) {
    const headers = ['Metric', 'Value'];
    const rows = Object.entries(data).map(([key, value]) => [key, value]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function toggleView(viewType) {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const reportsGrid = document.getElementById('reportsGrid');
    if (reportsGrid) {
        reportsGrid.className = `reports-${viewType}`;
    }
}

function changePage(direction) {
    // Implementation for pagination
    showMessage('Pagination coming soon!', 'info');
}

function updateChart(chartType, chartSubType) {
    // Implementation for chart updates
    showMessage('Chart update coming soon!', 'info');
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('reportModal');
    if (event.target === modal) {
        closeModal();
    }
    
    const userMenu = document.getElementById('userMenu');
    if (userMenu && !event.target.closest('.user-profile')) {
        userMenu.classList.remove('show');
    }
}

// Close notifications panel when clicking outside
document.addEventListener('click', function(event) {
    const panel = document.getElementById('notificationsPanel');
    const notificationsBtn = document.querySelector('.notifications');
    
    if (panel && !panel.contains(event.target) && !notificationsBtn.contains(event.target)) {
        panel.classList.remove('show');
    }
});

// Add CSS for additional styles
const additionalStyles = `
    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    }
    
    .message-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .message-error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .message-info {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
    
    .report-details {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .detail-section h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .detail-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .detail-item label {
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .detail-item span {
        color: var(--text-primary);
    }
    
    .photo-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .report-photo {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 10px;
        border: 2px solid var(--border-color);
    }
    
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
    
    .no-results i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--border-color);
    }
    
    .no-results h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .no-results a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 600;
    }
    
    .no-results a:hover {
        text-decoration: underline;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// =============================
// Enhanced Google Sign-In Setup
// =============================
// This augments the existing login page to support Google Identity Services
// when a Client ID is available. If no Client ID is configured, it falls back
// to a demo sign-in that logs in a placeholder Google user so the project is
// usable offline.

(function enhanceAuthWithGoogle() {
    const originalInitLogin = typeof initializeLoginPage === 'function' ? initializeLoginPage : null;
    
    initializeLoginPage = function() {
        if (originalInitLogin) originalInitLogin();
        
        const googleBtn = document.querySelector('.google-btn');
        if (googleBtn && !googleBtn.dataset.bound) {
            googleBtn.dataset.bound = 'true';
            googleBtn.addEventListener('click', signInWithGoogle);
        }
    };
})();

function signInWithGoogle() {
    const clientId = localStorage.getItem('googleClientId');
    
    ensureGoogleScriptLoaded(() => {
        if (window.google && window.google.accounts && window.google.accounts.id && clientId) {
            // Real Google Identity Services sign-in
            try {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleGoogleCredentialResponse,
                });
                // Use the One Tap prompt; if blocked, fall back to button flow
                window.google.accounts.id.prompt((notification) => {
                    if (notification && notification.isNotDisplayed() && notification.getNotDisplayedReason() !== 'suppressed_by_user') {
                        // If One Tap cannot be shown, open the select account popup
                        window.google.accounts.id.prompt();
                    }
                });
            } catch (err) {
                // If GIS init fails, use demo sign-in
                demoGoogleSignin();
            }
        } else {
            // No client ID configured -> demo sign-in
            demoGoogleSignin();
        }
    });
}

function handleGoogleCredentialResponse(response) {
    try {
        // response.credential is a JWT; attempt to decode profile basics
        const payload = decodeJwt(response.credential) || {};
        const givenName = payload.given_name || 'Google';
        const familyName = payload.family_name || 'User';
        const name = payload.name || `${givenName} ${familyName}`.trim();
        const email = payload.email || 'google-user@example.com';
        const picture = payload.picture || `https://via.placeholder.com/40x40/667eea/ffffff?text=${(givenName[0]||'G').toUpperCase()}`;
        
        currentUser = {
            id: payload.sub || Date.now(),
            name,
            email,
            avatar: picture,
            role: 'citizen',
            joinDate: new Date().toISOString().split('T')[0]
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMessage('Signed in with Google successfully!', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
    } catch (e) {
        // Fallback if anything goes wrong
        demoGoogleSignin();
    }
}

function demoGoogleSignin() {
    currentUser = {
        id: Date.now(),
        name: 'Google User',
        email: 'google-user@example.com',
        avatar: 'https://via.placeholder.com/40x40/4285F4/ffffff?text=G',
        role: 'citizen',
        joinDate: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMessage('Signed in with Google (demo mode). To enable real Google Sign-In, set your Client ID.', 'info');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
}

function ensureGoogleScriptLoaded(onload) {
    if (window.google && window.google.accounts && window.google.accounts.id) {
        onload();
        return;
    }
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
        existing.addEventListener('load', onload, { once: true });
        return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = onload;
    document.head.appendChild(s);
}

function decodeJwt(token) {
    try {
        const payload = token.split('.')[1];
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodeURIComponent(escape(json)));
    } catch (e) {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (e2) {
            return null;
        }
    }
}

// Helper to guide configuration in the browser console:
// localStorage.setItem('googleClientId', 'YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com')
// Then click "Continue with Google" again.
