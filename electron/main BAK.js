//electron/main.js
// BAK before edit electron updater

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

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
        //mainWindow.webContents.openDevTools();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (backendProcess) backendProcess.kill();
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
