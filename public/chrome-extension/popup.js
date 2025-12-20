// SYNTH™ Chrome Extension - Popup Logic
const SYNTH_API_BASE = 'https://csfwfxkuyapfakrmhgjh.supabase.co/functions/v1';
const SYNTH_WEB_BASE = 'https://bevalid.app';

// State
let state = {
  consented: false,
  authToken: null,
  entitlement: null,
  currentRun: null,
  sourceUrl: '',
  sourceTitle: ''
};

// DOM Elements
const elements = {
  consentModal: document.getElementById('consent-modal'),
  consentCheckbox: document.getElementById('consent-checkbox'),
  consentAccept: document.getElementById('consent-accept'),
  mainInterface: document.getElementById('main-interface'),
  templateSelect: document.getElementById('template-select'),
  inputText: document.getElementById('input-text'),
  charCount: document.getElementById('char-count'),
  sourceUrl: document.getElementById('source-url'),
  runButton: document.getElementById('run-button'),
  resultsSection: document.getElementById('results-section'),
  lockedSection: document.getElementById('locked-section'),
  loadingOverlay: document.getElementById('loading-overlay'),
  userTier: document.getElementById('user-tier'),
  runsRemaining: document.getElementById('runs-remaining'),
  statusText: document.getElementById('status-text'),
  resultTier: document.getElementById('result-tier'),
  resultPercentile: document.getElementById('result-percentile'),
  synthIndex: document.getElementById('synth-index'),
  copyOutput: document.getElementById('copy-output'),
  viewDossier: document.getElementById('view-dossier'),
  radarChart: document.getElementById('radar-chart'),
  trendChart: document.getElementById('trend-chart')
};

// Initialize
async function init() {
  // Check consent
  const { synthConsent } = await chrome.storage.local.get(['synthConsent']);
  state.consented = !!synthConsent;
  
  if (!state.consented) {
    showConsentModal();
  } else {
    await showMainInterface();
  }
  
  setupEventListeners();
}

function showConsentModal() {
  elements.consentModal.classList.remove('hidden');
  elements.mainInterface.classList.add('hidden');
}

async function showMainInterface() {
  elements.consentModal.classList.add('hidden');
  elements.mainInterface.classList.remove('hidden');
  
  // Check for pending selection from context menu
  chrome.runtime.sendMessage({ type: 'GET_PENDING_SELECTION' }, (pending) => {
    if (pending && Date.now() - pending.timestamp < 60000) {
      elements.inputText.value = pending.text;
      state.sourceUrl = pending.url;
      state.sourceTitle = pending.title;
      updateInputMeta();
    }
  });
  
  // Get current tab selection
  chrome.runtime.sendMessage({ type: 'GET_SELECTION' }, (response) => {
    if (response && response.selection && !elements.inputText.value) {
      elements.inputText.value = response.selection;
      state.sourceUrl = response.url;
      state.sourceTitle = response.title;
      updateInputMeta();
    }
  });
  
  // Check auth and entitlement
  await checkAuthStatus();
}

function setupEventListeners() {
  // Consent
  elements.consentCheckbox.addEventListener('change', () => {
    elements.consentAccept.disabled = !elements.consentCheckbox.checked;
  });
  
  elements.consentAccept.addEventListener('click', async () => {
    await chrome.storage.local.set({ synthConsent: true });
    state.consented = true;
    await showMainInterface();
  });
  
  // Input
  elements.inputText.addEventListener('input', updateInputMeta);
  
  // Run button
  elements.runButton.addEventListener('click', runSynth);
  
  // Copy output
  elements.copyOutput.addEventListener('click', copyOutput);
  
  // View dossier
  elements.viewDossier.addEventListener('click', viewDossier);
  
  // Pass buttons
  document.querySelectorAll('.pass-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pass = btn.dataset.pass;
      window.open(`${SYNTH_WEB_BASE}/synth/pricing?plan=${pass}`, '_blank');
    });
  });
}

function updateInputMeta() {
  const text = elements.inputText.value;
  elements.charCount.textContent = `${text.length} chars`;
  elements.sourceUrl.textContent = state.sourceUrl ? new URL(state.sourceUrl).hostname : '';
  elements.runButton.disabled = text.length < 10;
}

