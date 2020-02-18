import { app, dialog, BrowserWindow, clipboard } from "electron";
import * as path from 'path'
import { checkLocalStatus, checkAndPersistTotalSignature } from './activate'
import * as settings from '../settings'

let modalWindow: BrowserWindow = null
let activateWindow: BrowserWindow = null
let agreementWindow: BrowserWindow = null
let activateStatus: any = null

let api = {
    messageDialog: (reply, title: string, message: string) => {
        if (!title || !message)
            return
        dialog.showMessageBox(BrowserWindow.fromId(1), {
            title: title,
            message : message,
            type: "info"
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
            type: "info",
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
        if (modalWindow === null) {
            modalWindow = new BrowserWindow({
                width: 400,
                height: 320,
                parent: BrowserWindow.getFocusedWindow(),
                modal: true,
                frame: false
            });

            modalWindow.on('close', () => { modalWindow = null })
            modalWindow.loadURL(path.join('file://', __dirname, '../html/modal.html'))
            modalWindow.show()
        }
        reply({success: true})
    },
    modalClose: (reply) => {
        if (modalWindow !== null) {
            modalWindow.close()
            modalWindow = null
        }
        reply({success: true})
    },
    copyData: (reply, data) => {
        clipboard.writeText(data)
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            title: "提示",
            message : "内容已成功复制到剪贴板! o(^_^)o",
            type: "info"
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
                parent: BrowserWindow.fromId(1),
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

        if (agreementWindow === null) {
            agreementWindow = new BrowserWindow({
                height: 350,
                webPreferences: {
                    nodeIntegration: true
                },
                width: 600,
                parent: BrowserWindow.fromId(1),
                modal: true,
                frame: false
            });
    
            agreementWindow.on('close', () => { agreementWindow = null })
            agreementWindow.loadURL(path.join('file://', __dirname, '../page-agreement/build/index.html'))
            agreementWindow.show()
        }

        reply({success: true})
    },
    agreementWindowClose: (reply) => {
        if (agreementWindow !== null) {
            agreementWindow.close()
            agreementWindow = null
        }

        reply({success: true})
    },
    checkSignature: (reply, totalSignature) => {       
        reply({
            success: true,
            status: checkAndPersistTotalSignature(activateStatus.info,
                totalSignature, activateStatus.infoVersion)
        })
    },
    quit: () => {
        app.quit()
    },
    checkLocalStatus: (reply) => {
        let response = {
            success: false
        }

        checkLocalStatus().then((result) => {
                if (result.status === "error") {
                    return reply(response)
                }
                else if (result.status === 'update' || result.status === 'activate' || result.status === 'expire') {
                    api.setActivateStatus(result)
                    api.activateWindowShow(()=>{})
                    return reply(response)
                }
                else if (result.status === "success") {
                    response.success = true
                    return reply(response)
                }
            }, 
            (err) => {
                return reply(response)
            }
        )
        .catch((err) => {
            return reply(response)
        })
    },
    wechatCode: (reply) => {
        reply({
            success: true,
            wechatCode: settings.wechatCode
        })
    }
}

export { api }