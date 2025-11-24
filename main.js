const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'icon/chanmura.ico'),  // <-- Add this line
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Correct path for packaged app
  const indexPath = path.join(__dirname, 'resources/app.asar/dist/Chanmura/index.html');
  win.loadFile(indexPath).catch(() => {
    // fallback for development
    win.loadURL('https://naseerrm.github.io/chanmuraResturantUI');
  });
}

app.whenReady().then(createWindow);
