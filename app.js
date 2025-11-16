// macOS Web Simulator

class MacOS {
    constructor() {
        this.windows = new Map();
        this.zIndexCounter = 100;
        this.activeWindow = null;
        this.fileSystem = this.loadFileSystem();
        this.currentNoteId = null;
        this.pendingNoteToOpen = null;
        this.pendingBrowserSource = null;
        this.browserHistory = { entries: [], index: -1 };
        this.notesContext = null;
        this.browserContext = null;
        this.wallpaper = this.loadWallpaper();
        // 全局拖动状态管理（事件委托模式，避免内存泄漏）
        this.dragState = {
            isDragging: false,
            appName: null,
            initialX: 0,
            initialY: 0
        };
        this.init();
    }

    init() {
        // 启动动画完成后显示桌面
        setTimeout(() => {
            const desktop = document.getElementById('desktop');
            desktop.style.display = 'block';
            desktop.style.opacity = '0';
            setTimeout(() => {
                desktop.style.transition = 'opacity 0.5s ease';
                desktop.style.opacity = '1';
            }, 50);
            this.initEventListeners();
            this.initGlobalDragListeners();
            this.updateTime();
            setInterval(() => this.updateTime(), 1000);
            this.applyWallpaper();
        }, 4000);
    }

    // 全局拖动监听器（单例模式，避免内存泄漏）
    initGlobalDragListeners() {
        document.addEventListener('mousemove', (e) => {
            if (!this.dragState.isDragging) return;

            const windowEl = this.windows.get(this.dragState.appName);
            if (!windowEl) return;

            e.preventDefault();
            const currentX = e.clientX - this.dragState.initialX;
            const currentY = e.clientY - this.dragState.initialY;

            // 限制窗口不超出屏幕
            const finalY = Math.max(24, currentY);

            windowEl.style.left = currentX + 'px';
            windowEl.style.top = finalY + 'px';
        });

        document.addEventListener('mouseup', () => {
            this.dragState.isDragging = false;
        });
    }

    loadWallpaper() {
        if (typeof localStorage === 'undefined') {
            return this.getDefaultWallpaper();
        }
        const stored = localStorage.getItem('macos-wallpaper');
        return stored || this.getDefaultWallpaper();
    }

    getDefaultWallpaper() {
        return 'gradient1'; // 默认渐变壁纸
    }

