// Audits Page JavaScript

let allAudits = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAudits();
    
    // Event Listeners
    document.getElementById('refreshBtn')?.addEventListener('click', loadAudits);
    document.getElementById('exportBtn')?.addEventListener('click', exportAudits);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterAudits();
        });
    });
});

// Load Audits
async function loadAudits() {
    try {
        allAudits = await api.get('/api/audits');
        filterAudits();
        updateStats();
    } catch (error) {
        console.error('Load audits error:', error);
        showToast('Failed to load audits', 'error');
    }
}

// Filter Audits
function filterAudits() {
    let filtered = [...allAudits];
    
    // Apply risk level filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(audit => {
            const riskLevel = audit.result?.risk_level || '';
            return riskLevel.toLowerCase() === currentFilter;
        });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => {
        return new Date(b.started_at) - new Date(a.started_at);
    });
    
    displayAudits(filtered);
}

// Display Audits
function displayAudits(audits) {
    const container = document.getElementById('auditsGrid');
    
    if (!audits || audits.length === 0) {
        container.innerHTML = `
            <div class="col-span-full">
                <div class="empty-state">
                    <i class="fas fa-clipboard-check fa-3x"></i>
                    <p>No audits found</p>
                    <small>Run security audits on networks to see results here</small>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = audits.map(audit => {
        const result = audit.result || {};
        const issues = result.issues || [];
        
        return `
            <div class="audit-card" onclick="viewAuditDetails('${audit.id}')">
                <div class="audit-card-header">
                    <div>
                        <h3><i class="fas fa-shield-alt"></i> ${audit.network_bssid}</h3>
                        <small><i class="fas fa-clock"></i> ${formatDate(audit.started_at)}</small>
                    </div>
                    ${getRiskBadge(result.risk_level)}
                </div>
                <div class="audit-card-body">
                    <div class="audit-stat">
                        <span class="stat-label">Status:</span>
                        <span class="stat-value">
                            <span class="badge badge-${audit.status === 'completed' ? 'success' : 'warning'}">
                                ${audit.status || 'Unknown'}
                            </span>
                        </span>
                    </div>
                    <div class="audit-stat">
                        <span class="stat-label">Issues Found:</span>
                        <span class="stat-value">${issues.length}</span>
                    </div>
                    <div class="audit-stat">
                        <span class="stat-label">Score:</span>
                        <span class="stat-value">${result.score || 0}/100</span>
                    </div>
                    ${result.encryption ? `
                        <div class="audit-stat">
                            <span class="stat-label">Encryption:</span>
                            <span class="stat-value">${getEncryptionBadge(result.encryption)}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="audit-card-footer">
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); viewAuditDetails('${audit.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Update results count
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = `Showing ${audits.length} audit${audits.length !== 1 ? 's' : ''}`;
    }
}

// View Audit Details
async function viewAuditDetails(auditId) {
    try {
        const audit = allAudits.find(a => a.id === auditId);
        
        if (!audit) {
            showToast('Audit not found', 'error');
            return;
        }

        const result = audit.result || {};
        const issues = result.issues || [];
        const recommendations = result.recommendations || [];

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="display: grid; gap: 1.5rem;">
                <!-- Overview -->
                <div class="detail-group">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary);">
                        <i class="fas fa-info-circle"></i> Audit Overview
                    </h4>
                    <div style="display: grid; gap: 0.75rem; padding-left: 1rem;">
                        <div>
                            <strong>Network BSSID:</strong> ${audit.network_bssid}
                        </div>
                        <div>
                            <strong>Status:</strong> 
                            <span class="badge badge-${audit.status === 'completed' ? 'success' : 'warning'}">
                                ${audit.status || 'Unknown'}
                            </span>
                        </div>
                        <div>
                            <strong>Risk Level:</strong> ${getRiskBadge(result.risk_level)}
                        </div>
                        <div>
                            <strong>Security Score:</strong> 
                            <span style="font-size: 1.25rem; font-weight: bold; color: var(--primary);">
                                ${result.score || 0}/100
                            </span>
                        </div>
                        ${result.encryption ? `
                            <div>
                                <strong>Encryption:</strong> ${getEncryptionBadge(result.encryption)}
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Timing -->
                <div class="detail-group">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary);">
                        <i class="fas fa-clock"></i> Timing Information
                    </h4>
                    <div style="display: grid; gap: 0.75rem; padding-left: 1rem;">
                        <div>
                            <strong>Started:</strong> ${formatDate(audit.started_at)}
                        </div>
                        <div>
                            <strong>Completed:</strong> ${formatDate(audit.completed_at)}
                        </div>
                    </div>
                </div>
                
                <!-- Issues -->
                <div class="detail-group">
                    <h4 style="margin-bottom: 0.5rem; color: var(--${issues.length > 0 ? 'danger' : 'success'});">
                        <i class="fas fa-exclamation-triangle"></i> Issues Found (${issues.length})
                    </h4>
                    <div style="padding-left: 1rem;">
                        ${issues.length > 0 ? `
                            <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem;">
                                ${issues.map(issue => `
                                    <li style="padding: 0.5rem; background: rgba(239, 68, 68, 0.1); border-left: 3px solid var(--danger); border-radius: 0.25rem;">
                                        <i class="fas fa-times-circle" style="color: var(--danger);"></i> ${issue}
                                    </li>
                                `).join('')}
                            </ul>
                        ` : `
                            <p style="color: var(--success);">
                                <i class="fas fa-check-circle"></i> No security issues detected
                            </p>
                        `}
                    </div>
                </div>
                
                <!-- Recommendations -->
                ${recommendations.length > 0 ? `
                    <div class="detail-group">
                        <h4 style="margin-bottom: 0.5rem; color: var(--warning);">
                            <i class="fas fa-lightbulb"></i> Recommendations (${recommendations.length})
                        </h4>
                        <div style="padding-left: 1rem;">
                            <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem;">
                                ${recommendations.map(rec => `
                                    <li style="padding: 0.5rem; background: rgba(245, 158, 11, 0.1); border-left: 3px solid var(--warning); border-radius: 0.25rem;">
                                        <i class="fas fa-arrow-right" style="color: var(--warning);"></i> ${rec}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        openModal('auditModal');
    } catch (error) {
        console.error('View details error:', error);
    }
}

// Update Stats
function updateStats() {
    const stats = {
        total: allAudits.length,
        high: 0,
        medium: 0,
        low: 0
    };
    
    allAudits.forEach(audit => {
        const riskLevel = audit.result?.risk_level || '';
        const risk = riskLevel.toLowerCase();
        if (risk === 'high') {
            stats.high++;
        } else if (risk === 'medium') {
            stats.medium++;
        } else if (risk === 'low') {
            stats.low++;
        }
    });
    
    document.getElementById('totalAudits').textContent = stats.total;
    document.getElementById('highRisk').textContent = stats.high;
    document.getElementById('mediumRisk').textContent = stats.medium;
    document.getElementById('lowRisk').textContent = stats.low;
    
    // Update filter counts
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const filter = btn.dataset.filter;
        const countSpan = btn.querySelector('.count');
        if (countSpan) {
            if (filter === 'all') {
                countSpan.textContent = stats.total;
            } else {
                countSpan.textContent = stats[filter] || 0;
            }
        }
    });
}

// Export Audits
async function exportAudits() {
    try {
        showLoading();
        
        // Get export format from user
        const format = 'json'; // Default to JSON, could add UI for CSV
        
        const data = await api.get(`/api/audits/export?format=${format}`);
        
        // Trigger download
        exportData(data, format, 'audits');
        
        showToast('Audits exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
    } finally {
        hideLoading();
    }
}
