import { dialog, BrowserWindow } from "electron";
import * as path from 'path'
import * as fs from 'fs';

function fillString(str: string, n: number): string {
    let tmp: string = ""
    while (str.length + tmp.length < n) {
        tmp += "0"
    }
    return tmp + str
}

function getCurrentTime(): string {
    let date = new Date();
    let sep1 = "-";
    let sep2 = ":";
    let year: string = date.getFullYear().toString();
    let month: string = (date.getMonth() + 1).toString();
    let day: string = date.getDate().toString();
    let hh: string = date.getHours().toString();
    let mm: string = date.getMinutes().toString();
    let ss: string = date.getSeconds().toString();

    let currentdate = fillString(year, 4) + sep1 + fillString(month, 2) + sep1 + fillString(day, 2) + " " +
        fillString(hh, 2) + sep2 + fillString(mm, 2) + sep2 + fillString(ss, 2);
    return currentdate;
}

let modalWin: BrowserWindow = null

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
        if (!title || !message || !args || args.length == 0) {
            response.msg = "invalid args"
            return
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
            modalWin.loadURL(path.join('file://', __dirname, '../src-electron/modal.html'))
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
    }
}

export { api }