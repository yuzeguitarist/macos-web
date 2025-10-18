// macOS Web Simulator

class MacOS {
    constructor() {
        this.windows = new Map();
        this.zIndexCounter = 100;
        this.activeWindow = null;
        this.init();
    }

    init() {
        // 启动动画完成后显示桌面
        setTimeout(() => {
            document.getElementById('desktop').style.display = 'block';
            this.initEventListeners();
            this.updateTime();
            setInterval(() => this.updateTime(), 1000);
        }, 4000);
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
    }

    updateTime() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        };
        const timeStr = now.toLocaleString('zh-CN', options)
            .replace(/星期/, '周')
            .replace(/(\d+)月/, '$1月')
            .replace(/(\d+)日/, '$1日');
        
        const hour = now.getHours();
        const period = hour < 12 ? '上午' : '下午';
        
        document.getElementById('menuTime').textContent = timeStr.split(' ').slice(0, 2).join(' ') + ' ' + period + timeStr.split(' ').slice(2).join('');
    }

    openApp(appName) {
        // 如果应用已打开，聚焦该窗口
        if (this.windows.has(appName)) {
            this.focusWindow(appName);
            return;
        }

        const appConfig = this.getAppConfig(appName);
        if (!appConfig) return;

        const window = this.createWindow(appName, appConfig);
        this.windows.set(appName, window);
        
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
                width: 320,
                height: 520,
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
        const window = document.createElement('div');
        window.className = 'window';
        window.dataset.app = appName;
        window.style.width = config.width + 'px';
        window.style.height = config.height + 'px';
        
        // 居中显示
        const left = (window.innerWidth - config.width) / 2;
        const top = (window.innerHeight - config.height) / 2 - 30;
        window.style.left = left + 'px';
        window.style.top = Math.max(50, top) + 'px';
        window.style.zIndex = this.zIndexCounter++;

        window.innerHTML = `
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

        document.getElementById('windowsContainer').appendChild(window);

        // 添加窗口事件
        this.addWindowEvents(window, appName);
        
        // 设置为活动窗口
        this.focusWindow(appName);

        return window;
    }

    addWindowEvents(window, appName) {
        const header = window.querySelector('.window-header');
        const closeBtn = window.querySelector('.window-control.close');
        const minimizeBtn = window.querySelector('.window-control.minimize');
        const maximizeBtn = window.querySelector('.window-control.maximize');

        // 拖动功能
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-control')) return;
            
            isDragging = true;
            initialX = e.clientX - window.offsetLeft;
            initialY = e.clientY - window.offsetTop;
            
            this.focusWindow(appName);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            // 限制窗口不超出屏幕
            currentY = Math.max(24, currentY);
            
            window.style.left = currentX + 'px';
            window.style.top = currentY + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // 点击窗口聚焦
        window.addEventListener('mousedown', () => {
            this.focusWindow(appName);
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
        const window = this.windows.get(appName);
        if (window) {
            window.remove();
            this.windows.delete(appName);
            
            // 更新 Dock
            const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
            if (dockItem) {
                dockItem.classList.remove('active');
            }
        }
    }

    minimizeWindow(appName) {
        const window = this.windows.get(appName);
        if (window) {
            window.classList.add('minimizing');
            setTimeout(() => {
                window.style.display = 'none';
                window.classList.remove('minimizing');
            }, 300);
        }
    }

    maximizeWindow(appName) {
        const window = this.windows.get(appName);
        if (!window) return;

        if (window.dataset.maximized === 'true') {
            // 还原
            window.style.width = window.dataset.originalWidth;
            window.style.height = window.dataset.originalHeight;
            window.style.left = window.dataset.originalLeft;
            window.style.top = window.dataset.originalTop;
            window.dataset.maximized = 'false';
        } else {
            // 最大化
            window.dataset.originalWidth = window.style.width;
            window.dataset.originalHeight = window.style.height;
            window.dataset.originalLeft = window.style.left;
            window.dataset.originalTop = window.style.top;
            
            window.style.width = 'calc(100vw - 20px)';
            window.style.height = 'calc(100vh - 120px)';
            window.style.left = '10px';
            window.style.top = '34px';
            window.dataset.maximized = 'true';
        }
    }

    focusWindow(appName) {
        this.deactivateAllWindows();
        const window = this.windows.get(appName);
        if (window) {
            window.style.display = 'flex';
            window.style.zIndex = this.zIndexCounter++;
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
                        <div class="finder-item active">
                            <span class="finder-item-icon">⭐</span>
                            <span>最近使用</span>
                        </div>
                        <div class="finder-item">
                            <span class="finder-item-icon">📥</span>
                            <span>下载</span>
                        </div>
                        <div class="finder-item">
                            <span class="finder-item-icon">📄</span>
                            <span>文稿</span>
                        </div>
                        <div class="finder-item">
                            <span class="finder-item-icon">🖼️</span>
                            <span>图片</span>
                        </div>
                    </div>
                    <div class="finder-section">
                        <div class="finder-section-title">iCloud</div>
                        <div class="finder-item">
                            <span class="finder-item-icon">☁️</span>
                            <span>iCloud Drive</span>
                        </div>
                    </div>
                    <div class="finder-section">
                        <div class="finder-section-title">位置</div>
                        <div class="finder-item">
                            <span class="finder-item-icon">💻</span>
                            <span>我的 Mac</span>
                        </div>
                    </div>
                </div>
                <div class="finder-main">
                    <div class="finder-files">
                        <div class="finder-file">
                            <div class="finder-file-icon">📁</div>
                            <div class="finder-file-name">文件夹</div>
                        </div>
                        <div class="finder-file">
                            <div class="finder-file-icon">📄</div>
                            <div class="finder-file-name">文档.txt</div>
                        </div>
                        <div class="finder-file">
                            <div class="finder-file-icon">🖼️</div>
                            <div class="finder-file-name">图片.png</div>
                        </div>
                        <div class="finder-file">
                            <div class="finder-file-icon">🎵</div>
                            <div class="finder-file-name">音乐.mp3</div>
                        </div>
                        <div class="finder-file">
                            <div class="finder-file-icon">🎬</div>
                            <div class="finder-file-name">视频.mp4</div>
                        </div>
                        <div class="finder-file">
                            <div class="finder-file-icon">📦</div>
                            <div class="finder-file-name">压缩包.zip</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createTerminalContent() {
        const content = document.createElement('div');
        content.className = 'terminal-content';
        content.innerHTML = `
            <div class="terminal-line">Last login: ${new Date().toLocaleString('zh-CN')}</div>
            <div class="terminal-line">macOS Web Simulator v1.0</div>
            <div class="terminal-line">&nbsp;</div>
            <div class="terminal-input-line">
                <span class="terminal-prompt">user@macos ~ % </span>
                <input type="text" class="terminal-input" autofocus />
            </div>
        `;

        // 添加终端交互
        setTimeout(() => {
            const input = content.querySelector('.terminal-input');
            if (input) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const command = input.value.trim();
                        if (command) {
                            this.executeTerminalCommand(content, command);
                        }
                        input.value = '';
                    }
                });
            }
        }, 100);

        return content.outerHTML;
    }

    executeTerminalCommand(terminal, command) {
        const inputLine = terminal.querySelector('.terminal-input-line');
        
        // 显示输入的命令
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="terminal-prompt">user@macos ~ % </span>${command}`;
        terminal.insertBefore(commandLine, inputLine);

        // 执行命令
        const output = document.createElement('div');
        output.className = 'terminal-line';
        
        const commands = {
            'help': '可用命令: help, clear, date, echo, ls, pwd, whoami',
            'clear': 'CLEAR',
            'date': new Date().toLocaleString('zh-CN'),
            'ls': 'Desktop  Documents  Downloads  Pictures  Music  Videos',
            'pwd': '/Users/user',
            'whoami': 'user'
        };

        if (command === 'clear') {
            // 清空终端
            terminal.querySelectorAll('.terminal-line').forEach(line => line.remove());
        } else if (command.startsWith('echo ')) {
            output.textContent = command.substring(5);
            terminal.insertBefore(output, inputLine);
        } else if (commands[command]) {
            output.textContent = commands[command];
            terminal.insertBefore(output, inputLine);
        } else {
            output.textContent = `command not found: ${command}`;
            terminal.insertBefore(output, inputLine);
        }

        // 滚动到底部
        terminal.scrollTop = terminal.scrollHeight;
    }

    createNotesContent() {
        return `
            <div class="notes-content">
                <div class="notes-sidebar">
                    <div class="notes-list-item active">
                        <div class="notes-item-title">欢迎使用备忘录</div>
                        <div class="notes-item-preview">这是一个macOS风格的备忘录应用...</div>
                    </div>
                    <div class="notes-list-item">
                        <div class="notes-item-title">待办事项</div>
                        <div class="notes-item-preview">今天要完成的任务列表...</div>
                    </div>
                    <div class="notes-list-item">
                        <div class="notes-item-title">想法记录</div>
                        <div class="notes-item-preview">一些随机的想法和灵感...</div>
                    </div>
                </div>
                <div class="notes-editor">
                    <input type="text" class="notes-editor-title" placeholder="标题" value="欢迎使用备忘录" />
                    <textarea class="notes-editor-content" placeholder="开始输入...">这是一个高度还原的macOS备忘录应用。

你可以在这里记录：
• 重要的想法和灵感
• 待办事项列表
• 会议笔记
• 日常计划

备忘录会自动保存你的所有内容。</textarea>
                </div>
            </div>
        `;
    }

    createCalculatorContent() {
        const content = document.createElement('div');
        content.className = 'calculator-content';
        content.innerHTML = `
            <div class="calculator-display">0</div>
            <div class="calculator-buttons">
                <button class="calculator-button function">AC</button>
                <button class="calculator-button function">±</button>
                <button class="calculator-button function">%</button>
                <button class="calculator-button operator">÷</button>
                
                <button class="calculator-button">7</button>
                <button class="calculator-button">8</button>
                <button class="calculator-button">9</button>
                <button class="calculator-button operator">×</button>
                
                <button class="calculator-button">4</button>
                <button class="calculator-button">5</button>
                <button class="calculator-button">6</button>
                <button class="calculator-button operator">−</button>
                
                <button class="calculator-button">1</button>
                <button class="calculator-button">2</button>
                <button class="calculator-button">3</button>
                <button class="calculator-button operator">+</button>
                
                <button class="calculator-button zero">0</button>
                <button class="calculator-button">.</button>
                <button class="calculator-button operator">=</button>
            </div>
        `;

        // 添加计算器逻辑
        setTimeout(() => {
            this.initCalculator(content);
        }, 100);

        return content.outerHTML;
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

                if (value >= '0' && value <= '9' || value === '.') {
                    if (shouldResetDisplay) {
                        currentValue = value;
                        shouldResetDisplay = false;
                    } else {
                        currentValue = currentValue === '0' ? value : currentValue + value;
                    }
                    display.textContent = currentValue;
                } else if (value === 'AC') {
                    currentValue = '0';
                    previousValue = null;
                    operation = null;
                    display.textContent = '0';
                } else if (value === '±') {
                    currentValue = String(-parseFloat(currentValue));
                    display.textContent = currentValue;
                } else if (value === '%') {
                    currentValue = String(parseFloat(currentValue) / 100);
                    display.textContent = currentValue;
                } else if (['+', '−', '×', '÷'].includes(value)) {
                    if (previousValue !== null && operation !== null && !shouldResetDisplay) {
                        const result = this.calculate(previousValue, currentValue, operation);
                        display.textContent = result;
                        currentValue = result;
                    }
                    previousValue = currentValue;
                    operation = value;
                    shouldResetDisplay = true;
                } else if (value === '=') {
                    if (previousValue !== null && operation !== null) {
                        const result = this.calculate(previousValue, currentValue, operation);
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
        
        switch (op) {
            case '+': return String(num1 + num2);
            case '−': return String(num1 - num2);
            case '×': return String(num1 * num2);
            case '÷': return num2 !== 0 ? String(num1 / num2) : 'Error';
            default: return b;
        }
    }

    createSettingsContent() {
        return `
            <div class="settings-content">
                <div class="settings-sidebar">
                    <div class="settings-item active">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">⚙️</div>
                        <div class="settings-item-label">通用</div>
                    </div>
                    <div class="settings-item">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">🎨</div>
                        <div class="settings-item-label">外观</div>
                    </div>
                    <div class="settings-item">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">🖥️</div>
                        <div class="settings-item-label">显示器</div>
                    </div>
                    <div class="settings-item">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">🔒</div>
                        <div class="settings-item-label">安全性与隐私</div>
                    </div>
                    <div class="settings-item">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">🔔</div>
                        <div class="settings-item-label">通知</div>
                    </div>
                    <div class="settings-item">
                        <div class="settings-item-icon" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">🌐</div>
                        <div class="settings-item-label">网络</div>
                    </div>
                </div>
                <div class="settings-main">
                    <div class="settings-section">
                        <div class="settings-section-title">通用设置</div>
                        <div class="settings-option">
                            <div class="settings-option-label">外观模式</div>
                            <div class="settings-toggle active">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-label">自动隐藏菜单栏</div>
                            <div class="settings-toggle">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-label">自动隐藏程序坞</div>
                            <div class="settings-toggle">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                    <div class="settings-section">
                        <div class="settings-section-title">系统偏好设置</div>
                        <div class="settings-option">
                            <div class="settings-option-label">启用屏幕保护程序</div>
                            <div class="settings-toggle active">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-label">显示电池百分比</div>
                            <div class="settings-toggle active">
                                <div class="settings-toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createBrowserContent() {
        return `
            <div class="browser-content">
                <div class="browser-toolbar">
                    <div class="browser-nav-buttons">
                        <button class="browser-nav-button">←</button>
                        <button class="browser-nav-button">→</button>
                    </div>
                    <div class="browser-address-bar">
                        <input type="text" class="browser-address-input" value="https://www.apple.com" readonly />
                    </div>
                </div>
                <div class="browser-viewport">
                    <div class="browser-page">
                        <h1>欢迎使用 Safari</h1>
                        <p>Safari 是由 Apple 开发的快速、高效且极具安全性的浏览器。</p>
                        <p>它专为 Mac、iPhone 和 iPad 而设计，提供业界领先的隐私保护功能。</p>
                        <p>享受流畅的浏览体验，同时保护您的在线隐私。</p>
                        <br />
                        <h2>主要特性</h2>
                        <p>• 智能防跟踪技术</p>
                        <p>• 内置密码管理器</p>
                        <p>• 快速而高效的性能</p>
                        <p>• 与所有 Apple 设备无缝协作</p>
                        <p>• 节能技术延长电池续航</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// 初始化 macOS
document.addEventListener('DOMContentLoaded', () => {
    new MacOS();
});
