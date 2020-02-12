import React from 'react';
import "./SettingsBoard.css"

export class SettingsBoard extends React.Component<any, any> {
    render() {
        return (
            <div className="div-settings-board">
                <h2>选取参数设置:</h2>
                <div>数字总数: <input type="number" min="2" className="input-number-settings-board"
                    value={this.props.totalCount}
                    onChange={this.props.onTotalCountChange}/></div>
                <div style={{marginTop:"10px"}}>选取数量: <input type="number" min="1" className="input-number-settings-board"
                    value={this.props.selectCount}
                    onChange={this.props.onSelectCountChange}/></div>
                <button className="button-settings-board" onClick={this.props.onSettingsConfirm}>确定</button>
            </div>
        )
    }
}