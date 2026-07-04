// Download Manager - Main Application
const CONFIG = {
    dataUrl: 'data.json',
    searchDelay: 300,
    maxFilesPerPage: 100
};

const state = {
    folders: [],
    files: [],
    activeFolderId: null,
    searchQuery: '',
    isLoading: false,
    error: null
};

const DOM = {
    foldersContainer: document.getElementById('foldersContainer'),
    filesList: document.getElementById('filesList'),
    folderTitle: document.getElementById('folderTitle'),
    searchInput: document.getElementById('searchInput'),
    loadingIndicator: null
};

// Utility Functions
const escapeHtml = (text) => {
    if (!text) return '';
    const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};
    return String(text).replace(/[&<>"']/g, m => map[m]);
};

const getFileIcon = (filename) => {
    if (!filename) return 'fa-file';
    const ext = filename.split('.').pop().toLowerCase();
    const map = {
        'pdf': 'fa-file-pdf', 'doc': 'fa-file-word', 'docx': 'fa-file-word',
        'txt': 'fa-file-alt', 'md': 'fa-file-alt', 'rtf': 'fa-file-alt',
        'zip': 'fa-file-archive', 'rar': 'fa-file-archive', '7z': 'fa-file-archive',
        'tar': 'fa-file-archive', 'gz': 'fa-file-archive',
        'mp3': 'fa-file-audio', 'wav': 'fa-file-audio', 'flac': 'fa-file-audio',
        'aac': 'fa-file-audio', 'ogg': 'fa-file-audio',
        'mp4': 'fa-file-video', 'mov': 'fa-file-video', 'avi': 'fa-file-video',
        'mkv': 'fa-file-video', 'webm': 'fa-file-video',
        'jpg': 'fa-file-image', 'jpeg': 'fa-file-image', 'png': 'fa-file-image',
        'gif': 'fa-file-image', 'svg': 'fa-file-image', 'webp': 'fa-file-image',
        'ico': 'fa-file-image', 'bmp': 'fa-file-image',
        'js': 'fa-file-code', 'html': 'fa-file-code', 'css': 'fa-file-code',
        'json': 'fa-file-code', 'py': 'fa-file-code', 'php': 'fa-file-code',
        'java': 'fa-file-code', 'cpp': 'fa-file-code', 'c': 'fa-file-code',
        'go': 'fa-file-code', 'rs': 'fa-file-code', 'ts': 'fa-file-code',
        'jsx': 'fa-file-code', 'tsx': 'fa-file-code',
        'xls': 'fa-file-excel', 'xlsx': 'fa-file-excel', 'csv': 'fa-file-excel',
        'ppt': 'fa-file-powerpoint', 'pptx': 'fa-file-powerpoint'
    };
    return map[ext] || 'fa-file';
};

const formatFileSize = (size) => {
    if (!size) return '—';
    if (typeof size === 'string' && size.includes(' ')) return size;
    const bytes = parseInt(size);
    if (isNaN(bytes)) return size;
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + units[i];
};

const debounce = (fn, delay) => {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
};

// Helper: Get files for a specific folder
const getFilesForFolder = (folderId) => {
    if (!state.files || !Array.isArray(state.files)) return [];
    return state.files.filter(file => file.folderId === folderId);
};

// Render Functions
const render = {
    folders: (folders, activeId) => {
        const container = DOM.foldersContainer;
        if (!folders || !folders.length) {
            container.innerHTML = '<div class="empty" role="status">📂 No folders found</div>';
            return;
        }
        const html = folders.map(f => {
            const fileCount = getFilesForFolder(f.id).length;
            return `
                <div class="folder ${f.id === activeId ? 'active' : ''}" 
                     data-folder-id="${escapeHtml(f.id)}"
                     role="button" 
                     tabindex="0"
                     aria-selected="${f.id === activeId}"
                     aria-label="${escapeHtml(f.name)}"
                     onclick="App.setActive('${escapeHtml(f.id)}')"
                     onkeydown="if(event.key==='Enter'||event.key===' ')App.setActive('${escapeHtml(f.id)}')">
                    <div class="name">${escapeHtml(f.name)}</div>
                    <div class="count">${fileCount} files</div>
                </div>
            `;
        }).join('');
        container.innerHTML = html;
    },

    files: (folder) => {
        const list = DOM.filesList;
        const title = DOM.folderTitle;
        
        if (!folder) {
            title.textContent = 'No folder selected';
            list.innerHTML = '<div class="empty" role="status">👆 Select a folder from above</div>';
            return;
        }

        title.textContent = folder.name;

        const files = getFilesForFolder(folder.id);
        
        if (!files || !files.length) {
            list.innerHTML = '<div class="empty" role="status">📭 This folder is empty</div>';
            return;
        }

        const displayedFiles = files.slice(0, CONFIG.maxFilesPerPage);
        const html = displayedFiles.map(file => {
            const icon = getFileIcon(file.name);
            const size = file.size || '—';
            const link = file.link || '#';
            const fileSize = formatFileSize(size);

            return `
                <div class="file-row" role="listitem">
                    <div class="info">
                        <i class="fas ${icon}" aria-hidden="true"></i>
                        <span>${escapeHtml(file.name)}</span>
                        <span class="size">${escapeHtml(fileSize)}</span>
                    </div>
                    <div class="actions">
                        <a href="${escapeHtml(link)}" class="btn-dl" download 
                           aria-label="Download ${escapeHtml(file.name)}">
                            <i class="fas fa-download" aria-hidden="true"></i> Download
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        list.innerHTML = html;
        
        if (files.length > CONFIG.maxFilesPerPage) {
            list.innerHTML += `<div class="empty" role="status">Showing first ${CONFIG.maxFilesPerPage} files</div>`;
        }
    },

    searchResults: (query, folders, activeId) => {
        const q = query.trim().toLowerCase();
        if (!q) {
            render.folders(folders, activeId);
            const folder = folders.find(f => f.id === activeId);
            render.files(folder);
            return;
        }

        const filtered = folders.filter(f => {
            const folderFiles = getFilesForFolder(f.id);
            return f.name.toLowerCase().includes(q) ||
                (folderFiles && folderFiles.some(file => file.name.toLowerCase().includes(q)));
        });

        const container = DOM.foldersContainer;
        
        if (!filtered.length) {
            container.innerHTML = '<div class="empty" role="status">🔍 No matching folders</div>';
            DOM.filesList.innerHTML = '<div class="empty" role="status">No files found</div>';
            DOM.folderTitle.textContent = '🔍 Search results';
            return;
        }

        render.folders(filtered, activeId);

        if (filtered.length > 0) {
            const first = filtered[0];
            DOM.folderTitle.textContent = `🔍 "${escapeHtml(q)}" — ${escapeHtml(first.name)}`;
            
            const matchedFiles = getFilesForFolder(first.id).filter(file => 
                file.name.toLowerCase().includes(q)
            );

            if (!matchedFiles.length) {
                DOM.filesList.innerHTML = '<div class="empty" role="status">No matching files in this folder</div>';
                return;
            }

            const html = matchedFiles.slice(0, CONFIG.maxFilesPerPage).map(file => {
                const icon = getFileIcon(file.name);
                const size = file.size || '—';
                const link = file.link || '#';
                const fileSize = formatFileSize(size);

                return `
                    <div class="file-row" role="listitem">
                        <div class="info">
                            <i class="fas ${icon}" aria-hidden="true"></i>
                            <span>${escapeHtml(file.name)}</span>
                            <span class="size">${escapeHtml(fileSize)}</span>
                        </div>
                        <div class="actions">
                            <a href="${escapeHtml(link)}" class="btn-dl" download
                               aria-label="Download ${escapeHtml(file.name)}">
                                <i class="fas fa-download" aria-hidden="true"></i> Download
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
            DOM.filesList.innerHTML = html;
        }
    }
};

// Core Functions
const setActive = (folderId) => {
    if (state.activeFolderId === folderId) return;
    state.activeFolderId = folderId;
    state.searchQuery = '';
    DOM.searchInput.value = '';
    renderAll();
    document.querySelector('.files-box')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const loadData = async () => {
    if (state.isLoading) return;
    state.isLoading = true;
    state.error = null;

    const container = DOM.foldersContainer;
    container.innerHTML = `
        <div class="loading" role="status">
            <i class="fas fa-spinner fa-pulse" aria-hidden="true"></i>
            Loading data...
        </div>
    `;

    try {
        const response = await fetch(CONFIG.dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Validate data structure
        if (!data.folders || !Array.isArray(data.folders)) {
            throw new Error('Data must contain a "folders" array');
        }
        
        if (!data.files || !Array.isArray(data.files)) {
            throw new Error('Data must contain a "files" array');
        }

        if (data.folders.length && (!data.folders[0].id || !data.folders[0].name)) {
            throw new Error('Each folder must have "id" and "name" properties');
        }

        state.folders = data.folders;
        state.files = data.files;
        state.activeFolderId = data.folders.length ? data.folders[0].id : null;
        state.error = null;
        renderAll();

    } catch (error) {
        console.error('Error loading data:', error);
        state.error = error.message;
        container.innerHTML = `
            <div class="error-msg" role="alert">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                ${escapeHtml(error.message)}
                <br>
                <button class="btn-retry" onclick="App.loadData()">
                    <i class="fas fa-redo" aria-hidden="true"></i> Retry
                </button>
            </div>
        `;
        DOM.filesList.innerHTML = '<div class="empty" role="status">⚠️ Unable to load data</div>';
        DOM.folderTitle.textContent = 'Error';
    } finally {
        state.isLoading = false;
    }
};

const renderAll = () => {
    const { folders, activeFolderId, searchQuery } = state;
    if (searchQuery) {
        render.searchResults(searchQuery, folders, activeFolderId);
    } else {
        render.folders(folders, activeFolderId);
        const folder = folders.find(f => f.id === activeFolderId);
        render.files(folder);
    }
};

const performSearch = (query) => {
    state.searchQuery = query;
    if (!query.trim()) {
        renderAll();
        return;
    }
    render.searchResults(query, state.folders, state.activeFolderId);
};

const debouncedSearch = debounce(performSearch, CONFIG.searchDelay);

// App API
const App = {
    loadData,
    setActive,
    renderAll,
    performSearch
};

window.App = App;

// Initialize
DOM.searchInput.addEventListener('input', function(e) {
    debouncedSearch(this.value);
});

DOM.searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        this.value = '';
        performSearch('');
        this.blur();
    }
});

// Handle keyboard navigation for folders
document.addEventListener('keydown', function(e) {
    if (e.target.closest('.folder')) {
        const folders = document.querySelectorAll('.folder');
        const current = e.target.closest('.folder');
        const index = Array.from(folders).indexOf(current);
        let newIndex = index;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            newIndex = Math.min(index + 1, folders.length - 1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            newIndex = Math.max(index - 1, 0);
        }

        if (newIndex !== index) {
            folders[newIndex].focus();
            const id = folders[newIndex].dataset.folderId;
            if (id) setActive(id);
        }
    }
});

// Load data
loadData();

console.log('📁 Download Manager initialized');