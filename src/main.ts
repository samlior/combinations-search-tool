import { app, Menu, BrowserWindow, ipcMain, dialog  } from "electron";
import * as path from "path";
import * as settings from '../settings'
import { api } from './api'
import { checkLocalStatus } from './activate'

let mainWindow: Electron.BrowserWindow = null

function terminate(err: any) {
  dialog.showMessageBox(mainWindow, {
      title: "警告",
      message: `发生不可恢复错误, 请联系客服处理! (°ー°〃)\n\n${err}`
  }).then(() => {
      mainWindow.close()
  })
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      zoomFactor: 1.0
    },
    width: 800,
  });
  
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../page-main/build/index.html"));

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // 设置缩放.
  mainWindow.webContents.on('did-finish-load', () => {
    // 设置最大化.
    mainWindow.maximize()

    mainWindow.webContents.on('zoom-changed', (event, zoomDirection: string) => {
      if (zoomDirection === "in") {
        mainWindow.webContents.zoomFactor += 0.1
      }
      else {
        mainWindow.webContents.zoomFactor -= 0.1
      }
    })

    checkLocalStatus().then((result) => {
      if (result.status === "error") {
        return terminate("checkLocalStatus status error")
      }
      else if (result.status === 'update' || result.status === 'activate' || result.status === 'expire') {
        api.setActivateStatus(result)
        api.activateWindowShow(()=>{})
      }
    }, (err) => {
      terminate(err)
    }).catch((err) => {
      terminate(err)
    })

  })
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
    label: "激活状态",
    click: () => {
      checkLocalStatus().then((result) => {
        if (result.status === "error") {
          return terminate("checkLocalStatus status error")
        }
        else if (result.status === 'update' || result.status === 'activate' || result.status === 'expire') {
          api.setActivateStatus(result)
          api.activateWindowShow(()=>{})
        }
        else if (result.status === 'success') {
          dialog.showMessageBox(mainWindow, {
            type: "info",
            buttons: ["ok"],
            message: `激活状态: 成功\n有效期至: ${result.validTime}`,
            title: "激活状态"
          })
        }
      }, (err) => {
        terminate(err)
      }).catch((err) => {
        terminate(err)
      })
    }
  },
  {
    label: "关于",
    click: () => {
      dialog.showMessageBox(mainWindow, {
        type: "info",
        buttons: ["ok"],
        message: `版本: ${settings.version}\n作者: Alexier, Samlior\n联系方式: samlior@foxmail.com\n\nPowered By Electron, React and Typescript.`,
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