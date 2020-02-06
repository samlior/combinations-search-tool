import { app, Menu, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import { api } from './api'

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    width: 800,
  });
  
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../build-react/index.html"));

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('api', (event, method: string, ...args) =>{
  let reply = (response) => {
      event.sender.send(`${method}reply`, response);
  }
  if (api[method]){
      api[method](reply, ...args)
  }
  else {
      let response = {
        success: false,
        msg: "unknow method: " + method
      }
      reply(response)
  }
})

let template: any = [{
    label: '菜单',
    submenu: [
      {
        label: '刷新',
        accelerator: 'CmdOrCtrl+F',
        click: (item, focusedWindow) => {
          focusedWindow.webContents.send("refresh")
        }
      },
      {
        type: "separator"
      },
      {
        label: '清空',
        accelerator: 'CmdOrCtrl+G',
        click: (item, focusedWindow) => {
          focusedWindow.webContents.send("clearAll")
        }
      }
    ]
  },
  {
    label: '视图',
    role: 'viewMenu'
  },
  {
    label: "关于",
    click: () => {
      dialog.showMessageBox(mainWindow, {
        type: "info",
        buttons: ["ok"],
        message: "Power By Electron And React",
        title: "关于此软件"
      })
    }
  }
]

const menu = Menu.buildFromTemplate(template)

app.on('ready', () => {
  Menu.setApplicationMenu(menu)
})

app.on('browser-window-created', (event, win) => {
  win.webContents.on('context-menu', (e, params) => {
    menu.popup({
      window: win,
      x: params.x,
      y: params.y
    })
  })
})

ipcMain.on('show-context-menu', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup({window: win})
})