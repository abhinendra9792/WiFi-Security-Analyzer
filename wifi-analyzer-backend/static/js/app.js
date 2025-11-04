// API Configuration
const API_BASE_URL = 'http://127.0.0.1:5000';
const API_TOKEN = 'mysecrettoken';

// API Helper Functions
const api = {
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
    },

    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: this.headers
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            showToast('Failed to fetch data', 'error');
            throw error;
        }
    },

    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            showToast('Failed to send data', 'error');
            throw error;
        }
    }
};

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Get Signal Strength Bars
function getSignalBars(signal) {
    const strength = Math.abs(signal);
    let bars = 0;
    if (strength < 50) bars = 4;
    else if (strength < 60) bars = 3;
    else if (strength < 70) bars = 2;
    else bars = 1;

    const heights = ['6px', '10px', '14px', '18px'];
    let html = '<div class="signal-bars">';
    for (let i = 0; i < 4; i++) {
        const activeClass = i < bars ? 'active' : '';
        html += `<div class="signal-bar ${activeClass}" style="height: ${heights[i]}"></div>`;
    }
    html += '</div>';
    return html;
}

// Get Encryption Badge
function getEncryptionBadge(encryption) {
    if (!encryption) return '<span class="network-badge badge-open">Unknown</span>';
    
    const type = encryption.toUpperCase();
    if (type.includes('OPEN') || type === 'NONE') {
        return '<span class="network-badge badge-open">Open</span>';
    } else if (type.includes('WPA3')) {
        return '<span class="network-badge badge-secure">WPA3</span>';
    } else if (type.includes('WPA2')) {
        return '<span class="network-badge badge-vulnerable">WPA2</span>';
    } else if (type.includes('WPA')) {
        return '<span class="network-badge badge-vulnerable">WPA</span>';
    } else if (type.includes('WEP')) {
        return '<span class="network-badge badge-open">WEP</span>';
    }
    return `<span class="network-badge badge-vulnerable">${encryption}</span>`;
}

// Get Risk Badge
function getRiskBadge(riskLevel) {
    const badges = {
        'low': '<span class="network-badge badge-secure">Low Risk</span>',
        'medium': '<span class="network-badge badge-vulnerable">Medium Risk</span>',
        'high': '<span class="network-badge badge-open">High Risk</span>'
    };
    return badges[riskLevel?.toLowerCase()] || badges['medium'];
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize modals
document.addEventListener('DOMContentLoaded', () => {
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modals on close button click
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
});

// Loading Overlay
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Export data
async function exportData(format = 'json') {
    try {
        const response = await fetch(`${API_BASE_URL}/api/audits/export?format=${format}`, {
            headers: api.headers
        });
        
        if (!response.ok) throw new Error('Export failed');
        
        if (format === 'csv') {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audits_${Date.now()}.csv`;
            a.click();
            showToast('Export successful!', 'success');
        } else {
            const data = await response.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audits_${Date.now()}.json`;
            a.click();
            showToast('Export successful!', 'success');
        }
    } catch (error) {
        console.error('Export error:', error);
        showToast('Export failed', 'error');
    }
}
