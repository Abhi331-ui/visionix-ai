/* ============================================================
   Snaptext AI — landing/app.js
   Premium Interactive Browser Extension Simulator Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Pre-configured OCR Data Mockups ────────────────────────
  const OCR_DATA = {
    'text-definition': {
      text: `"The ultimate goal of artificial intelligence research is to build systems that can learn, reason, and act autonomously in complex environments."\n\n— Foundations of Machine Intelligence (1998)`,
      title: 'Foundations of AI Quote',
      type: 'quote',
      thumbnailHTML: `
        <div style="font-family: var(--st-font); color: var(--st-text); padding: 10px 14px; font-style: italic; font-size: 10px; line-height: 1.4; text-align: left; width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; display: flex; flex-direction: column; justify-content: center; background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.12), transparent 85%); border-left: 3px solid var(--st-purple);">
          "The ultimate goal of artificial intelligence..."
          <span style="font-style: normal; font-size: 7.5px; opacity: 0.65; margin-top: 4px;">— Foundations of Machine Intelligence (1998)</span>
        </div>
      `,
      historyHTML: `
        <div class="st-history-card" data-capture-id="capt-definition">
          <div class="st-hist-thumb-placeholder" style="background: rgba(139, 92, 246, 0.12); color: var(--st-purple);">📰</div>
          <div class="st-hist-body">
            <div class="st-hist-label">Foundations of AI Quote</div>
            <div class="st-hist-time">Just now</div>
            <div class="st-hist-preview">"The ultimate goal of artificial intelligence research is to build..."</div>
          </div>
        </div>
      `
    },
    'text-code': {
      text: `import tensorflow as tf\n\n# Build a simple artificial neural network core\nmodel = tf.keras.models.Sequential([\n    tf.keras.layers.Dense(128, activation='relu'),\n    tf.keras.layers.Dropout(0.2),\n    tf.keras.layers.Dense(10, activation='softmax')\n])`,
      title: 'TensorFlow ANN Core Block',
      type: 'code',
      thumbnailHTML: `
        <div style="font-family: var(--st-mono); font-size: 8px; text-align: left; width: 100%; height: 100%; padding: 10px 12px; box-sizing: border-box; background: #060913; overflow: hidden; line-height: 1.35; border-radius: 4px;">
          <span style="color: #8B5CF6; font-weight: 600;">import</span> tensorflow <span style="color: #8B5CF6; font-weight: 600;">as</span> tf<br/>
          model = tf.keras.models.Sequential([<br/>
          &nbsp;&nbsp;tf.keras.layers.Dense(<span style="color:#3B82F6;">128</span>...)
        </div>
      `,
      historyHTML: `
        <div class="st-history-card" data-capture-id="capt-code">
          <div class="st-hist-thumb-placeholder" style="background: rgba(0, 229, 255, 0.12); color: var(--st-cyan);">💻</div>
          <div class="st-hist-body">
            <div class="st-hist-label">TensorFlow ANN Core Block</div>
            <div class="st-hist-time">Just now</div>
            <div class="st-hist-preview">import tensorflow as tf # Build a simple ANN core model...</div>
          </div>
        </div>
      `
    },
    'generic': {
      text: `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. Leading AI textbooks define the field as the study of "intelligent agents".`,
      title: 'Wikipedia AI Definition',
      type: 'generic',
      thumbnailHTML: `
        <div style="font-family: var(--st-font); font-size: 10px; text-align: left; width: 100%; height: 100%; padding: 12px 14px; box-sizing: border-box; background: radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.1), transparent 85%); overflow: hidden; display: flex; align-items: center; color: var(--st-text); line-height: 1.45;">
          "Artificial intelligence (AI) is intelligence demonstrated by machines..."
        </div>
      `,
      historyHTML: `
        <div class="st-history-card" data-capture-id="capt-generic">
          <div class="st-hist-thumb-placeholder" style="background: rgba(37, 99, 235, 0.12); color: var(--st-blue);">🌐</div>
          <div class="st-hist-body">
            <div class="st-hist-label">Wikipedia AI Definition</div>
            <div class="st-hist-time">Just now</div>
            <div class="st-hist-preview">Artificial intelligence (AI) is intelligence demonstrated by machines...</div>
          </div>
        </div>
      `
    }
  };

  // ── Simulator State ─────────────────────────────────────────
  const state = {
    isOverlayActive: false,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    activeTab: 'result', // 'result', 'history', 'settings'
    theme: 'dark', // 'dark', 'light'
    currentCapture: null,
    history: [
      {
        id: 'seed-history-1',
        title: 'Initial TF Neural Network ANN Model',
        text: `import tensorflow as tf\n\n# Build a simple artificial neural network core\nmodel = tf.keras.models.Sequential([\n    tf.keras.layers.Dense(128, activation='relu'),\n    tf.keras.layers.Dropout(0.2),\n    tf.keras.layers.Dense(10, activation='softmax')\n])`,
        type: 'code',
        timeLabel: '2 mins ago',
        thumbnailHTML: `
          <div style="font-family: var(--st-mono); font-size: 8px; text-align: left; width: 100%; height: 100%; padding: 10px 12px; box-sizing: border-box; background: #060913; overflow: hidden; line-height: 1.35; border-radius: 4px;">
            <span style="color: #8B5CF6; font-weight: 600;">import</span> tensorflow <span style="color: #8B5CF6; font-weight: 600;">as</span> tf<br/>
            model = tf.keras.models.Sequential([<br/>
            &nbsp;&nbsp;tf.keras.layers.Dense(<span style="color:#3B82F6;">128</span>...)
          </div>
        `,
        icon: '💻',
        colorClass: 'st-hist-cyan'
      }
    ],
    fabVisible: true,
    ocrLang: 'eng'
  };

  // ── DOM References ──────────────────────────────────────────
  const viewport = document.getElementById('sim-viewport');
  const overlayMask = document.getElementById('sim-overlay-mask');
  const selBox = document.getElementById('sim-sel-box');
  const shutterFlash = document.getElementById('sim-shutter-flash');
  const fabBtn = document.getElementById('sim-fab');
  const sidePanel = document.getElementById('sim-panel');

  // Header Panel Controls
  const btnNew = document.getElementById('sim-btn-new');
  const btnThemeHeader = document.getElementById('sim-btn-theme');
  const btnClose = document.getElementById('sim-btn-close');

  // Tabs
  const tabs = document.querySelectorAll('.st-tab');
  const tabIndicator = document.getElementById('sim-tab-indicator');
  const tabResult = document.getElementById('sim-tab-result');
  const tabHistory = document.getElementById('sim-tab-history');
  const tabSettings = document.getElementById('sim-tab-settings');

  // Result Tab Views
  const viewEmpty = document.getElementById('sim-empty');
  const viewLoading = document.getElementById('sim-loading');
  const loadingMsg = document.getElementById('sim-loading-msg');
  const viewResult = document.getElementById('sim-result');
  const textareaResult = document.getElementById('sim-textarea');
  const previewBox = document.getElementById('sim-preview-box');
  const textMeta = document.getElementById('sim-text-meta');

  // Action Buttons
  const btnCopy = document.getElementById('sim-btn-copy');
  const btnRetry = document.getElementById('sim-btn-retry');
  const btnSave = document.getElementById('sim-btn-save');
  const btnPDF = document.getElementById('sim-btn-pdf');
  const btnTXT = document.getElementById('sim-btn-txt');
  const btnDOCX = document.getElementById('sim-btn-docx');
  const btnDelete = document.getElementById('sim-btn-delete');

  // History Tab Elements
  const searchInput = document.getElementById('sim-search');
  const btnClearHistory = document.getElementById('sim-btn-clear-history');
  const historyListContainer = document.getElementById('sim-history-list');

  // Settings Tab Elements
  const prefLang = document.getElementById('sim-pref-lang');
  const prefShowFab = document.getElementById('sim-pref-show-fab');
  const prefTheme = document.getElementById('sim-pref-theme');

  // Toast Component
  const toastNode = document.getElementById('sim-toast');

  // ── Toast Notification Helper ──────────────────────────────
  let toastTimeout = null;
  function showToast(message) {
    if (!toastNode) return;
    toastNode.innerText = message;
    toastNode.classList.add('st-toast-show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNode.classList.remove('st-toast-show');
    }, 2800);
  }

  // ── Theme Management ────────────────────────────────────────
  function toggleTheme(newTheme) {
    state.theme = newTheme;
    
    // Update active theme classes
    if (newTheme === 'light') {
      viewport.classList.add('st-light-theme');
      sidePanel.classList.add('st-light-theme');
      fabBtn.classList.add('st-light-theme');
      prefTheme.value = 'light';
    } else {
      viewport.classList.remove('st-light-theme');
      sidePanel.classList.remove('st-light-theme');
      fabBtn.classList.remove('st-light-theme');
      prefTheme.value = 'dark';
    }
    
    showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated!`);
  }

  // Bind Theme Toggles
  btnThemeHeader.addEventListener('click', () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    toggleTheme(nextTheme);
  });

  prefTheme.addEventListener('change', (e) => {
    toggleTheme(e.target.value);
  });

  // ── Floating Action Button (FAB) & Selection Mode ───────────
  function activateSelectionMode() {
    state.isOverlayActive = true;
    overlayMask.classList.add('active');
    
    // Temporarily slide the panel closed so the user has full view
    sidePanel.classList.remove('open');
  }

  function deactivateSelectionMode() {
    state.isOverlayActive = false;
    overlayMask.classList.remove('active');
    selBox.style.display = 'none';
  }

  fabBtn.addEventListener('click', () => {
    if (state.isOverlayActive) {
      deactivateSelectionMode();
    } else {
      activateSelectionMode();
    }
  });

  btnNew.addEventListener('click', () => {
    activateSelectionMode();
  });

  // ── Drag & Selection Box Coordinates Drawing ────────────────
  overlayMask.addEventListener('mousedown', startDrag);
  overlayMask.addEventListener('touchstart', startDrag, { passive: true });

  window.addEventListener('mousemove', dragMove);
  window.addEventListener('touchmove', dragMove, { passive: false });

  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  function startDrag(e) {
    if (!state.isOverlayActive) return;
    state.isDragging = true;

    const coords = getLocalCoordinates(e);
    state.dragStart = coords;

    // Reset Selection Box style properties
    selBox.style.left = `${coords.x}px`;
    selBox.style.top = `${coords.y}px`;
    selBox.style.width = '0px';
    selBox.style.height = '0px';
    selBox.style.display = 'block';

    if (e.cancelable) e.preventDefault();
  }

  function dragMove(e) {
    if (!state.isDragging) return;

    const coords = getLocalCoordinates(e);
    
    const left = Math.min(state.dragStart.x, coords.x);
    const top = Math.min(state.dragStart.y, coords.y);
    const width = Math.abs(state.dragStart.x - coords.x);
    const height = Math.abs(state.dragStart.y - coords.y);

    selBox.style.left = `${left}px`;
    selBox.style.top = `${top}px`;
    selBox.style.width = `${width}px`;
    selBox.style.height = `${height}px`;

    // Prevent scrolling during drag
    if (e.cancelable) e.preventDefault();
  }

  function endDrag(e) {
    if (!state.isDragging) return;
    state.isDragging = false;

    // Hide Crop Box and turn off mask overlay
    selBox.style.display = 'none';
    deactivateSelectionMode();

    // 1. Shutter Camera Shutter Animation
    shutterFlash.classList.add('flash-run');
    setTimeout(() => {
      shutterFlash.classList.remove('flash-run');
    }, 300);

    // 2. Bounding calculations to match targeted text block
    let clientX, clientY;
    if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Determine the capture type based on coordinates intersection
    const definitionBlock = document.querySelector('[data-text-id="text-definition"]');
    const codeBlock = document.querySelector('[data-text-id="text-code"]');
    
    let selectedId = 'generic';

    if (definitionBlock && codeBlock) {
      const defRect = definitionBlock.getBoundingClientRect();
      const codeRect = codeBlock.getBoundingClientRect();

      // Check if mouse released inside definition block or code block bounds
      const inDef = clientX >= defRect.left && clientX <= defRect.right &&
                    clientY >= defRect.top && clientY <= defRect.bottom;
      
      const inCode = clientX >= codeRect.left && clientX <= codeRect.right &&
                     clientY >= codeRect.top && clientY <= codeRect.bottom;

      if (inDef) {
        selectedId = 'text-definition';
      } else if (inCode) {
        selectedId = 'text-code';
      } else {
        // Fallback: Check if selection overlap rectangle is closer to one of them
        // For standard landing page simulator, dragging anywhere in the article is extremely forgiving!
        // We'll treat dragging near top half as quote, bottom half as code.
        const articleRect = document.querySelector('.wiki-article').getBoundingClientRect();
        const relativeY = clientY - articleRect.top;
        if (relativeY > 0 && relativeY < articleRect.height) {
          if (relativeY < articleRect.height / 2.3) {
            selectedId = 'text-definition';
          } else if (relativeY > articleRect.height / 1.8 && relativeY < articleRect.height * 0.8) {
            selectedId = 'text-code';
          } else {
            selectedId = 'generic';
          }
        }
      }
    }

    // Trigger progressive OCR recognition and open side-panel!
    triggerSimulatedOCR(selectedId);
  }

  function getLocalCoordinates(e) {
    const rect = viewport.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Constrain inside viewport bounding rectangle
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    return { x, y };
  }

  // ── Simulated Progressive OCR Loading and View Population ────
  function triggerSimulatedOCR(dataId) {
    // Slide the side panel open
    sidePanel.classList.add('open');
    switchTab('result');

    // Switch views to show Loader
    viewEmpty.style.display = 'none';
    viewResult.style.display = 'none';
    viewLoading.style.display = 'flex';

    const ocrItem = OCR_DATA[dataId];
    state.currentCapture = {
      id: `capt-${Date.now()}`,
      title: ocrItem.title,
      text: ocrItem.text,
      type: ocrItem.type,
      thumbnailHTML: ocrItem.thumbnailHTML,
      timeLabel: 'Just now'
    };

    // Progression of loading messages to make it feel high-fidelity
    const stages = [
      { delay: 0, text: 'Initializing OCR engine...' },
      { delay: 350, text: `Loading model training files (${state.ocrLang === 'eng' ? 'eng.traineddata' : state.ocrLang})...` },
      { delay: 750, text: 'Binarizing screen pixels...' },
      { delay: 1050, text: 'Analyzing text line boundaries (100%)...' },
      { delay: 1300, text: 'Recognizing characters...' }
    ];

    stages.forEach((stage) => {
      setTimeout(() => {
        if (state.currentCapture) {
          loadingMsg.innerText = stage.text;
        }
      }, stage.delay);
    });

    // Populate final OCR content view
    setTimeout(() => {
      if (!state.currentCapture) return; // Guard in case of panel resets

      // Populate text details
      textareaResult.value = state.currentCapture.text;
      textMeta.innerText = `${state.currentCapture.text.length} chars`;
      
      // Load thumbnail
      previewBox.innerHTML = state.currentCapture.thumbnailHTML;

      // Swap loader with result panel content
      viewLoading.style.display = 'none';
      viewResult.style.display = 'flex';
      
      showToast('Capture scanned successfully!');
    }, 1550);
  }

  // ── Tab Switching Navigation ────────────────────────────────
  function switchTab(tabId) {
    state.activeTab = tabId;

    // Reset tab active classes
    tabs.forEach((tab, index) => {
      if (tab.getAttribute('data-tab') === tabId) {
        tab.classList.add('st-tab-active');
        // Slide tab slider indicator background
        tabIndicator.style.transform = `translateX(${index * 100}%)`;
      } else {
        tab.classList.remove('st-tab-active');
      }
    });

    // Toggle Content Views
    tabResult.style.display = tabId === 'result' ? 'block' : 'none';
    tabHistory.style.display = tabId === 'history' ? 'block' : 'none';
    tabSettings.style.display = tabId === 'settings' ? 'block' : 'none';
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const selected = e.target.getAttribute('data-tab');
      switchTab(selected);
    });
  });

  // Close panel event
  btnClose.addEventListener('click', () => {
    sidePanel.classList.remove('open');
  });

  // ── Simulated Action Buttons ────────────────────────────────
  btnCopy.addEventListener('click', () => {
    const textToCopy = textareaResult.value;
    
    // Copy implementation
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => showToast('📋 Text copied to clipboard!'))
        .catch(() => showToast('⚠️ Unable to copy automatically'));
    } else {
      // Fallback
      textareaResult.select();
      document.execCommand('copy');
      showToast('📋 Text copied to clipboard!');
    }
  });

  btnRetry.addEventListener('click', () => {
    showToast('📸 Drag crop selection box again!');
    activateSelectionMode();
  });

  btnSave.addEventListener('click', () => {
    if (!state.currentCapture) return;

    // Read edited value from textarea in case the user edited in-place
    state.currentCapture.text = textareaResult.value;
    state.currentCapture.title = state.currentCapture.text.slice(0, 30) + (state.currentCapture.text.length > 30 ? '...' : '');

    // Add current capture to the front of history list
    const iconMap = { 'quote': '📰', 'code': '💻', 'generic': '🌐' };
    const colorMap = { 'quote': 'st-hist-purple', 'code': 'st-hist-cyan', 'generic': 'st-hist-blue' };
    
    const histItem = {
      id: state.currentCapture.id,
      title: state.currentCapture.title,
      text: state.currentCapture.text,
      type: state.currentCapture.type,
      timeLabel: 'Just now',
      thumbnailHTML: state.currentCapture.thumbnailHTML,
      icon: iconMap[state.currentCapture.type] || '🌐',
      colorClass: colorMap[state.currentCapture.type] || 'st-hist-blue'
    };

    state.history.unshift(histItem);

    // Re-render History DOM
    renderHistoryDOM();

    showToast('💾 Scan saved to History!');
    
    // Slide to history panel
    setTimeout(() => {
      switchTab('history');
    }, 400);
  });

  btnDelete.addEventListener('click', () => {
    state.currentCapture = null;
    viewResult.style.display = 'none';
    viewEmpty.style.display = 'flex';
    showToast('🗑️ Scan card deleted.');
  });

  // Simulated Document Download exports
  function triggerExportDownload(format) {
    showToast(`📥 Compiling export packet...`);
    
    // Simulate a brief generation lag and trigger download feedback
    setTimeout(() => {
      showToast(`✅ File downloaded: snaptext-ocr-${Date.now().toString().slice(-4)}.${format.toLowerCase()}`);
    }, 1200);
  }

  btnPDF.addEventListener('click', () => triggerExportDownload('PDF'));
  btnTXT.addEventListener('click', () => triggerExportDownload('TXT'));
  btnDOCX.addEventListener('click', () => triggerExportDownload('DOCX'));

  // ── History View Rendering & Actions ─────────────────────────
  function renderHistoryDOM() {
    historyListContainer.innerHTML = '';

    if (state.history.length === 0) {
      historyListContainer.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; color: var(--st-text3); font-size: 12px;">
          No captured items in history cache.
        </div>
      `;
      return;
    }

    state.history.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'st-history-card';
      card.setAttribute('data-id', item.id);
      
      // Render Card Markup
      card.innerHTML = `
        <div class="st-hist-thumb-placeholder">${item.icon}</div>
        <div class="st-hist-body">
          <div class="st-hist-label">${item.title}</div>
          <div class="st-hist-time">${item.timeLabel}</div>
          <div class="st-hist-preview">${item.text.replace(/\n/g, ' ').slice(0, 75)}...</div>
        </div>
      `;

      // Click card to restore back into result tab
      card.addEventListener('click', () => {
        state.currentCapture = {
          id: item.id,
          title: item.title,
          text: item.text,
          type: item.type,
          thumbnailHTML: item.thumbnailHTML,
          timeLabel: item.timeLabel
        };

        // Populate details
        textareaResult.value = item.text;
        textMeta.innerText = `${item.text.length} chars`;
        previewBox.innerHTML = item.thumbnailHTML;

        // Slide back to result tab
        switchTab('result');
        viewEmpty.style.display = 'none';
        viewLoading.style.display = 'none';
        viewResult.style.display = 'flex';

        // Add visual indicator of active selection in history
        document.querySelectorAll('.st-history-card').forEach((c) => c.classList.remove('active-sim-card'));
        card.classList.add('active-sim-card');
      });

      historyListContainer.appendChild(card);
    });
  }

  // Clear All history items
  btnClearHistory.addEventListener('click', () => {
    state.history = [];
    renderHistoryDOM();
    showToast('🧹 History catalog cleared!');
  });

  // Real-time Search input filter
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = historyListContainer.querySelectorAll('.st-history-card');

    cards.forEach((card) => {
      const id = card.getAttribute('data-id');
      const item = state.history.find((i) => i.id === id);
      if (!item) return;

      const matches = item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query);
      card.style.display = matches ? 'flex' : 'none';
    });
  });

  // ── Settings Panel Binding Interactions ─────────────────────
  prefLang.addEventListener('change', (e) => {
    state.ocrLang = e.target.value;
    const langNames = { 'eng': 'English', 'spa': 'Spanish', 'fra': 'French' };
    showToast(`🌐 Primary language set: ${langNames[e.target.value] || e.target.value}`);
  });

  prefShowFab.addEventListener('change', (e) => {
    state.fabVisible = e.target.checked;
    if (state.fabVisible) {
      fabBtn.style.opacity = '1';
      fabBtn.style.pointerEvents = 'auto';
      showToast('📸 Floating Action Button shown.');
    } else {
      fabBtn.style.opacity = '0';
      fabBtn.style.pointerEvents = 'none';
      showToast('📸 Floating Action Button hidden.');
    }
  });

  // ── Initialize Simulation UI ────────────────────────────────
  renderHistoryDOM();
  switchTab('result');
  toggleTheme('dark'); // Set default theme to Dark mode
});
