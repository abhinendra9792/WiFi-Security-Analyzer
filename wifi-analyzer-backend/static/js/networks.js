// Networks Page JavaScript

let allNetworks = [];
let currentFilter = 'all';
let currentSort = 'signal';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadNetworks();
    
    // Event Listeners
    document.getElementById('scanBtn')?.addEventListener('click', startScan);
    document.getElementById('refreshBtn')?.addEventListener('click', loadNetworks);
    document.getElementById('searchInput')?.addEventListener('input', filterNetworks);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterNetworks();
        });
    });
    
    // Sort select
    document.getElementById('sortSelect')?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterNetworks();
    });
});

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
        allNetworks = await api.get('/api/networks');
        filterNetworks();
        updateFilterCounts();
    } catch (error) {
        console.error('Load networks error:', error);
        showToast('Failed to load networks', 'error');
    }
}

// Filter Networks
function filterNetworks() {
    let filtered = [...allNetworks];
    
    // Apply encryption filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(network => {
            const enc = (network.encryption || '').toUpperCase();
            switch(currentFilter) {
                case 'secure':
                    return enc.includes('WPA3');
                case 'wpa2':
                    return enc.includes('WPA2') && !enc.includes('WPA3');
                case 'wpa':
                    return enc.includes('WPA') && !enc.includes('WPA2') && !enc.includes('WPA3');
                case 'wep':
                    return enc.includes('WEP');
                case 'open':
                    return enc.includes('OPEN') || !enc;
                default:
                    return true;
            }
        });
    }
    
    // Apply search filter
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (searchTerm) {
        filtered = filtered.filter(network => 
            (network.ssid || '').toLowerCase().includes(searchTerm) ||
            (network.bssid || '').toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
        switch(currentSort) {
            case 'signal':
                return (b.signal || -100) - (a.signal || -100);
            case 'ssid':
                return (a.ssid || '').localeCompare(b.ssid || '');
            case 'channel':
                return (a.channel || 0) - (b.channel || 0);
            case 'encryption':
                return (a.encryption || '').localeCompare(b.encryption || '');
            default:
                return 0;
        }
    });
    
    displayNetworks(filtered);
}

