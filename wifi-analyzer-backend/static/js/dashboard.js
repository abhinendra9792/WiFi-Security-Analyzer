// Dashboard JavaScript

let encryptionChart = null;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard JS loaded');
    
    // Check if elements exist
    const scanBtn = document.getElementById('scanBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    
    console.log('Scan button found:', scanBtn !== null);
    console.log('Refresh button found:', refreshBtn !== null);
    
    initializeDashboard();
    
    // Event Listeners
    if (scanBtn) {
        scanBtn.addEventListener('click', startScan);
        console.log('Scan button listener attached');
    } else {
        console.error('Scan button not found!');
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadNetworks);
    }
});

async function initializeDashboard() {
    await loadNetworks();
    await loadRecentAudits();
    updateStats();
}

// Start Network Scan
async function startScan() {
    showLoading();
    try {
        const data = await api.post('/api/networks/scan');
        showToast(`Found ${data.found} networks!`, 'success');
        await loadNetworks();
    } catch (error) {
        console.error('Scan error:', error);
    } finally {
        hideLoading();
    }
}

// Load Networks
async function loadNetworks() {
    try {
        const networks = await api.get('/api/networks');
        displayNetworks(networks);
        updateStats(networks);
        updateChart(networks);
    } catch (error) {
        console.error('Load networks error:', error);
    }
}

// Display Networks
function displayNetworks(networks) {
    const container = document.getElementById('networksList');
    
    if (!networks || networks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-satellite-dish fa-3x"></i>
                <p>No networks scanned yet</p>
                <small>Click "Start Scan" to discover nearby WiFi networks</small>
            </div>
        `;
        return;
    }

    container.innerHTML = networks.map(network => `
        <div class="network-item" onclick="viewNetworkDetails('${network.id}')">
            <div class="network-info">
                <div class="network-name">
                    <i class="fas fa-wifi"></i> ${network.ssid || 'Hidden Network'}
                </div>
                <div class="network-details">
                    <span><i class="fas fa-hashtag"></i> Ch ${network.channel || 'N/A'}</span>
                    <span><i class="fas fa-network-wired"></i> ${network.bssid}</span>
                    <span>${getSignalBars(network.signal)} ${network.signal} dBm</span>
                </div>
            </div>
            <div>
                ${getEncryptionBadge(network.encryption)}
            </div>
        </div>
    `).join('');
}

// View Network Details
async function viewNetworkDetails(networkId) {
    try {
        const networks = await api.get('/api/networks');
        const network = networks.find(n => n.id === networkId);
        
        if (!network) {
            showToast('Network not found', 'error');
            return;
        }

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                <div>
                    <strong>SSID:</strong> ${network.ssid || 'Hidden'}
                </div>
                <div>
                    <strong>BSSID:</strong> ${network.bssid}
                </div>
                <div>
                    <strong>Channel:</strong> ${network.channel}
                </div>
                <div>
                    <strong>Signal Strength:</strong> ${network.signal} dBm
                </div>
                <div>
                    <strong>Encryption:</strong> ${getEncryptionBadge(network.encryption)}
                </div>
                <div>
                    <strong>Discovered:</strong> ${formatDate(network.discovered_at)}
                </div>
            </div>
        `;

        // Set up audit button
        const auditBtn = document.getElementById('auditNetworkBtn');
        auditBtn.onclick = () => startAudit(network.bssid);

        openModal('networkModal');
    } catch (error) {
        console.error('View details error:', error);
    }
}

// Start Audit
async function startAudit(bssid) {
    try {
        showLoading();
        const result = await api.post(`/api/audits/start/${bssid}`);
        closeModal('networkModal');
        showToast('Audit completed successfully!', 'success');
        await loadRecentAudits();
    } catch (error) {
        console.error('Audit error:', error);
    } finally {
        hideLoading();
    }
}

// Load Recent Audits
async function loadRecentAudits() {
    try {
        const audits = await api.get('/api/audits');
        const container = document.getElementById('recentAudits');
        
        if (!audits || audits.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-check fa-3x"></i>
                    <p>No audits performed yet</p>
                </div>
            `;
            return;
        }

        // Show only last 5 audits
        const recentAudits = audits.slice(-5).reverse();
        
        container.innerHTML = recentAudits.map(audit => {
            const result = audit.result || {};
            return `
                <div class="network-item">
                    <div class="network-info">
                        <div class="network-name">
                            <i class="fas fa-shield-alt"></i> ${audit.network_bssid}
                        </div>
                        <div class="network-details">
                            <span><i class="fas fa-clock"></i> ${formatDate(audit.started_at)}</span>
                        </div>
                    </div>
                    <div>
                        ${getRiskBadge(result.risk_level)}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Load audits error:', error);
    }
}

// Update Stats
function updateStats(networks = []) {
    const stats = {
        total: networks.length,
        secure: 0,
        vulnerable: 0,
        open: 0
    };

    networks.forEach(network => {
        const enc = (network.encryption || '').toUpperCase();
        if (enc.includes('WPA3')) {
            stats.secure++;
        } else if (enc.includes('OPEN') || !enc) {
            stats.open++;
        } else {
            stats.vulnerable++;
        }
    });

    document.getElementById('totalNetworks').textContent = stats.total;
    document.getElementById('secureNetworks').textContent = stats.secure;
    document.getElementById('vulnerableNetworks').textContent = stats.vulnerable;
    document.getElementById('openNetworks').textContent = stats.open;
}

// Update Chart
function updateChart(networks = []) {
    const encryptionTypes = {};
    
    networks.forEach(network => {
        const type = network.encryption || 'Unknown';
        encryptionTypes[type] = (encryptionTypes[type] || 0) + 1;
    });

    const ctx = document.getElementById('encryptionChart');
    if (!ctx) return;

    // Destroy existing chart
    if (encryptionChart) {
        encryptionChart.destroy();
    }

    // Create new chart
    encryptionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(encryptionTypes),
            datasets: [{
                data: Object.values(encryptionTypes),
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#1a1a2e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#e4e4e7',
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}
