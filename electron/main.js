//electron/main.js

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

//For electron updater
const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
const kill = require('tree-kill');

const isDev = !app.isPackaged;

let mainWindow;
let backendProcess;

// ✅ Define backendPath here — globally so it's usable anywhere
const backendPath = isDev
    ? path.join(__dirname, '../backend/server.js')
    : path.join(process.resourcesPath, 'backend', 'server.js');

// const backendPath = isDev
//     ? path.join(__dirname, '../backend/server.js')
//     : path.join(__dirname, 'backend', 'server.js')

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
    });

    mainWindow.maximize();

    if (isDev) {
        console.log('Loading React Dev Server...');
        mainWindow.loadURL('http://localhost:3000');
    } else {
        console.log('Loading frontend React production build...');
        mainWindow.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}


//For auto updater
function initAutoUpdater() {
    autoUpdater.autoDownload = true;

    autoUpdater.on('checking-for-update', () => {
        console.log('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
        console.log('Update available:', info);
    });

    autoUpdater.on('update-not-available', (info) => {
        console.log('No updates available:', info);
    });

    autoUpdater.on('error', (err) => {
        console.error('Update error:', err);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        console.log(`Download speed: ${progressObj.bytesPerSecond}`);
        console.log(`Downloaded ${progressObj.percent}%`);
    });

    autoUpdater.on('update-downloaded', () => {
        console.log('Update downloaded. Prompting user to install.');

        dialog.showMessageBox({
            type: 'info',
            title: 'Update Ready',
            message: 'A new version has been downloaded. Do you want to install it now?',
            buttons: ['Install and Restart', 'Later']
        }).then(result => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });

    autoUpdater.checkForUpdatesAndNotify();
}








app.whenReady().then(() => {
    console.log('Starting backend...');
    console.log('Using backend path:', backendPath);

    backendProcess = spawn('node', [backendPath], { // this was original line and it has an error node not found on user's PC
        //backendProcess = spawn(process.execPath, [backendPath], {
        cwd: path.join(__dirname, '../backend'), // 👈 Set working directory! this is very important
        stdio: 'inherit',
        shell: true,
        windowsHide: true,
    });

    backendProcess.on('exit', (code, signal) => {
        console.log(`Backend process exited with code ${code}, signal: ${signal}`);
    });

    waitOn({ resources: ['http://localhost:3001/api/cbForStaff/getDashboardData'] }, (err) => {
        if (err) {
            console.error('Backend did not start in time:', err);
            app.quit();
            return;
        }

        console.log('Backend is ready. Creating window...');
        createWindow();

        // 🔄 Start checking for updates after window is ready
        initAutoUpdater();
        //mainWindow.webContents.openDevTools();
    });
});

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         if (backendProcess) backendProcess.kill();
//         app.quit();
//     }
// });
app.on('before-quit', () => {
    if (backendProcess && !backendProcess.killed) {
        kill(backendProcess.pid, 'SIGTERM', (err) => {
            if (err) {
                console.error('Failed to kill backend process:', err);
            } else {
                console.log('Backend process killed successfully');
            }
        });
    }
});
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         if (backendProcess && !backendProcess.killed) {
//             backendProcess.kill('SIGTERM');
//         }
//         app.quit();
//     }
// });
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (backendProcess && !backendProcess.killed) {
            kill(backendProcess.pid, 'SIGTERM', (err) => {
                if (err) {
                    console.error('Failed to kill backend process:', err);
                } else {
                    console.log('Backend process killed successfully');
                }
            });
        }
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
