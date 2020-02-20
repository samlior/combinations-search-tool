import React from 'react';
import "./SumSettings.css"

export class SumSettings extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    render() {
        let elements: any[] = []
        for (let i = 0; i < 5; i++) {
            elements.push(
                <div className={i === 0 ? "div-sum-settings-first-line" : "div-sum-settings-line"}>
                    <span>范围{ i + 1 }: </span>
                    <input id={ `input-text-sum-settings-min-${i}` } 
                        className="input-text-sum-settings-min" type="number" min="0"/>
                    <span>-</span>
                    <input id={ `input-text-sum-settings-max-${i}` }
                        className="input-text-sum-settings-max" type="number" min="0"/>
                    <button id={ `button-sum-settings-${i}` } className="button-sum-settings">
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