    setWallpaper(wallpaperType, customUrl = null) {
        this.wallpaper = customUrl || wallpaperType;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('macos-wallpaper', this.wallpaper);
        }
        this.applyWallpaper();
    }

    applyWallpaper() {
        const wallpaperEl = document.querySelector('.desktop-wallpaper');
        if (!wallpaperEl) return;

        const wallpapers = {
            'gradient1': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'gradient2': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'gradient3': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'gradient4': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'gradient5': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'solid-dark': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            'solid-light': 'linear-gradient(135deg, #e3e3e3 0%, #c9c9c9 100%)',
        };

        if (wallpapers[this.wallpaper]) {
            wallpaperEl.style.backgroundImage = wallpapers[this.wallpaper];
        } else if (typeof this.wallpaper === 'string' && this.wallpaper.startsWith('http')) {
            wallpaperEl.style.backgroundImage = `url('${this.wallpaper}'), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;
        } else {
            wallpaperEl.style.backgroundImage = wallpapers['gradient1'];
        }
    }

    loadFileSystem() {
        if (typeof localStorage === 'undefined') {
            return this.getDefaultFiles();
        }
        try {
            const stored = localStorage.getItem('macos-files');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    const defaults = this.getDefaultFiles();
                    return { ...defaults, ...parsed };
                }
            }
        } catch (error) {
            console.warn('Failed to load file system, using defaults.', error);
        }
        return this.getDefaultFiles();
    }

    getDefaultFiles() {
        const timestamp = Date.now();
        return {
            'welcome-note': {
                name: 'welcome-note',
                type: 'note',
                title: '欢迎使用备忘录',
                content: '这是一个高度还原的 macOS 备忘录应用。\n\n在这里你可以体验:\n• 自动保存的文本编辑\n• 与 Finder、终端、Safari 的文件互通\n• 简单易用的文件系统',
                updatedAt: timestamp
            },
            'todo-note': {
                name: 'todo-note',
                type: 'note',
                title: '今日待办',
                content: '1. 尝试在备忘录中编辑内容\n2. 在终端里输入 `help` 查看文件命令\n3. 在访达中双击文件试试\n4. 使用 Safari 打开示例页面',
                updatedAt: timestamp - 1000
            },
            'readme.txt': {
                name: 'readme.txt',
                type: 'text',
                title: '模拟器说明',
                content: 'macOS Web 模拟器现在拥有一个轻量级的虚拟文件系统。\n\n• 访达显示所有文件并可快速打开\n• 终端支持查看、创建、删除和写入文件\n• 备忘录提供文本编辑并自动保存内容\n• Safari 可以浏览保存的页面或文本',
                updatedAt: timestamp - 2000
            },
            'safari-tips.html': {
                name: 'safari-tips.html',
                type: 'page',
                title: 'Safari 使用技巧',
                content: '<h1>Safari 使用技巧</h1><p>这个页面存储在虚拟文件系统中，可以在 Safari 中打开。</p><ul><li>使用地址栏输入文件名，如 <code>safari-tips.html</code></li><li>也可以从下拉菜单中快速选择</li><li>终端命令 <code>open safari-tips.html</code> 会直接在 Safari 中打开</li></ul><p>通过简单的文件机制，你可以体验应用之间的互通。</p>',
                updatedAt: timestamp - 3000
            }
        };
    }

    persistFileSystem() {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('macos-files', JSON.stringify(this.fileSystem));
    }

    upsertFile(name, data) {
        const existing = this.fileSystem[name] || { name };
        this.fileSystem[name] = {
            ...existing,
            ...data,
            name,
            updatedAt: Date.now()
        };
        this.persistFileSystem();
        this.refreshFileConsumers();
        return this.fileSystem[name];
    }

    inferFileType(name, fallback = 'text') {
        if (!name) return fallback;
        const lower = name.toLowerCase();
        if (lower.endsWith('.html') || lower.endsWith('.htm')) return 'page';
        if (lower.endsWith('.md') || lower.endsWith('.txt')) return 'text';
        return fallback;
    }

    deleteFile(name) {
        if (this.fileSystem[name]) {
            delete this.fileSystem[name];
            this.persistFileSystem();
            this.refreshFileConsumers();
            return true;
        }
        return false;
    }

    readFile(name) {
        return this.fileSystem[name] || null;
    }

    listFiles(filterFn = null) {
        const files = Object.values(this.fileSystem);
        if (typeof filterFn === 'function') {
            return files.filter(filterFn);
        }
        return files;
    }

    refreshFileConsumers() {
        this.windows.forEach((windowEl, appName) => {
            if (appName === 'finder') {
                this.renderFinderFiles(windowEl);
            } else if (appName === 'notes') {
                if (this.notesContext?.renderList) {
                    this.notesContext.renderList();
                }
            } else if (appName === 'browser') {
                if (this.browserContext?.updateOptions) {
                    this.browserContext.updateOptions();
                } else {
                    this.updateBrowserFileOptions(windowEl);
                }
            }
        });
    }

    initEventListeners() {
        // Dock 项点击事件
        document.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('click', () => {
                const appName = item.dataset.app;
                if (appName && appName !== 'trash') {
                    this.openApp(appName);
                }
            });
        });

        // 桌面点击取消所有窗口焦点
        document.querySelector('.desktop-wallpaper').addEventListener('click', () => {
            this.deactivateAllWindows();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Cmd+W 或 Ctrl+W 关闭当前窗口
            if ((e.metaKey || e.ctrlKey) && e.key === 'w' && this.activeWindow) {
                e.preventDefault();
                this.closeWindow(this.activeWindow);
            }
            // Cmd+M 或 Ctrl+M 最小化当前窗口
            if ((e.metaKey || e.ctrlKey) && e.key === 'm' && this.activeWindow) {
                e.preventDefault();
                this.minimizeWindow(this.activeWindow);
            }
        });
    }

    updateTime() {
        const now = new Date();
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekday = weekdays[now.getDay()];
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hour = now.getHours();
        const minute = now.getMinutes().toString().padStart(2, '0');
        const period = hour < 12 ? '上午' : '下午';
        const displayHour = hour;
        
        const timeStr = `${weekday} ${month}月${day}日 ${period}${displayHour}:${minute}`;
        document.getElementById('menuTime').textContent = timeStr;
    }

    openApp(appName) {
        // 如果应用已打开，聚焦该窗口
        if (this.windows.has(appName)) {
            this.focusWindow(appName);
            return;
        }

        const appConfig = this.getAppConfig(appName);
        if (!appConfig) return;

        const windowEl = this.createWindow(appName, appConfig);
        this.windows.set(appName, windowEl);
        
        // 更新 Dock 指示器
        const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
        if (dockItem) {
            dockItem.classList.add('active');
        }

        // 更新菜单栏应用名称
        this.updateMenuBarAppName(appConfig.title);
    }

    getAppConfig(appName) {
        const configs = {
            finder: {
                title: '访达',
                width: 800,
                height: 500,
                content: this.createFinderContent()
            },
            terminal: {
                title: '终端',
                width: 680,
                height: 440,
                content: this.createTerminalContent()
            },
            notes: {
                title: '备忘录',
                width: 700,
                height: 500,
                content: this.createNotesContent()
            },
            calculator: {
                title: '计算器',
                width: 360,
                height: 600,
                content: this.createCalculatorContent()
            },
            settings: {
                title: '系统设置',
                width: 850,
                height: 600,
                content: this.createSettingsContent()
            },
            browser: {
                title: 'Safari',
                width: 1000,
                height: 650,
                content: this.createBrowserContent()
            }
        };
        return configs[appName];
    }

    createWindow(appName, config) {
        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.dataset.app = appName;
        windowEl.style.width = config.width + 'px';
        windowEl.style.height = config.height + 'px';

        // 居中显示（修复：使用全局window对象而非局部变量）
        const left = (window.innerWidth - config.width) / 2;
        const top = (window.innerHeight - config.height) / 2 - 30;
        windowEl.style.left = left + 'px';
        windowEl.style.top = Math.max(50, top) + 'px';
        windowEl.style.zIndex = this.zIndexCounter++;

        windowEl.innerHTML = `
            <div class="window-header">
                <div class="window-controls">
                    <div class="window-control close"></div>
                    <div class="window-control minimize"></div>
                    <div class="window-control maximize"></div>
                </div>
                <div class="window-title">${config.title}</div>
            </div>
            <div class="window-content">
                ${config.content}
            </div>
        `;

        document.getElementById('windowsContainer').appendChild(windowEl);

        // 添加窗口事件
        this.addWindowEvents(windowEl, appName);

        // 设置为活动窗口
        this.focusWindow(appName);

        // 初始化应用特定功能
        setTimeout(() => {
            this.initAppFeatures(windowEl, appName);
        }, 100);

        return windowEl;
    }

    initAppFeatures(window, appName) {
        if (appName === 'terminal') {
            const terminal = window.querySelector('[data-terminal="true"]');
            const input = terminal?.querySelector('.terminal-input');
            if (input) {
                input.focus();
                // Remove any existing listeners
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);
                
                newInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const command = newInput.value.trim();
                        if (command) {
                            this.executeTerminalCommand(terminal, command);
                        } else {
                            this.executeTerminalCommand(terminal, '');
                        }
                        newInput.value = '';
                    }
                });
            }
        } else if (appName === 'finder') {
            this.initFinder(window);
        } else if (appName === 'notes') {
            this.initNotes(window);
        } else if (appName === 'calculator') {
            const calcContent = window.querySelector('.calculator-content');
            if (calcContent) {
                this.initCalculator(calcContent);
            }
        } else if (appName === 'settings') {
            const settingsContent = window.querySelector('.settings-content');
            if (settingsContent) {
                this.initSettings(settingsContent);
            }
        } else if (appName === 'browser') {
            this.initBrowser(window);
        }
    }

    addWindowEvents(windowEl, appName) {
        const header = windowEl.querySelector('.window-header');
        const closeBtn = windowEl.querySelector('.window-control.close');
        const minimizeBtn = windowEl.querySelector('.window-control.minimize');
        const maximizeBtn = windowEl.querySelector('.window-control.maximize');

        // 拖动功能（使用全局拖动状态，避免内存泄漏）
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-control')) return;

            this.dragState.isDragging = true;
            this.dragState.appName = appName;
            this.dragState.initialX = e.clientX - windowEl.offsetLeft;
            this.dragState.initialY = e.clientY - windowEl.offsetTop;

            this.focusWindow(appName);
        });

        // 点击窗口聚焦
        windowEl.addEventListener('mousedown', (e) => {
            this.focusWindow(appName);
            // 如果点击的是终端，聚焦输入框
            if (appName === 'terminal' && !e.target.classList.contains('window-control')) {
                const input = windowEl.querySelector('.terminal-input');
                if (input) {
                    setTimeout(() => input.focus(), 0);
                }
            }
        });

        // 窗口控制按钮
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(appName);
        });

        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(appName);
        });

        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.maximizeWindow(appName);
        });

        // 双击标题栏最小化
        header.addEventListener('dblclick', (e) => {
            if (!e.target.classList.contains('window-control')) {
                this.minimizeWindow(appName);
            }
        });
    }

    closeWindow(appName) {
        const windowEl = this.windows.get(appName);
        if (windowEl) {
            windowEl.remove();
            this.windows.delete(appName);

            if (appName === 'notes') {
                this.notesContext = null;
                this.currentNoteId = null;
            }
            if (appName === 'browser') {
                this.browserContext = null;
                this.pendingBrowserSource = null;
                // 清理浏览器历史记录，避免内存泄漏
                this.browserHistory = { entries: [], index: -1 };
            }

            // 更新 Dock
            const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
            if (dockItem) {
                dockItem.classList.remove('active');
            }
        }
    }

    minimizeWindow(appName) {
        const windowEl = this.windows.get(appName);
        if (windowEl) {
            windowEl.classList.add('minimizing');
            setTimeout(() => {
                windowEl.style.display = 'none';
                windowEl.classList.remove('minimizing');
            }, 300);
        }
    }

    maximizeWindow(appName) {
        const windowEl = this.windows.get(appName);
        if (!windowEl) return;

        // 计算器不允许最大化
        if (appName === 'calculator') return;

        if (windowEl.dataset.maximized === 'true') {
            // 还原
            windowEl.style.width = windowEl.dataset.originalWidth;
            windowEl.style.height = windowEl.dataset.originalHeight;
            windowEl.style.left = windowEl.dataset.originalLeft;
            windowEl.style.top = windowEl.dataset.originalTop;
            windowEl.dataset.maximized = 'false';
        } else {
            // 最大化
            windowEl.dataset.originalWidth = windowEl.style.width;
            windowEl.dataset.originalHeight = windowEl.style.height;
            windowEl.dataset.originalLeft = windowEl.style.left;
            windowEl.dataset.originalTop = windowEl.style.top;

            windowEl.style.width = 'calc(100vw - 20px)';
            windowEl.style.height = 'calc(100vh - 120px)';
            windowEl.style.left = '10px';
            windowEl.style.top = '34px';
            windowEl.dataset.maximized = 'true';
        }
    }

    focusWindow(appName) {
        this.deactivateAllWindows();
        const windowEl = this.windows.get(appName);
        if (windowEl) {
            windowEl.style.display = 'flex';
            windowEl.style.zIndex = this.zIndexCounter++;
            this.activeWindow = appName;

            // 更新菜单栏
            const config = this.getAppConfig(appName);
            if (config) {
                this.updateMenuBarAppName(config.title);
            }
        }
    }

    deactivateAllWindows() {
        // 可以在这里添加视觉反馈
    }

    updateMenuBarAppName(name) {
        const menuAppName = document.querySelector('.menu-app-name');
        if (menuAppName) {
            menuAppName.textContent = name;
        }
    }

    // 各应用内容创建方法

    createFinderContent() {
        return `
            <div class="finder-content">
                <div class="finder-sidebar">
                    <div class="finder-section">
                        <div class="finder-section-title">个人收藏</div>
                        <div class="finder-item active" data-finder-filter="all">
                            <svg class="finder-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <span>所有文件</span>
                        </div>
                        <div class="finder-item" data-finder-filter="note">
                            <svg class="finder-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5a2 2 0 0 1 2-2h10l6 6v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                            <span>备忘录</span>
                        </div>
                        <div class="finder-item" data-finder-filter="text">
                            <svg class="finder-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 0v5h5"/></svg>
                            <span>文本</span>
                        </div>
                        <div class="finder-item" data-finder-filter="page">
                            <svg class="finder-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v12H5.17L4 17.17V4zm2 14h14v2H4v-3.17z"/></svg>
                            <span>网页</span>
                        </div>
                    </div>
                </div>
                <div class="finder-main">
                    <div class="finder-toolbar">
                        <div class="finder-path">我的文件</div>
                        <div class="finder-actions">
                            <button class="finder-refresh-button" data-finder-refresh>刷新</button>
                        </div>
                    </div>
                    <div class="finder-files" data-finder-files></div>
                    <div class="finder-empty" data-finder-empty>
                        <div>还没有文件，尝试在终端使用 <code>touch demo.txt</code> 创建一个，或者在备忘录中新建内容。</div>
                    </div>
                </div>
            </div>
        `;
    }

    initFinder(window) {
        window.dataset.finderFilter = window.dataset.finderFilter || 'all';
        const filterItems = window.querySelectorAll('[data-finder-filter]');
        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                window.dataset.finderFilter = item.dataset.finderFilter;
                this.renderFinderFiles(window);
            });
        });

        const refreshButton = window.querySelector('[data-finder-refresh]');
        refreshButton?.addEventListener('click', () => this.renderFinderFiles(window));

        this.renderFinderFiles(window);
    }

    renderFinderFiles(window) {
        const filesContainer = window.querySelector('[data-finder-files]');
        const emptyState = window.querySelector('[data-finder-empty]');
        if (!filesContainer) return;

        const filter = window.dataset.finderFilter || 'all';
        let files = this.listFiles();
        if (filter !== 'all') {
            files = files.filter(file => file.type === filter);
        }

        files.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

        filesContainer.innerHTML = '';
        if (files.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'finder-file';
            item.dataset.fileName = file.name;

            // 安全修复：使用DOM方法构建，避免XSS
            const icon = document.createElement('div');
            icon.className = 'finder-file-icon';
            icon.innerHTML = this.getFinderIcon(file.type);

            const info = document.createElement('div');
            info.className = 'finder-file-info';

            const fileName = document.createElement('div');
            fileName.className = 'finder-file-name';
            fileName.textContent = file.title || file.name;

            const fileMeta = document.createElement('div');
            fileMeta.className = 'finder-file-meta';
            fileMeta.textContent = `${file.name} · ${new Date(file.updatedAt || Date.now()).toLocaleString('zh-CN', { hour12: false })}`;

            const filePreview = document.createElement('div');
            filePreview.className = 'finder-file-preview';
            filePreview.textContent = this.getFilePreview(file);

            info.appendChild(fileName);
            info.appendChild(fileMeta);
            info.appendChild(filePreview);

            item.appendChild(icon);
            item.appendChild(info);

            item.addEventListener('click', () => {
                filesContainer.querySelectorAll('.finder-file').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
            });

            item.addEventListener('dblclick', () => {
                this.openFileFromFinder(file);
            });

            filesContainer.appendChild(item);
        });
    }

    getFinderIcon(type) {
        switch (type) {
            case 'note':
                return '<svg viewBox="0 0 48 48" width="48" height="48"><rect x="8" y="6" width="32" height="36" rx="6" fill="#FFF5CC"/><rect x="12" y="10" width="24" height="4" rx="2" fill="#FBC02D"/><rect x="12" y="18" width="20" height="4" rx="2" fill="#F57F17"/><rect x="12" y="26" width="20" height="4" rx="2" fill="#F57F17"/><rect x="12" y="34" width="12" height="4" rx="2" fill="#F57F17"/></svg>';
            case 'page':
                return '<svg viewBox="0 0 48 48" width="48" height="48"><path d="M12 4h18l10 10v24a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6z" fill="#E3F2FD"/><path d="M30 4v12h12" fill="#BBDEFB"/><rect x="14" y="20" width="20" height="3" rx="1.5" fill="#1E88E5"/><rect x="14" y="27" width="16" height="3" rx="1.5" fill="#64B5F6"/><rect x="14" y="34" width="22" height="3" rx="1.5" fill="#90CAF9"/></svg>';
            default:
                return '<svg viewBox="0 0 48 48" width="48" height="48"><path d="M12 4h18l10 10v24a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6z" fill="#ECEFF1"/><path d="M30 4v10a2 2 0 0 0 2 2h10" fill="#CFD8DC"/><rect x="16" y="22" width="16" height="2" rx="1" fill="#607D8B"/><rect x="16" y="28" width="12" height="2" rx="1" fill="#90A4AE"/><rect x="16" y="34" width="20" height="2" rx="1" fill="#B0BEC5"/></svg>';
        }
    }

    getFilePreview(file) {
        if (!file.content) return '（空文件）';
        const text = String(file.content).replace(/<[^>]+>/g, ' ');
        const firstLine = text.split(/\r?\n/).find(line => line.trim());
        return firstLine ? firstLine.trim().slice(0, 60) : '（空文件）';
    }

    openFileFromFinder(file) {
        if (!file) return;
        this.openFileByName(file.name);
    }

    openFileByName(name) {
        const file = this.readFile(name);
        if (!file) {
            return false;
        }
        if (file.type === 'page') {
            if (this.windows.has('browser')) {
                this.focusWindow('browser');
                if (this.browserContext?.load) {
                    this.browserContext.load(file.name);
                    this.pendingBrowserSource = null;
                } else {
                    this.pendingBrowserSource = file.name;
                }
            } else {
                this.pendingBrowserSource = file.name;
                this.openApp('browser');
            }
        } else {
            this.pendingNoteToOpen = file.name;
            if (this.windows.has('notes')) {
                this.focusWindow('notes');
                this.notesContext?.renderList?.();
            } else {
                this.openApp('notes');
            }
        }
        return true;
    }

    createTerminalContent() {
        return `
            <div class="terminal-content" data-terminal="true">
                <div class="terminal-line">Last login: ${new Date().toLocaleString('zh-CN')}</div>
                <div class="terminal-line">macOS Web Simulator v1.1</div>
                <div class="terminal-line">&nbsp;</div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">user@macos ~ % </span>
                    <input type="text" class="terminal-input" autofocus />
                </div>
            </div>
        `;
    }

    executeTerminalCommand(terminal, command) {
        const inputLine = terminal.querySelector('.terminal-input-line');

        // 显示输入的命令（安全修复：使用textContent防止XSS）
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';

        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = 'user@macos ~ % ';

        const cmdText = document.createTextNode(command || '');

        commandLine.appendChild(prompt);
        commandLine.appendChild(cmdText);
        terminal.insertBefore(commandLine, inputLine);

        if (command === '') {
            // 只显示空行
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }

        const respond = (text) => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.textContent = text;
            terminal.insertBefore(line, inputLine);
        };

        const trimmed = command.trim();
        const [baseCommand, ...rawArgs] = trimmed.split(/\s+/);
        const args = rawArgs;

        const commands = {
            date: () => respond(new Date().toLocaleString('zh-CN')),
            pwd: () => respond('/Users/user'),
            whoami: () => respond('user'),
            uname: () => respond('Darwin macOS Web 1.1')
        };

        if (trimmed === 'clear') {
            terminal.querySelectorAll('.terminal-line').forEach(line => line.remove());
            terminal.scrollTop = terminal.scrollHeight;
            return;
        }

        if (trimmed.startsWith('echo ')) {
            respond(trimmed.substring(5));
        } else if (baseCommand === 'help') {
            [
                '可用命令:',
                '  help                显示当前帮助',
                '  clear               清屏',
                '  date                显示当前时间',
                '  ls [type]           列出文件，可选过滤类型 note/text/page',
                '  cat <文件名>        查看文件内容',
                '  touch <文件名>      创建一个文本文件',
                '  write <文件名> <内容> 写入文本内容',
                '  rm <文件名>         删除文件',
                '  open <文件名>       在对应应用中打开文件',
                '  pwd / whoami / uname 与真实终端类似'
            ].forEach(respond);
        } else if (baseCommand === 'ls') {
            const filter = args[0];
            let files = this.listFiles();
            if (filter && ['note', 'text', 'page'].includes(filter)) {
                files = files.filter(file => file.type === filter);
            }
            if (!files.length) {
                respond('（没有文件）');
            } else {
                respond(files.map(file => `${file.name}` + (file.type ? ` [${file.type}]` : '')).join('  '));
            }
        } else if (baseCommand === 'cat') {
            const name = args[0];
            if (!name) {
                respond('用法: cat <文件名>');
            } else {
                const file = this.readFile(name);
                if (!file) {
                    respond(`未找到文件: ${name}`);
                } else if (file.type === 'page') {
                    respond('这是一个网页文件，请使用 open 命令在 Safari 中打开。');
                } else {
                    const content = file.content ? String(file.content) : '';
                    content.split(/\r?\n/).forEach(line => respond(line));
                    if (!content) {
                        respond('（空文件）');
                    }
                }
            }
        } else if (baseCommand === 'touch') {
            const name = args[0];
            if (!name) {
                respond('用法: touch <文件名>');
            } else {
                const existing = this.readFile(name);
                this.upsertFile(name, {
                    type: existing?.type || this.inferFileType(name),
                    title: existing?.title || name,
                    content: existing?.content || ''
                });
                respond(existing ? `已更新文件时间: ${name}` : `已创建文件: ${name}`);
            }
        } else if (baseCommand === 'write') {
            const match = trimmed.match(/^write\s+(\S+)\s+([\s\S]+)$/);
            if (!match) {
                respond('用法: write <文件名> <内容>');
            } else {
                const [, name, content] = match;
                const existing = this.readFile(name);
                this.upsertFile(name, {
                    type: existing?.type || this.inferFileType(name),
                    title: existing?.title || name,
                    content
                });
                respond(`已写入 ${name}`);
            }
        } else if (baseCommand === 'rm') {
            const name = args[0];
            if (!name) {
                respond('用法: rm <文件名>');
            } else {
                respond(this.deleteFile(name) ? `已删除 ${name}` : `未找到文件: ${name}`);
            }
        } else if (baseCommand === 'open') {
            const name = args[0];
            if (!name) {
                respond('用法: open <文件名>');
            } else if (this.openFileByName(name)) {
                respond(`正在打开 ${name} …`);
            } else {
                respond(`未找到文件: ${name}`);
            }
        } else if (commands[baseCommand]) {
            commands[baseCommand]();
        } else {
            respond(`zsh: command not found: ${command}`);
        }

        // 滚动到底部
        terminal.scrollTop = terminal.scrollHeight;

        // 重新聚焦输入框
        const input = terminal.querySelector('.terminal-input');
        if (input) input.focus();
    }

    createNotesContent() {
        return `
            <div class="notes-content">
                <div class="notes-sidebar">
                    <div class="notes-sidebar-header">
                        <div class="notes-sidebar-title">备忘录</div>
                        <button class="notes-new-button" data-notes-new title="新建备忘录">＋</button>
                    </div>
                    <div class="notes-list" data-notes-list></div>
                    <div class="notes-empty" data-notes-empty>暂无备忘录，点击右上角的 ＋ 创建一个。</div>
                </div>
                <div class="notes-editor">
                    <input type="text" class="notes-editor-title" placeholder="标题" data-note-title />
                    <textarea class="notes-editor-content" placeholder="开始输入..." data-note-content></textarea>
                    <div class="notes-status" data-note-status>选择一个备忘录开始编辑</div>
                </div>
            </div>
        `;
    }

    initNotes(window) {
        const listContainer = window.querySelector('[data-notes-list]');
        const emptyState = window.querySelector('[data-notes-empty]');
        const titleInput = window.querySelector('[data-note-title]');
        const contentInput = window.querySelector('[data-note-content]');
        const statusLabel = window.querySelector('[data-note-status]');
        const newButton = window.querySelector('[data-notes-new]');

        if (!listContainer || !titleInput || !contentInput) return;

        let saveTimeout = null;
        let applying = false;

        applying = true;
        titleInput.value = '';
        contentInput.value = '';
        titleInput.disabled = true;
        contentInput.disabled = true;
        statusLabel.textContent = '选择一个备忘录开始编辑';
        applying = false;

        const getNotes = () => this.listFiles(file => file.type === 'note' || file.type === 'text');

        const updateEmptyState = () => {
            const notes = getNotes();
            if (emptyState) {
                emptyState.style.display = notes.length === 0 ? 'block' : 'none';
            }
        };

        const scheduleSave = () => {
            if (!this.currentNoteId) return;
            clearTimeout(saveTimeout);
            if (statusLabel) {
                statusLabel.textContent = '正在保存…';
            }
            saveTimeout = setTimeout(() => {
                this.upsertFile(this.currentNoteId, {
                    type: this.readFile(this.currentNoteId)?.type || 'note',
                    title: titleInput.value.trim() || '未命名备忘录',
                    content: contentInput.value
                });
                if (statusLabel) {
                    statusLabel.textContent = '已保存';
                }
            }, 300);
        };

        const selectNote = (name) => {
            const file = this.readFile(name);
            if (!file) return;
            this.currentNoteId = name;
            applying = true;
            titleInput.value = file.title || file.name;
            contentInput.value = file.content || '';
            titleInput.disabled = false;
            contentInput.disabled = false;
            if (statusLabel) {
                statusLabel.textContent = '已载入';
            }
            listContainer.querySelectorAll('.notes-list-item').forEach(item => {
                item.classList.toggle('active', item.dataset.noteName === name);
            });
            applying = false;
        };

        const renderList = () => {
            const notes = getNotes();
            updateEmptyState();
            listContainer.innerHTML = '';

            notes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

            notes.forEach(file => {
                const item = document.createElement('div');
                item.className = 'notes-list-item';
                item.dataset.noteName = file.name;

                // 安全修复：使用textContent防止XSS
                const titleEl = document.createElement('div');
                titleEl.className = 'notes-item-title';
                titleEl.textContent = file.title || file.name;

                const previewEl = document.createElement('div');
                previewEl.className = 'notes-item-preview';
                previewEl.textContent = this.getFilePreview(file);

                item.appendChild(titleEl);
                item.appendChild(previewEl);

                item.addEventListener('click', () => selectNote(file.name));
                if (file.name === this.currentNoteId) {
                    item.classList.add('active');
                }
                listContainer.appendChild(item);
            });

            if (!this.currentNoteId && notes.length) {
                selectNote(notes[0].name);
            } else if (!notes.length) {
                applying = true;
                this.currentNoteId = null;
                titleInput.value = '';
                contentInput.value = '';
                titleInput.disabled = true;
                contentInput.disabled = true;
                if (statusLabel) {
                    statusLabel.textContent = '暂无备忘录';
                }
                applying = false;
            }
        };

        titleInput.addEventListener('input', () => {
            if (applying) return;
            scheduleSave();
        });

        contentInput.addEventListener('input', () => {
            if (applying) return;
            scheduleSave();
        });

        if (newButton) {
            newButton.addEventListener('click', () => {
                const fileName = this.createNoteFile();
                renderList();
                selectNote(fileName);
                titleInput.focus();
            });
        }

        this.notesContext = {
            renderList: () => {
                const previous = this.currentNoteId;
                renderList();
                if (this.pendingNoteToOpen) {
                    selectNote(this.pendingNoteToOpen);
                    this.pendingNoteToOpen = null;
                } else if (previous) {
                    selectNote(previous);
                }
            }
        };

        renderList();

        if (this.pendingNoteToOpen) {
            selectNote(this.pendingNoteToOpen);
            this.pendingNoteToOpen = null;
        }
    }

    createNoteFile() {
        let index = 1;
        let name = `note-${index}`;
        while (this.fileSystem[name]) {
            index += 1;
            name = `note-${index}`;
        }
        this.upsertFile(name, {
            type: 'note',
            title: `新备忘录 ${index}`,
            content: ''
        });
        return name;
    }

    createCalculatorContent() {
        return `
            <div class="calculator-content">
                <div class="calculator-display">0</div>
                <div class="calculator-buttons">
                    <button class="calculator-button function"><span>AC</span></button>
                    <button class="calculator-button function"><span>±</span></button>
                    <button class="calculator-button function"><span>%</span></button>
                    <button class="calculator-button operator"><span>÷</span></button>

                    <button class="calculator-button"><span>7</span></button>
                    <button class="calculator-button"><span>8</span></button>
                    <button class="calculator-button"><span>9</span></button>
                    <button class="calculator-button operator"><span>×</span></button>

                    <button class="calculator-button"><span>4</span></button>
                    <button class="calculator-button"><span>5</span></button>
                    <button class="calculator-button"><span>6</span></button>
                    <button class="calculator-button operator"><span>−</span></button>

                    <button class="calculator-button"><span>1</span></button>
                    <button class="calculator-button"><span>2</span></button>
                    <button class="calculator-button"><span>3</span></button>
                    <button class="calculator-button operator"><span>+</span></button>

                    <button class="calculator-button zero"><span>0</span></button>
                    <button class="calculator-button"><span>.</span></button>
                    <button class="calculator-button operator"><span>=</span></button>
                </div>
            </div>
        `;
    }

    initCalculator(container) {
        const display = container.querySelector('.calculator-display');
        const buttons = container.querySelectorAll('.calculator-button');
        
        let currentValue = '0';
        let previousValue = null;
        let operation = null;
        let shouldResetDisplay = false;

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.textContent;

                if ((value >= '0' && value <= '9') || value === '.') {
                    if (value === '.' && currentValue.includes('.')) {
                        return; // 不允许多个小数点
                    }
                    if (shouldResetDisplay) {
                        currentValue = value === '.' ? '0.' : value;
                        shouldResetDisplay = false;
                    } else {
                        if (currentValue === '0' && value !== '.') {
                            currentValue = value;
                        } else {
                            currentValue = currentValue + value;
                        }
                    }
                    display.textContent = currentValue;
                } else if (value === 'AC') {
                    currentValue = '0';
                    previousValue = null;
                    operation = null;
                    shouldResetDisplay = false;
                    display.textContent = '0';
                } else if (value === '±') {
                    // 安全修复：验证数值有效性，防止显示NaN
                    const num = parseFloat(currentValue);
                    if (!isFinite(num)) {
                        display.textContent = 'Error';
                        currentValue = '0';
                        shouldResetDisplay = true;
                        return;
                    }
                    currentValue = String(num === 0 ? 0 : -num);
                    display.textContent = currentValue;
                } else if (value === '%') {
                    // 安全修复：验证数值有效性，防止显示NaN
                    const num = parseFloat(currentValue);
                    if (!isFinite(num)) {
                        display.textContent = 'Error';
                        currentValue = '0';
                        shouldResetDisplay = true;
                        return;
                    }
                    currentValue = String(num / 100);
                    display.textContent = currentValue;
                } else if (['+', '−', '×', '÷'].includes(value)) {
                    // 只有在用户已输入第二个操作数后才执行待处理的运算
                    // 这样允许用户在输入第二个数字前切换运算符
                    if (previousValue !== null && operation !== null && !shouldResetDisplay) {
                        const result = this.calculate(previousValue, currentValue, operation);
                        if (result === 'Error') {
                            display.textContent = result;
                            currentValue = '0';
                            previousValue = null;
                            operation = null;
                            shouldResetDisplay = false;
                            return;
                        }
                        display.textContent = result;
                        currentValue = result;
                    }
                    previousValue = currentValue;
                    operation = value;
                    shouldResetDisplay = true;
                } else if (value === '=') {
                    if (previousValue !== null && operation !== null) {
                        const result = this.calculate(previousValue, currentValue, operation);
                        if (result === 'Error') {
                            display.textContent = result;
                            currentValue = '0';
                            previousValue = null;
                            operation = null;
                            shouldResetDisplay = false;
                            return;
                        }
                        display.textContent = result;
                        currentValue = result;
                        previousValue = null;
                        operation = null;
                        shouldResetDisplay = true;
                    }
                }
            });
        });
    }

    calculate(a, b, op) {
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);
        
        if (isNaN(num1) || isNaN(num2)) return 'Error';
        
        let result;
        switch (op) {
            case '+': result = num1 + num2; break;
            case '−': result = num1 - num2; break;
            case '×': result = num1 * num2; break;
            case '÷': 
                if (num2 === 0) return 'Error';
                result = num1 / num2;
                break;
            default: return String(b);
        }
        
        // 格式化结果，避免浮点精度问题
        if (Math.abs(result) < 1e-10) result = 0;
        const formatted = result.toString();
        return formatted.length > 12 ? result.toExponential(6) : formatted;
    }

    createSettingsContent() {
        return `
            <div class="settings-content">
                <div class="settings-sidebar">
                    <div class="settings-item" data-category="general">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
                        </div>
                        <div class="settings-item-label">通用</div>
                    </div>
                    <div class="settings-item active" data-category="wallpaper">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 17l3.5-4.5 2.5 3.01L14.5 11l4.5 6H5z"/></svg>
                        </div>
                        <div class="settings-item-label">壁纸</div>
                    </div>
                    <div class="settings-item" data-category="appearance">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                        </div>
                        <div class="settings-item-label">外观</div>
                    </div>
                    <div class="settings-item" data-category="display">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
                        </div>
                        <div class="settings-item-label">显示器</div>
                    </div>
                    <div class="settings-item" data-category="security">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                        </div>
                        <div class="settings-item-label">安全性与隐私</div>
                    </div>
                    <div class="settings-item" data-category="notifications">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                        </div>
                        <div class="settings-item-label">通知</div>
                    </div>
                    <div class="settings-item" data-category="network">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        </div>
                        <div class="settings-item-label">网络</div>
                    </div>
                </div>
                <div class="settings-main" id="settingsMain">
                    <div class="settings-section" data-settings-panel="wallpaper">
                        <div class="settings-section-title">桌面壁纸</div>
                        <div class="wallpaper-grid">
                            <div class="wallpaper-option" data-wallpaper="gradient1">
                                <div class="wallpaper-preview" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
                                <div class="wallpaper-name">紫色渐变</div>
                            </div>
                            <div class="wallpaper-option" data-wallpaper="gradient2">
                                <div class="wallpaper-preview" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
                                <div class="wallpaper-name">粉红渐变</div>
                            </div>
                            <div class="wallpaper-option" data-wallpaper="gradient3">
                                <div class="wallpaper-preview" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);"></div>
                                <div class="wallpaper-name">蓝色渐变</div>
                            </div>
                            <div class="wallpaper-option" data-wallpaper="gradient4">
                                <div class="wallpaper-preview" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);"></div>
                                <div class="wallpaper-name">绿色渐变</div>
                            </div>
                            <div class="wallpaper-option" data-wallpaper="gradient5">
                                <div class="wallpaper-preview" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);"></div>
                                <div class="wallpaper-name">暖色渐变</div>
                            </div>
                            <div class="wallpaper-option" data-wallpaper="solid-dark">
                                <div class="wallpaper-preview" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);"></div>
                                <div class="wallpaper-name">深色</div>
                            </div>
                            <div class="wallpaper-option" data-wallpaper="solid-light">
                                <div class="wallpaper-preview" style="background: linear-gradient(135deg, #e3e3e3 0%, #c9c9c9 100%);"></div>
                                <div class="wallpaper-name">浅色</div>
                            </div>
                        </div>
                        <div class="settings-option" style="margin-top: 20px;">
                            <div class="settings-option-info">
                                <div class="settings-option-label">自定义壁纸URL</div>
                                <div class="settings-option-desc">输入图片URL地址</div>
                            </div>
                        </div>
                        <div style="margin-top: 12px;">
                            <input type="text" class="wallpaper-url-input" placeholder="https://example.com/image.jpg" />
                            <button class="wallpaper-apply-button">应用</button>
                        </div>
                    </div>
                    <div class="settings-section" data-settings-panel="general" style="display: none;">
                        <div class="settings-section-title">通用设置</div>
                        <div class="settings-option">
                            <div class="settings-option-info">
                                <div class="settings-option-label">深色模式</div>
                                <div class="settings-option-desc">使用深色外观</div>
                            </div>
                            <div class="settings-toggle active" data-setting="dark-mode">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-info">
                                <div class="settings-option-label">自动隐藏菜单栏</div>
                                <div class="settings-option-desc">移开光标时自动隐藏菜单栏</div>
                            </div>
                            <div class="settings-toggle" data-setting="hide-menu">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-info">
                                <div class="settings-option-label">自动隐藏程序坞</div>
                                <div class="settings-option-desc">移开光标时自动隐藏程序坞</div>
                            </div>
                            <div class="settings-toggle" data-setting="hide-dock">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                    <div class="settings-section">
                        <div class="settings-section-title">系统偏好设置</div>
                        <div class="settings-option">
                            <div class="settings-option-info">
                                <div class="settings-option-label">启用屏幕保护程序</div>
                                <div class="settings-option-desc">空闲时启动屏幕保护程序</div>
                            </div>
                            <div class="settings-toggle active" data-setting="screensaver">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-info">
                                <div class="settings-option-label">显示电池百分比</div>
                                <div class="settings-option-desc">在菜单栏显示电池电量百分比</div>
                            </div>
                            <div class="settings-toggle active" data-setting="battery-percent">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-info">
                                <div class="settings-option-label">窗口动画效果</div>
                                <div class="settings-option-desc">打开和关闭窗口时的动画效果</div>
                            </div>
                            <div class="settings-toggle active" data-setting="animations">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initSettings(container) {
        const toggles = container.querySelectorAll('.settings-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const setting = toggle.dataset.setting;
                console.log(`Setting ${setting} toggled:`, toggle.classList.contains('active'));
            });
        });

        const sidebarItems = container.querySelectorAll('.settings-item');
        const panels = container.querySelectorAll('[data-settings-panel]');
        
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const category = item.dataset.category;
                
                // 切换面板
                panels.forEach(panel => {
                    panel.style.display = panel.dataset.settingsPanel === category ? 'block' : 'none';
                });
            });
        });

        // 壁纸选择
        const wallpaperOptions = container.querySelectorAll('.wallpaper-option');
        wallpaperOptions.forEach(option => {
            option.addEventListener('click', () => {
                wallpaperOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                const wallpaperType = option.dataset.wallpaper;
                this.setWallpaper(wallpaperType);
            });
        });

        // 自定义壁纸URL
        const urlInput = container.querySelector('.wallpaper-url-input');
        const applyButton = container.querySelector('.wallpaper-apply-button');
        if (applyButton && urlInput) {
            applyButton.addEventListener('click', () => {
                const url = urlInput.value.trim();
                if (url) {
                    this.setWallpaper(null, url);
                    wallpaperOptions.forEach(opt => opt.classList.remove('selected'));
                }
            });
        }

        // 标记当前选中的壁纸
        const currentWallpaper = this.wallpaper;
        wallpaperOptions.forEach(option => {
            if (option.dataset.wallpaper === currentWallpaper) {
                option.classList.add('selected');
            }
        });
    }

    createBrowserContent() {
        return `
            <div class="browser-content">
                <div class="browser-toolbar">
                    <div class="browser-nav-buttons">
                        <button class="browser-nav-button" data-browser-back title="后退">←</button>
                        <button class="browser-nav-button" data-browser-forward title="前进">→</button>
                    </div>
                    <div class="browser-address-bar">
                        <input type="text" class="browser-address-input" placeholder="输入网址或文件名，如 safari-tips.html" />
                        <button class="browser-go-button" data-browser-go>前往</button>
                        <select class="browser-file-select" data-browser-file>
                            <option value="">打开文件…</option>
                        </select>
                    </div>
                </div>
                <div class="browser-viewport">
                    <div class="browser-page" data-browser-page></div>
                </div>
            </div>
        `;
    }

    initBrowser(window) {
        const backButton = window.querySelector('[data-browser-back]');
        const forwardButton = window.querySelector('[data-browser-forward]');
        const goButton = window.querySelector('[data-browser-go]');
        const addressInput = window.querySelector('.browser-address-input');
        const pageContainer = window.querySelector('[data-browser-page]');
        const fileSelect = window.querySelector('[data-browser-file]');

        if (!addressInput || !pageContainer) return;

        this.browserHistory = { entries: [], index: -1 };

        const updateNavButtons = () => {
            if (backButton) {
                backButton.disabled = this.browserHistory.index <= 0;
            }
            if (forwardButton) {
                forwardButton.disabled = this.browserHistory.index >= this.browserHistory.entries.length - 1;
            }
        };

        const renderContent = (html, sourceLabel) => {
            pageContainer.innerHTML = html;
            if (sourceLabel) {
                addressInput.value = sourceLabel;
            }
        };

        const loadSource = (source, pushHistory = true) => {
            if (!source) {
                renderContent('<div class="browser-welcome"><h1>欢迎使用 Safari</h1><p>输入网址或选择文件以开始浏览。</p></div>');
                if (fileSelect) fileSelect.value = '';
                return;
            }

            const trimmed = source.trim();
            const file = this.readFile(trimmed);

            if (file) {
                if (file.type === 'page') {
                    renderContent(file.content || '<p>该网页没有内容。</p>', file.name);
                } else {
                    const text = (file.content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    renderContent(`<pre class="browser-text-viewer">${text}</pre>`, file.name);
                }
            } else if (/^https?:\/\//i.test(trimmed)) {
                renderContent(`<div class="browser-placeholder"><h2>离线模式</h2><p>当前模拟器不支持直接访问互联网。您可以将需要的网页保存为文件后在此查看。</p><p>尝试打开文件: <code>safari-tips.html</code></p></div>`, trimmed);
            } else {
                renderContent(`<div class="browser-placeholder"><h2>未找到资源</h2><p>找不到名为 <strong>${trimmed}</strong> 的文件。</p><p>可使用终端命令 <code>write ${trimmed} 内容</code> 创建一个文本文件。</p></div>`, trimmed);
            }

            if (fileSelect) {
                const hasOption = Array.from(fileSelect.options).some(option => option.value === trimmed);
                fileSelect.value = hasOption ? trimmed : '';
            }

            if (pushHistory) {
                this.browserHistory.entries = this.browserHistory.entries.slice(0, this.browserHistory.index + 1);
                this.browserHistory.entries.push(trimmed);
                this.browserHistory.index = this.browserHistory.entries.length - 1;
            }

            updateNavButtons();
        };

        backButton?.addEventListener('click', () => {
            if (this.browserHistory.index > 0) {
                this.browserHistory.index -= 1;
                const target = this.browserHistory.entries[this.browserHistory.index];
                loadSource(target, false);
            }
        });

        forwardButton?.addEventListener('click', () => {
            if (this.browserHistory.index < this.browserHistory.entries.length - 1) {
                this.browserHistory.index += 1;
                const target = this.browserHistory.entries[this.browserHistory.index];
                loadSource(target, false);
            }
        });

        goButton?.addEventListener('click', () => {
            loadSource(addressInput.value, true);
        });

        addressInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                loadSource(addressInput.value, true);
            }
        });

        fileSelect?.addEventListener('change', () => {
            if (fileSelect.value) {
                loadSource(fileSelect.value, true);
            }
        });

        this.updateBrowserFileOptions(window);

        if (this.pendingBrowserSource) {
            loadSource(this.pendingBrowserSource, true);
            this.pendingBrowserSource = null;
        } else {
            loadSource('', false);
        }

        updateNavButtons();

        this.browserContext = {
            window,
            load: (source) => loadSource(source, true),
            updateOptions: () => this.updateBrowserFileOptions(window)
        };
    }

    updateBrowserFileOptions(window) {
        const select = window.querySelector('[data-browser-file]');
        if (!select) return;

        const currentValue = select.value;
        select.innerHTML = '<option value="">打开文件…</option>';
        const files = this.listFiles(file => ['page', 'note', 'text'].includes(file.type));
        files.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file.name;
            option.textContent = `${file.title || file.name} (${file.type})`;
            select.appendChild(option);
        });
        if (currentValue && Array.from(select.options).some(option => option.value === currentValue)) {
            select.value = currentValue;
        } else {
            select.value = '';
        }
    }
}

// 初始化 macOS
document.addEventListener('DOMContentLoaded', () => {
    new MacOS();
});
