// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Helper Functions
class API {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Make authenticated API request
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication API
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async loginWithGoogle(idToken) {
    const response = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken })
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Issues API
  async getIssues(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/issues?${queryString}`);
  }

  async getIssue(id) {
    return await this.request(`/issues/${id}`);
  }

  async createIssue(issueData) {
    // If there are photos, use FormData for multipart upload
    if (issueData.photos && issueData.photos.length > 0) {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', issueData.title);
      formData.append('description', issueData.description);
      formData.append('type', issueData.type);
      formData.append('severity', issueData.severity);
      formData.append('location', issueData.location);
      if (issueData.latitude) formData.append('latitude', issueData.latitude);
      if (issueData.longitude) formData.append('longitude', issueData.longitude);
      
      // Add photos
      issueData.photos.forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Create issue failed');
      }

      return await response.json();
    } else {
      // No photos, use regular JSON request
      return await this.request('/issues', {
        method: 'POST',
        body: JSON.stringify(issueData)
      });
    }
  }

  async updateIssueStatus(id, statusData) {
    return await this.request(`/issues/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    });
  }

  async addComment(issueId, comment) {
    return await this.request(`/issues/${issueId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment)
    });
  }

  async getMyIssues() {
    return await this.request('/issues/user/my-issues');
  }

  // Analytics API
  async getDashboardStats() {
    return await this.request('/analytics/dashboard');
  }

  async getIssuesByType() {
    return await this.request('/analytics/issues-by-type');
  }

  async getIssuesBySeverity() {
    return await this.request('/analytics/issues-by-severity');
  }

  async getIssuesOverTime(period = '30d') {
    return await this.request(`/analytics/issues-over-time?period=${period}`);
  }

  async getTopReporters(limit = 10) {
    return await this.request(`/analytics/top-reporters?limit=${limit}`);
  }

  // File Upload API
  async uploadIssuePhotos(issueId, files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    const response = await fetch(`${API_BASE_URL}/upload/issue/${issueId}/photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return await response.json();
  }

  async getIssuePhotos(issueId) {
    return await this.request(`/upload/issue/${issueId}/photos`);
  }

  async deletePhoto(photoId) {
    return await this.request(`/upload/photo/${photoId}`, {
      method: 'DELETE'
    });
  }

  // Notifications API
  async getNotifications(userId) {
    return await this.request(`/users/${userId}/notifications`);
  }

  async markNotificationRead(userId, notificationId) {
    return await this.request(`/users/${userId}/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
  }

  async markAllNotificationsRead(userId) {
    return await this.request(`/users/${userId}/notifications/read-all`, {
      method: 'PUT'
    });
  }
}

// Create global API instance
const api = new API();

// Update existing functions to use API
async function loginUser(email, password) {
  try {
    const response = await api.login(email, password);
    currentUser = response.user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return response;
  } catch (error) {
    throw error;
  }
}

async function registerUser(userData) {
  try {
    const response = await api.register(userData);
    currentUser = response.user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return response;
  } catch (error) {
    throw error;
  }
}

async function loadDashboardData() {
  try {
    const stats = await api.getDashboardStats();
    updateDashboardStats(stats);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

async function loadReportsData() {
  try {
    const response = await api.getIssues();
    updateReportsDisplay(response.issues);
  } catch (error) {
    console.error('Error loading reports data:', error);
  }
}

async function loadAnalyticsData() {
  try {
    const [dashboardStats, issuesByType, issuesBySeverity, issuesOverTime] = await Promise.all([
      api.getDashboardStats(),
      api.getIssuesByType(),
      api.getIssuesBySeverity(),
      api.getIssuesOverTime()
    ]);
    
    updateAnalyticsDisplay(dashboardStats, issuesByType, issuesBySeverity, issuesOverTime);
  } catch (error) {
    console.error('Error loading analytics data:', error);
  }
}

async function submitIssue(issueData) {
  try {
    // The createIssue method now handles photos directly
    const response = await api.createIssue(issueData);
    return response;
  } catch (error) {
    throw error;
  }
}

// Update dashboard stats display
function updateDashboardStats(stats) {
  const elements = {
    totalReports: document.getElementById('totalReports'),
    resolvedReports: document.getElementById('resolvedReports'),
    inProgressReports: document.getElementById('inProgressReports'),
    communityRating: document.getElementById('communityRating')
  };

  if (elements.totalReports) elements.totalReports.textContent = stats.totalReports || 0;
  if (elements.resolvedReports) elements.resolvedReports.textContent = stats.resolved || 0;
  if (elements.inProgressReports) elements.inProgressReports.textContent = stats.inProgress || 0;
  if (elements.communityRating) elements.communityRating.textContent = stats.resolutionRate ? stats.resolutionRate.toFixed(1) : '0.0';
}

// Update reports display
function updateReportsDisplay(issues) {
  // This would update the reports grid with the fetched issues
  console.log('Reports loaded:', issues);
}

// Update analytics display
function updateAnalyticsDisplay(dashboardStats, issuesByType, issuesBySeverity, issuesOverTime) {
  // This would update the analytics charts and metrics
  console.log('Analytics loaded:', { dashboardStats, issuesByType, issuesBySeverity, issuesOverTime });
}

// Export API for use in other scripts
window.API = api;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.loadDashboardData = loadDashboardData;
window.loadReportsData = loadReportsData;
window.loadAnalyticsData = loadAnalyticsData;
window.submitIssue = submitIssue;
