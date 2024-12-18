const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 2880,
    height: 1800,
    webPreferences: {
      nodeIntegration: true, // Доступ к Node.js API
      contextIsolation: false, // Разрешаем использование глобальных объектов
    },
  });

  // Загружаем файл index.html из React build
  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

