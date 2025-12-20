// SYNTH™ Chrome Extension - Background Service Worker
// Handles context menus and message passing

const SYNTH_API_BASE = 'https://csfwfxkuyapfakrmhgjh.supabase.co/functions/v1';

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'synth-run',
    title: 'Run SYNTH on selected text',
    contexts: ['selection']
  });
  
  console.log('[SYNTH] Extension installed, context menu created');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'synth-run' && info.selectionText) {
    console.log('[SYNTH] Context menu triggered with selection:', info.selectionText.substring(0, 50) + '...');
    
    // Store selection for popup
    await chrome.storage.local.set({
      pendingSelection: {
        text: info.selectionText,
        url: tab?.url || '',
        title: tab?.title || '',
        timestamp: Date.now()
      }
    });
    
    // Open popup
    chrome.action.openPopup();
  }
});

// Handle messages from popup
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
  
  if (message.type === 'GET_PENDING_SELECTION') {
    chrome.storage.local.get(['pendingSelection'], (result) => {
      sendResponse(result.pendingSelection || null);
      // Clear pending after retrieval
      chrome.storage.local.remove(['pendingSelection']);
    });
    return true;
  }
  
  if (message.type === 'OPEN_DOSSIER') {
    chrome.tabs.create({ url: message.url });
    sendResponse({ success: true });
    return false;
  }
});
