import React from 'react';
import "./App.css"
import { ipc } from './ipc'

export class App extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.hanldeChange = this.hanldeChange.bind(this)
    this.handleCopy = this.handleCopy.bind(this)
    this.handleActivate = this.handleActivate.bind(this)

    this.state = {
      info: "",
      sig: "",
      title: ""
    }

    ipc.api("getActivateStatus").then((response: any) => {
      let result = response.status      
      let state: any = this.state
      if (result.status === "update") {
        state.title = "检测到硬件改动, 请联系客服重新获取激活码!"
      }
      else if (result.status === "activate") {
        state.title = "您的产品未激活, 请按提示激活程序!"
      }
      else if (result.status === "expire") {
        state.title = "您的激活码已到期, 请重新激活程序!"
      }
      state.info = result.info
      this.setState(state)
    })
  }

  hanldeChange(event: any) {
    let state: any = this.state
    state.sig = event.target.value
    this.setState(state)
  }

  handleCopy() {
    ipc.apiSend("copyData", this.state.info)
  }

  handleActivate() {
    ipc.api("checkSignature", this.state.sig).then((response: any) => {
      let result = response.status
      if (result.status !== "success") {
        return ipc.apiSend("messageDialog", "警告", "激活码错误!")
      }
      if (result.validTime === -1) {
        ipc.api("buttonsDialog", "提示", "恭喜您激活成功!").then(() => {
          ipc.apiSend("activateWindowClose")
        })
      }
      else {
        ipc.api("buttonsDialog", "提示", `恭喜您激活成功, 有效期至${result.validTime}`).then(() => {
          ipc.apiSend("activateWindowClose")
        })
      }
    }, (response) => {
      ipc.apiSend("messageDialog", "警告", "激活码错误!")
    })
  }

  render() {
    return (
      <div className="div-app">
        <div className="div-app-tips">
          <h2>{this.state.title}</h2>
          <span style={{fontWeight: "bold"}}>激活提示:</span><br/>
          <span>1. 添加客服微信123456789</span><br/>
          <span>2. 将特征码复制给客服</span><br/>
          <span>3. 将客服回复的激活码输入下面的输入框中, 然后点击激活</span><br/>
          <span>4. 激活成功</span><br/>
        </div>
        <span className="span-app-tips">请复制特征码给客服:</span>
        <div className="div-app-flex">
          <textarea className="textarea-app" value={this.state.info} readOnly></textarea>
        </div>
        <div className="div-app-flex-right">
          <button className="button-app" onClick={this.handleCopy}>复制特征码到剪贴板</button>
        </div>
        <span className="span-app-tips">请输入客服回复的激活码:</span>
        <div className="div-app-flex">
          <textarea className="textarea-app" value={this.state.sig} onChange={this.hanldeChange}></textarea>
        </div>
        <div className="div-app-flex-right">
          <button className="button-app" onClick={this.handleActivate}>激活</button>
        </div>
      </div>
    )
  }
}