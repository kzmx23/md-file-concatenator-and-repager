import Sortable from 'sortablejs';

// --- Concatenator State ---
let files = [];

// --- Re-pager State ---
let repageFile = null;
let repageMin = null;
let repageMax = null;

// --- DOM Elements: Tabs ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// --- DOM Elements: Concatenator ---
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const clearBtn = document.getElementById('clear-btn');
const concatBtn = document.getElementById('concat-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const logOutput = document.getElementById('log-output');
const resultArea = document.getElementById('result-area');
const downloadLink = document.getElementById('download-link');

// --- DOM Elements: Re-pager ---
const repageDropZone = document.getElementById('repage-drop-zone');
const repageFileInput = document.getElementById('repage-file-input');
const repageFileInfo = document.getElementById('repage-file-info');
const repageFilename = document.getElementById('repage-filename');
const repageRange = document.getElementById('repage-range');
const startPageInput = document.getElementById('start-page-input');
const repageClearBtn = document.getElementById('repage-clear-btn');
const repageBtn = document.getElementById('repage-btn');
const repageLogOutput = document.getElementById('repage-log-output');
const repageResultArea = document.getElementById('repage-result-area');
const repageDownloadLink = document.getElementById('repage-download-link');


// --- Initialization ---
new Sortable(fileList, {
  animation: 150,
  ghostClass: 'sortable-ghost',
  onEnd: () => {
    const newOrder = [];
    const items = fileList.querySelectorAll('.file-item');
    items.forEach(item => {
      const id = item.dataset.id;
      const file = files.find(f => f.id === id);
      if (file) newOrder.push(file);
    });
    files = newOrder;
    log('Files reordered.');
  }
});

// --- Event Listeners: Tabs ---
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Deactivate all
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    // Activate clicked
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// --- Event Listeners: Concatenator ---
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
clearBtn.addEventListener('click', clearFiles);
concatBtn.addEventListener('click', concatenateFiles);

// --- Event Listeners: Re-pager ---
repageDropZone.addEventListener('click', () => repageFileInput.click());
repageDropZone.addEventListener('dragover', (e) => { e.preventDefault(); repageDropZone.classList.add('drag-over'); });
repageDropZone.addEventListener('dragleave', () => repageDropZone.classList.remove('drag-over'));
repageDropZone.addEventListener('drop', handleRepageDrop);
repageFileInput.addEventListener('change', handleRepageFileSelect);
repageClearBtn.addEventListener('click', clearRepageFile);
startPageInput.addEventListener('input', updateRepageButton);
repageBtn.addEventListener('click', processRepage);


// --- Concatenator Functions ---

function handleDrop(e) {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.md') || f.name.endsWith('.txt') || f.name.endsWith('.markdown'));
  addFiles(droppedFiles);
}

function handleFileSelect(e) {
  const selectedFiles = Array.from(e.target.files);
  addFiles(selectedFiles);
  fileInput.value = '';
}

function addFiles(newFiles) {
  if (newFiles.length === 0) return;
  newFiles.forEach(file => {
    file.id = Math.random().toString(36).substr(2, 9);
    files.push(file);
  });
  renderFileList();
  updateButtons();
  log(`Added ${newFiles.length} file(s).`);
}

function renderFileList() {
  fileList.innerHTML = '';
  files.forEach(file => {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.dataset.id = file.id;
    li.innerHTML = `
      <span class="file-name" title="${file.name}">${file.name}</span>
      <button class="remove-file">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    li.querySelector('.remove-file').addEventListener('click', (e) => {
      e.stopPropagation();
      removeFile(file.id);
    });
    fileList.appendChild(li);
  });
}

function removeFile(id) {
  files = files.filter(f => f.id !== id);
  renderFileList();
  updateButtons();
  log('File removed.');
}

function clearFiles() {
  files = [];
  renderFileList();
  updateButtons();
  resetProgress();
  log('All files cleared.');
}

function updateButtons() {
  concatBtn.disabled = files.length === 0;
  if (files.length === 0) resultArea.classList.add('hidden');
}

function log(message, type = 'info') {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logOutput.appendChild(entry);
  logOutput.scrollTop = logOutput.scrollHeight;
}

function resetProgress() {
  progressBar.style.width = '0%';
  progressText.textContent = 'Ready';
  resultArea.classList.add('hidden');
}

async function concatenateFiles() {
  if (files.length === 0) return;
  concatBtn.disabled = true;
  clearBtn.disabled = true;
  resetProgress();
  log('Starting concatenation...', 'info');

  const blobs = [];
  let processedCount = 0;

  try {
    const separator = new Blob(['\n\n'], { type: 'text/markdown' });
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      log(`Processing: ${file.name}`, 'info');
      blobs.push(file);
      if (i < files.length - 1) blobs.push(separator);

      processedCount++;
      const progress = Math.round((processedCount / files.length) * 100);
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const finalBlob = new Blob(blobs, { type: 'text/markdown' });
    const url = URL.createObjectURL(finalBlob);
    const firstFileName = files[0].name.replace(/\.[^/.]+$/, "");
    const outputName = `${firstFileName}_conc.md`;

    downloadLink.href = url;
    downloadLink.download = outputName;
    resultArea.classList.remove('hidden');
    log(`Concatenation complete! Result size: ${(finalBlob.size / 1024).toFixed(2)} KB`, 'success');

  } catch (error) {
    log(`Error: ${error.message}`, 'error');
  } finally {
    concatBtn.disabled = false;
    clearBtn.disabled = false;
  }
}


// --- Re-pager Functions ---

function handleRepageDrop(e) {
  e.preventDefault();
  repageDropZone.classList.remove('drag-over');
  const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.md') || f.name.endsWith('.txt') || f.name.endsWith('.markdown'));

  if (droppedFiles.length > 0) {
    setRepageFile(droppedFiles[0]);
  }
}

function handleRepageFileSelect(e) {
  if (e.target.files.length > 0) {
    setRepageFile(e.target.files[0]);
  }
  repageFileInput.value = '';
}

async function setRepageFile(file) {
  repageFile = file;
  repageFilename.textContent = file.name;
  repageDropZone.classList.add('hidden');
  repageFileInfo.classList.remove('hidden');
  repageLog('Scanning file for page markers...', 'info');

  try {
    const text = await file.text();
    const regex = /## Page (\d+)/g;
    let match;
    let min = Infinity;
    let max = -Infinity;
    let found = false;

    while ((match = regex.exec(text)) !== null) {
      const pageNum = parseInt(match[1], 10);
      if (pageNum < min) min = pageNum;
      if (pageNum > max) max = pageNum;
      found = true;
    }

    if (found) {
      repageMin = min;
      repageMax = max;
      repageRange.textContent = `Min: ${min} - Max: ${max}`;
      repageLog(`Found page markers. Min: ${min}, Max: ${max}`, 'success');
    } else {
      repageMin = null;
      repageMax = null;
      repageRange.textContent = 'No markers found';
      repageLog('No "## Page X" markers found in file.', 'error');
    }

    updateRepageButton();

  } catch (err) {
    repageLog(`Error reading file: ${err.message}`, 'error');
  }
}

function clearRepageFile() {
  repageFile = null;
  repageMin = null;
  repageMax = null;
  repageDropZone.classList.remove('hidden');
  repageFileInfo.classList.add('hidden');
  repageResultArea.classList.add('hidden');
  startPageInput.value = '';
  updateRepageButton();
  repageLog('File cleared.');
}

function updateRepageButton() {
  const hasFile = repageFile !== null;
  const hasInput = startPageInput.value.trim() !== '';
  repageBtn.disabled = !(hasFile && hasInput);
}

function repageLog(message, type = 'info') {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  repageLogOutput.appendChild(entry);
  repageLogOutput.scrollTop = repageLogOutput.scrollHeight;
}

async function processRepage() {
  if (!repageFile || !startPageInput.value) return;

  repageBtn.disabled = true;
  repageClearBtn.disabled = true;
  repageLog('Starting repage process...', 'info');

  try {
    const text = await repageFile.text();
    let startPage = parseInt(startPageInput.value, 10);
    let count = 0;

    // Replace sequentially
    const newText = text.replace(/## Page (\d+)/g, (match, p1) => {
      const newPageNum = startPage + count;
      count++;
      return `## Page ${newPageNum}`;
    });

    const finalBlob = new Blob([newText], { type: 'text/markdown' });
    const url = URL.createObjectURL(finalBlob);

    const firstFileName = repageFile.name.replace(/\.[^/.]+$/, "");
    const outputName = `${firstFileName}_repgd.md`;

    repageDownloadLink.href = url;
    repageDownloadLink.download = outputName;
    repageResultArea.classList.remove('hidden');

    repageLog(`Repage complete! Updated ${count} markers.`, 'success');

  } catch (error) {
    repageLog(`Error: ${error.message}`, 'error');
  } finally {
    repageBtn.disabled = false;
    repageClearBtn.disabled = false;
  }
}
