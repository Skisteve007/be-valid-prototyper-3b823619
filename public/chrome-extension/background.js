// SYNTH™ Chrome Extension - Background Service Worker
// Handles context menus, prefill API, and message passing

const SYNTH_API_BASE = 'https://csfwfxkuyapfakrmhgjh.supabase.co/functions/v1';
const SYNTH_APP_URL = 'https://csfwfxkuyapfakrmhgjh.lovableproject.com';

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'send-to-synth',
    title: 'Send to SYNTH™',
    contexts: ['selection']
  });
  
  console.log('[SYNTH] Extension installed, context menu created');
});

// Handle context menu clicks - Send to Synth
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'send-to-synth' && info.selectionText) {
    console.log('[SYNTH] Sending selection to Synth:', info.selectionText.substring(0, 50) + '...');
    
    const prefillData = {
      url: tab?.url || '',
      title: tab?.title || '',
      selected_text: info.selectionText,
      timestamp: Date.now()
    };
    
    try {
      // Get session from storage
      const result = await chrome.storage.local.get(['synthSession']);
      const session = result.synthSession;
      
      if (!session?.access_token) {
        // No session - store data and redirect to login
        await chrome.storage.local.set({ pendingPrefill: prefillData });
        chrome.tabs.create({ 
          url: `${SYNTH_APP_URL}/auth?redirect=/synth/senate&prefill=pending`
        });
        return;
      }
      
      // Create prefill via API
      const response = await fetch(`${SYNTH_API_BASE}/synth-prefill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'create',
          ...prefillData
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.prefill_id) {
        // Open Synth Senate with prefill
        chrome.tabs.create({ 
          url: `${SYNTH_APP_URL}/synth/senate?prefill_id=${data.prefill_id}`
        });
      } else {
        throw new Error('No prefill_id returned');
      }
      
    } catch (error) {
      console.error('[SYNTH] Error:', error);
      // Fallback: store locally and open anyway
      await chrome.storage.local.set({ pendingPrefill: prefillData });
      chrome.tabs.create({ 
        url: `${SYNTH_APP_URL}/synth/senate?prefill=local`
      });
    }
  }
});

// Handle messages from popup/sidepanel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SELECTION') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => window.getSelection()?.toString() || ''
          });
          sendResponse({ 
            selection: results[0]?.result || '',
            url: tabs[0].url,
            title: tabs[0].title
          });
        } catch (err) {
          console.error('[SYNTH] Failed to get selection:', err);
          sendResponse({ selection: '', url: '', title: '' });
        }
      } else {
        sendResponse({ selection: '', url: '', title: '' });
      }
    });
    return true; // Keep channel open for async response
  }
  
  if (message.type === 'GET_PENDING_PREFILL') {
    chrome.storage.local.get(['pendingPrefill'], (result) => {
      sendResponse({ prefill: result.pendingPrefill || null });
      // Clear pending after retrieval
      chrome.storage.local.remove(['pendingPrefill']);
    });
    return true;
  }
  
  if (message.type === 'SESSION_UPDATE') {
    chrome.storage.local.set({ synthSession: message.session });
    sendResponse({ success: true });
    return false;
  }
  
  if (message.type === 'OPEN_DOSSIER') {
    chrome.tabs.create({ url: message.url });
    sendResponse({ success: true });
    return false;
  }
});