// Display Networks
function displayNetworks(networks) {
    const container = document.getElementById('networksGrid');
    
    if (!networks || networks.length === 0) {
        container.innerHTML = `
            <div class="col-span-full">
                <div class="empty-state">
                    <i class="fas fa-satellite-dish fa-3x"></i>
                    <p>No networks found</p>
                    <small>Try scanning or adjusting your filters</small>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = networks.map(network => `
        <div class="network-card" onclick="viewNetworkDetails('${network.id}')">
            <div class="network-card-header">
                <h3><i class="fas fa-wifi"></i> ${network.ssid || 'Hidden Network'}</h3>
                ${getEncryptionBadge(network.encryption)}
            </div>
            <div class="network-card-body">
                <div class="network-stat">
                    <span class="stat-label">BSSID:</span>
                    <span class="stat-value">${network.bssid}</span>
                </div>
                <div class="network-stat">
                    <span class="stat-label">Channel:</span>
                    <span class="stat-value">${network.channel || 'N/A'}</span>
                </div>
                <div class="network-stat">
                    <span class="stat-label">Signal:</span>
                    <span class="stat-value">${getSignalBars(network.signal)} ${network.signal} dBm</span>
                </div>
                <div class="network-stat">
                    <span class="stat-label">Discovered:</span>
                    <span class="stat-value">${formatDate(network.discovered_at)}</span>
                </div>
            </div>
            <div class="network-card-footer">
                <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); startAudit('${network.bssid}')">
                    <i class="fas fa-shield-alt"></i> Run Audit
                </button>
            </div>
        </div>
    `).join('');
    
    // Update results count
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = `Showing ${networks.length} network${networks.length !== 1 ? 's' : ''}`;
    }
}

// View Network Details
async function viewNetworkDetails(networkId) {
    try {
        const network = allNetworks.find(n => n.id === networkId);
        
        if (!network) {
            showToast('Network not found', 'error');
            return;
        }

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="display: grid; gap: 1.5rem;">
                <div class="detail-group">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary);">
                        <i class="fas fa-info-circle"></i> Basic Information
                    </h4>
                    <div style="display: grid; gap: 0.75rem; padding-left: 1rem;">
                        <div>
                            <strong>SSID:</strong> ${network.ssid || 'Hidden Network'}
                        </div>
                        <div>
                            <strong>BSSID:</strong> ${network.bssid}
                        </div>
                        <div>
                            <strong>Channel:</strong> ${network.channel || 'N/A'}
                        </div>
                    </div>
                </div>
                
                <div class="detail-group">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary);">
                        <i class="fas fa-signal"></i> Signal Information
                    </h4>
                    <div style="display: grid; gap: 0.75rem; padding-left: 1rem;">
                        <div>
                            <strong>Signal Strength:</strong> ${network.signal} dBm
                        </div>
                        <div>
                            ${getSignalBars(network.signal)}
                            <span style="margin-left: 0.5rem;">
                                ${getSignalQuality(network.signal)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-group">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary);">
                        <i class="fas fa-lock"></i> Security Information
                    </h4>
                    <div style="display: grid; gap: 0.75rem; padding-left: 1rem;">
                        <div>
                            <strong>Encryption:</strong> ${getEncryptionBadge(network.encryption)}
                        </div>
                        <div>
                            <strong>Security Level:</strong> ${getSecurityLevel(network.encryption)}
                        </div>
                    </div>
                </div>
                
                <div class="detail-group">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary);">
                        <i class="fas fa-clock"></i> Discovery Information
                    </h4>
                    <div style="display: grid; gap: 0.75rem; padding-left: 1rem;">
                        <div>
                            <strong>First Seen:</strong> ${formatDate(network.discovered_at)}
                        </div>
                        <div>
                            <strong>Last Updated:</strong> ${formatDate(network.last_seen)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Set up audit button
        const auditBtn = document.getElementById('auditNetworkBtn');
        auditBtn.onclick = () => {
            startAudit(network.bssid);
            closeModal('networkModal');
        };

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
        showToast('Security audit completed successfully!', 'success');
        await loadNetworks();
    } catch (error) {
        console.error('Audit error:', error);
    } finally {
        hideLoading();
    }
}

// Update Filter Counts
function updateFilterCounts() {
    const counts = {
        all: allNetworks.length,
        secure: 0,
        wpa2: 0,
        wpa: 0,
        wep: 0,
        open: 0
    };
    
    allNetworks.forEach(network => {
        const enc = (network.encryption || '').toUpperCase();
        if (enc.includes('WPA3')) {
            counts.secure++;
        } else if (enc.includes('WPA2')) {
            counts.wpa2++;
        } else if (enc.includes('WPA')) {
            counts.wpa++;
        } else if (enc.includes('WEP')) {
            counts.wep++;
        } else if (enc.includes('OPEN') || !enc) {
            counts.open++;
        }
    });
    
    // Update count badges
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const filter = btn.dataset.filter;
        const countSpan = btn.querySelector('.count');
        if (countSpan && counts[filter] !== undefined) {
            countSpan.textContent = counts[filter];
        }
    });
}

// Helper: Get Signal Quality
function getSignalQuality(signal) {
    if (!signal) return '<span style="color: var(--text-secondary);">Unknown</span>';
    
    if (signal >= -50) {
        return '<span style="color: var(--success);">Excellent</span>';
    } else if (signal >= -60) {
        return '<span style="color: var(--success);">Very Good</span>';
    } else if (signal >= -70) {
        return '<span style="color: var(--warning);">Good</span>';
    } else if (signal >= -80) {
        return '<span style="color: var(--warning);">Fair</span>';
    } else {
        return '<span style="color: var(--danger);">Poor</span>';
    }
}

// Helper: Get Security Level
function getSecurityLevel(encryption) {
    if (!encryption) {
        return '<span style="color: var(--danger);">⚠️ Insecure (No Encryption)</span>';
    }
    
    const enc = encryption.toUpperCase();
    
    if (enc.includes('WPA3')) {
        return '<span style="color: var(--success);">🛡️ Very Secure (WPA3)</span>';
    } else if (enc.includes('WPA2')) {
        return '<span style="color: var(--success);">🔒 Secure (WPA2)</span>';
    } else if (enc.includes('WPA')) {
        return '<span style="color: var(--warning);">⚠️ Moderate (WPA)</span>';
    } else if (enc.includes('WEP')) {
        return '<span style="color: var(--danger);">⚠️ Weak (WEP - Easily Crackable)</span>';
    } else if (enc.includes('OPEN')) {
        return '<span style="color: var(--danger);">⚠️ Insecure (Open Network)</span>';
    } else {
        return '<span style="color: var(--text-secondary);">Unknown</span>';
    }
}
