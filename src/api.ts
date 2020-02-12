import { dialog, BrowserWindow, clipboard } from "electron";
import * as path from 'path'
import { checkAndPersistTotalSignature } from './activate'

let modalWin: BrowserWindow = null
let activateWindow: Electron.BrowserWindow = null
let activateStatus: any = null

let api = {
    messageDialog: (reply, title: string, message: string) => {
        if (!title || !message)
            return
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: title,
            message : message
        })
    },
    buttonsDialog: (reply, title: string, message: string, ...args: string[]) => {
        let response: any = {
            success: false
        }
        if (!title || !message) {
            response.msg = "invalid args"
            return
        }
        if (!args) {
            args = []
        }
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: title,
            message: message,
            buttons: args
        }).then((result) => {
            response.index = result.response
            response.success = true
            return reply(response)
        }).catch(err => {
            console.log("buttonsDialog err:")
            console.log(err)
            response.msg = "unkonw err"
            return reply(response)
        })
    },
    modalShow: (reply) => {
        if (modalWin === null) {
            modalWin = new BrowserWindow({
                width: 400,
                height: 320,
                parent: BrowserWindow.getFocusedWindow(),
                modal: true,
                frame: false
            });

            modalWin.on('close', () => { modalWin = null })
            modalWin.loadURL(path.join('file://', __dirname, '../html/modal.html'))
            modalWin.show()
        }
        reply({success: true})
    },
    modalClose: (reply) => {
        if (modalWin !== null) {
            modalWin.close()
            modalWin = null
        }
        reply({success: true})
    },
    copyData: (reply, data) => {
        clipboard.writeText(data)
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: "提示",
            message : "内容已成功复制到剪贴板!"
        })
    },
    // main process call
    setActivateStatus: (newStatus) => {
        activateStatus = newStatus
    },
    // render process call
    getActivateStatus: (reply) => {
        reply({
            success: true,
            status: activateStatus
        })
    },
    activateWindowShow: (reply) => {
        if (activateWindow === null) {
            activateWindow = new BrowserWindow({
                height: 800,
                webPreferences: {
                    nodeIntegration: true
                },
                width: 800,
                parent: BrowserWindow.getFocusedWindow(),
                modal: true,
                frame: false
            });
    
            activateWindow.on('close', () => { activateWindow = null })
            activateWindow.loadURL(path.join('file://', __dirname, '../page-activate/build/index.html'))
            activateWindow.show()
        }
        reply({success: true})
    },
    activateWindowClose: (reply) => {
        if (activateWindow !== null) {
            activateWindow.close()
            activateWindow = null
        }
        reply({success: true})
    },
    checkSignature: (reply, totalSignature) => {       
        reply({
            success: true,
            status: checkAndPersistTotalSignature(activateStatus.info,
                totalSignature, activateStatus.infoVersion)
        })
    }
}

export { api }