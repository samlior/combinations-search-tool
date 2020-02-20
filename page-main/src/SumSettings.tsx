import React from 'react';
import "./SumSettings.css"

function getNumberFromID(id: string) {
    let pos = id.lastIndexOf("-")
    if (pos) {
        return Number(id.substr(pos + 1))
    }
}

export class SumSettings extends React.Component<any, any> {
    constructor(props) {
        super(props)

        this.handleMinChange = this.handleMinChange.bind(this)
        this.handleMaxChange = this.handleMaxChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleMinChange(event: any) {
        let index = getNumberFromID(event.target.id)
        if (index >= 0 && index <= 4) {
            this.props.onMinChange(index, event.target.value)
        }
    }

    handleMaxChange(event: any) {
        let index = getNumberFromID(event.target.id)
        if (index >= 0 && index <= 4) {
            this.props.onMaxChange(index, event.target.value)
        }
    }

    handleClick(event: any) {
        let index = getNumberFromID(event.target.id)
        if (index >= 0 && index <= 4) {
            this.props.onClear(index)
        }
    }

    render() {
        let elements: any[] = []
        for (let i = 0; i < 5; i++) {
            elements.push(
                <div className={i === 0 ? "div-sum-settings-first-line" : "div-sum-settings-line"}>
                    <span>范围{ i + 1 }: </span>
                    <input id={ `input-text-sum-settings-min-${i}` } 
                        className="input-text-sum-settings-min" type="number" min="0" value={this.props.sumSettings[i][0]} onChange={this.handleMinChange}/>
                    <span>-</span>
                    <input id={ `input-text-sum-settings-max-${i}` }
                        className="input-text-sum-settings-max" type="number" min="0" value={this.props.sumSettings[i][1]} onChange={this.handleMaxChange}/>
                    <button id={ `button-sum-settings-${i}` } className="button-sum-settings" onClick={this.handleClick}>
                        清空
                    </button>
                </div>
            )
        }

        return (
            <div className="div-sum-settings">
                <h2>和值范围设置:</h2>
                {elements}
            </div>
        )
    }
}