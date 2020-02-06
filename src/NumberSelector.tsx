import React from 'react';
import "./NumberSelector.css"

function getNumberFromID(id: string) {
    let pos = id.lastIndexOf("-")
    if (pos) {
        return Number(id.substr(pos + 1))
    }
}

export class NumberSelector extends React.Component<any, any> {

    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleSelectedAllClick = this.handleSelectedAllClick.bind(this)
        this.handleSelectedClearClick = this.handleSelectedClearClick.bind(this)
        this.handleSelectedDeleteClick = this.handleSelectedDeleteClick.bind(this)
        this.handleDivClick = this.handleDivClick.bind(this)
        this.handleSelectMinChange = this.handleSelectMinChange.bind(this)
        this.handleSelectMaxChange = this.handleSelectMaxChange.bind(this)
    }

    handleChange(event: any) {
        let num = getNumberFromID(event.target.id)
        this.props.onNumberSelected(this.props.index, num, event.target.checked)
    }

    handleSelectedAllClick(event: any) {
        this.props.onNumberSelectedAll(this.props.index)
    }

    handleSelectedClearClick(event: any) {
        this.props.onNumberSelectedClear(this.props.index)
    }

    handleSelectedDeleteClick(event: any) {
        this.props.onNumberSelectedDelete(this.props.index)
    }

    handleDivClick(event: any) {
        if (!this.props.show) {
            this.props.onNumberSelectedAdd()
        }
    }

    handleSelectMinChange(event: any) {
        this.props.onSelectMinChange(this.props.index, Number(event.target.value))
    }

    handleSelectMaxChange(event: any) {
        this.props.onSelectMaxChange(this.props.index, Number(event.target.value))
    }

    render() {
        let checkBoxs: any[] = []
        for (let i = 1; i <= this.props.maxNumber; i++) {
            checkBoxs.push(
                <input type="checkBox" 
                    checked={this.props.selectedStatus[i - 1]}
                    onChange={this.handleChange}
                    id={`input-checkbox-number-selector-${i}`}/>
            )

            checkBoxs.push(<span>{i}</span>)

            if (i % 5 === 0) {
                checkBoxs.push(<br/>)
            }
        }
        if (this.props.maxNumber % 5 !== 0) {
            checkBoxs.push(<br/>)
        }

        return (
            <div className={this.props.show ? "div-number-selector-visible" : "div-number-selector-invisible"} 
                onClick={this.handleDivClick}>
                <div className={this.props.show ? "div-number-selector-helper-visible" : "div-number-selector-helper-invisible"}>
                    <p style={{fontWeight: "bold"}}>条件{this.props.index + 1}:</p>
                    {checkBoxs}
                    <div className="div-input-number-selector">
                    有  <input className="input-text-number-selector" 
                        type="number" min="0" max={this.props.selectCount} value={this.props.selectMin} onChange={this.handleSelectMinChange}/> —— <input className="input-text-number-selector" 
                        type="number" min="0" max={this.props.selectCount} value={this.props.selectMax} onChange={this.handleSelectMaxChange}/>  个
                    </div>
                    <button className="button-number-selector-all" onClick={this.handleSelectedAllClick}>全选</button>
                    <button className="button-number-selector-clear" onClick={this.handleSelectedClearClick}>清空</button>
                    <button className="button-number-selector-delete" onClick={this.handleSelectedDeleteClick}>删除</button>
                </div>
                <img className={!this.props.show ? "img-number-selector-helper-visible" : "img-number-selector-helper-invisible"}
                    src="add.png" id="img-number-selector-add"/>
            </div>
        )
    }

}