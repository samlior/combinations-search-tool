declare let electron: any;

class ipcSevice {
    private ipcRenderer = electron.ipcRenderer

    on (message: string, done){
        return this.ipcRenderer.on(message, done);
    }

    send (message: string, ...args){
        this.ipcRenderer.send(message, ...args);
    }

    sendSync (message: string, ...args){
        return this.ipcRenderer.sendSync(message, arguments);
    }

    apiSend (method: string, ...args){
        this.ipcRenderer.send('api', method, ...args);
    }

    api (method: string, ...args) {
        this.ipcRenderer.send('api', method, ...args);
        return new Promise((resolve, reject) => {
                this.ipcRenderer.once(`${method}reply`, (sender, response) =>{
                if (!response || response.success !== true){
                    return reject(response)
                }
                return resolve(response)
            })
        })
    }
}

export let ipc = new ipcSevice()