async function checkAuthStatus() {
  const { synthAuthToken } = await chrome.storage.local.get(['synthAuthToken']);
  
  if (!synthAuthToken) {
    elements.statusText.textContent = 'Not logged in';
    elements.userTier.textContent = 'GUEST';
    elements.runsRemaining.textContent = 'Login required';
    return;
  }
  
  state.authToken = synthAuthToken;
  
  try {
    const response = await fetch(`${SYNTH_API_BASE}/synth-check-entitlement`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${synthAuthToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      state.entitlement = data.entitlement;
      updateEntitlementUI(data);
    } else {
      elements.statusText.textContent = 'Session expired';
    }
  } catch (err) {
    console.error('[SYNTH] Auth check failed:', err);
    elements.statusText.textContent = 'Offline';
  }
}

function updateEntitlementUI(data) {
  if (!data.entitlement) {
    elements.lockedSection.classList.remove('hidden');
    elements.resultsSection.classList.add('hidden');
    return;
  }
  
  const { plan, runs_remaining } = data.entitlement;
  
  if (plan === 'trial_24h') {
    elements.userTier.textContent = 'TRIAL';
    elements.runsRemaining.textContent = `${runs_remaining} runs left`;
  } else {
    elements.userTier.textContent = plan.replace('pass_', '').toUpperCase();
    elements.runsRemaining.textContent = 'Unlimited';
  }
  
  elements.statusText.textContent = 'Ready';
}

async function runSynth() {
  const text = elements.inputText.value.trim();
  if (text.length < 10) return;
  
  elements.loadingOverlay.classList.remove('hidden');
  elements.runButton.disabled = true;
  
  try {
    const response = await fetch(`${SYNTH_API_BASE}/synth-run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_id: elements.templateSelect.value,
        input_text: text,
        source_url: state.sourceUrl,
        client_meta: {
          page_title: state.sourceTitle,
          hostname: state.sourceUrl ? new URL(state.sourceUrl).hostname : null,
          selection_length: text.length,
          source: 'extension'
        },
        ranking_window: '7d' // Default window
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      state.currentRun = result;
      displayResults(result);
    } else {
      const error = await response.json();
      alert(error.error || 'Evaluation failed');
    }
  } catch (err) {
    console.error('[SYNTH] Run failed:', err);
    alert('Network error. Please try again.');
  } finally {
    elements.loadingOverlay.classList.add('hidden');
    elements.runButton.disabled = false;
  }
}

function displayResults(result) {
  elements.resultsSection.classList.remove('hidden');
  elements.lockedSection.classList.add('hidden');
  
  // Update tier and percentile
  elements.resultTier.textContent = result.tier.toUpperCase();
  elements.resultTier.style.color = getTierColor(result.tier);
  elements.resultPercentile.textContent = `Top ${result.percentile}%`;
  
  // Update SYNTH Index
  elements.synthIndex.textContent = Math.round(result.synth_index);
  
  // Draw charts
  drawRadarChart(result.dimension_scores);
  drawTrendChart(result.trend?.points || [result.synth_index]);
  
  // Update runs remaining
  if (state.entitlement?.plan === 'trial_24h') {
    const remaining = (state.entitlement.runs_remaining || 1) - 1;
    elements.runsRemaining.textContent = `${remaining} runs left`;
    state.entitlement.runs_remaining = remaining;
  }
}

function getTierColor(tier) {
  const colors = {
    'Initiate': '#6b7280',
    'Operator': '#22c55e',
    'Architect': '#3b82f6',
    'Oracle': '#a855f7',
    'Apex': '#f59e0b'
  };
  return colors[tier] || colors['Initiate'];
}

function drawRadarChart(scores) {
  const canvas = elements.radarChart;
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 80;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const dimensions = ['coherence', 'verification', 'constraint_discipline', 'omission_resistance', 'adaptation'];
  const labels = ['COH', 'VER', 'CON', 'OMI', 'ADP'];
  const values = dimensions.map(d => (scores?.[d] || 0) / 100);
  const angles = dimensions.map((_, i) => (Math.PI * 2 * i) / dimensions.length - Math.PI / 2);
  
  // Draw grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  
  for (let r = 0.2; r <= 1; r += 0.2) {
    ctx.beginPath();
    angles.forEach((angle, i) => {
      const x = centerX + Math.cos(angle) * radius * r;
      const y = centerY + Math.sin(angle) * radius * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  }
  
  // Draw axes
  angles.forEach((angle) => {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    ctx.stroke();
  });
  
  // Draw data
  ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  angles.forEach((angle, i) => {
    const x = centerX + Math.cos(angle) * radius * values[i];
    const y = centerY + Math.sin(angle) * radius * values[i];
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Draw labels
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '10px Inter';
  ctx.textAlign = 'center';
  
  angles.forEach((angle, i) => {
    const x = centerX + Math.cos(angle) * (radius + 15);
    const y = centerY + Math.sin(angle) * (radius + 15);
    ctx.fillText(labels[i], x, y + 3);
  });
}

function drawTrendChart(points) {
  const canvas = elements.trendChart;
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (points.length < 2) {
    // Draw single point
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  
  const padding = 10;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;
  
  const maxVal = Math.max(...points, 100);
  const minVal = Math.min(...points, 0);
  const range = maxVal - minVal || 1;
  
  // Draw line
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  points.forEach((val, i) => {
    const x = padding + (i / (points.length - 1)) * width;
    const y = padding + height - ((val - minVal) / range) * height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  
  ctx.stroke();
  
  // Draw points
  ctx.fillStyle = '#00d4ff';
  points.forEach((val, i) => {
    const x = padding + (i / (points.length - 1)) * width;
    const y = padding + height - ((val - minVal) / range) * height;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

async function copyOutput() {
  if (!state.currentRun) return;
  
  const output = `SYNTH™ Evaluation Results
━━━━━━━━━━━━━━━━━━━━━━━━━
Tier: ${state.currentRun.tier}
Percentile: Top ${state.currentRun.percentile}%
SYNTH Index: ${Math.round(state.currentRun.synth_index)}

Dimensions:
• Coherence: ${state.currentRun.dimension_scores?.coherence || 0}
• Verification: ${state.currentRun.dimension_scores?.verification || 0}
• Constraint Discipline: ${state.currentRun.dimension_scores?.constraint_discipline || 0}
• Omission Resistance: ${state.currentRun.dimension_scores?.omission_resistance || 0}
• Adaptation: ${state.currentRun.dimension_scores?.adaptation || 0}

━━━━━━━━━━━━━━━━━━━━━━━━━
Powered by SYNTH Board (proprietary multi-judge frontier evaluation)
Full Dossier: ${SYNTH_WEB_BASE}/synth/dossier
`;
  
  await navigator.clipboard.writeText(output);
  elements.copyOutput.textContent = '✓ Copied!';
  setTimeout(() => {
    elements.copyOutput.innerHTML = '<span>📋</span> Copy SYNTH Output';
  }, 2000);
}

function viewDossier() {
  const runId = state.currentRun?.run_id || '';
  window.open(`${SYNTH_WEB_BASE}/synth/dossier${runId ? `?run=${runId}` : ''}`, '_blank');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
