import React from 'react';
import "./App.css"
import { ipc } from './ipc'

export class App extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.handleOK = this.handleOK.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.hanldeChange = this.hanldeChange.bind(this)

    this.state = {
      checked: false
    }
  }

  handleOK() {
    if (this.state.checked === false) {
      ipc.apiSend("messageDialog", "警告", "请勾选\"同意并遵守\"以继续操作! (°ー°〃)")
      return
    }
    ipc.apiSend("agreementWindowClose")
  }

  handleCancel() {
    ipc.apiSend("quit")
  }

  hanldeChange(event: any) {
    let state: any = this.state
    state.checked = Boolean(event.target.checked)
    this.setState(state)
  }

  render() {
    return (
      <div className="div-app">
          <div className="div-app-title"><h2>软件声明</h2></div>
          <textarea className="textarea-app">
              {
                "本软件仅供个人学习使用，版权归作者所有。\n未经作者许可，不得用于其他任何商业性用途。\n任何人不得利用本软件实施非法行为，否则与本软件无关。\n作者保留追究法律责任的权利。"
              }
          </textarea>
          <div className="div-app-flex-right">
            <button className="button-app" onClick={this.handleOK}>确定</button>
            <button className="button-app" onClick={this.handleCancel}>取消</button>
            <div className="div-app-grow"></div>
            <div className="div-app-checkbox">
              <input type="checkbox" checked={this.state.checked} onChange={this.hanldeChange}/><span className="span-app">同意并遵守</span>
            </div>
          </div>
      </div>
    )
  }
}