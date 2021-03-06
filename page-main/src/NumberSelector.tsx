import React from 'react';
import "./NumberSelector.css"

function getNumberFromID(id: string) {
    let pos = id.lastIndexOf("-")
    if (pos) {
        return Number(id.substr(pos + 1))
    }
}

function fillZero(num: number, len: number = 2): string {
    let str: string = num.toString()
    while(str.length < len) {
        str = "0" + str
    }
    return str
}

export class NumberSelectorLine extends React.Component<any, any> {
    render() {
        let checkBoxs: any[] = []
        for (let i = 0; i < this.props.numbers.length; i++) {
            checkBoxs.push(
                <input type="checkBox" 
                    checked={this.props.selectedStatus[this.props.type ? this.props.numbers[i] - 1 : this.props.numbers[i]]}
                    onChange={this.props.onChange}
                    id={`input-checkbox-number-selector-${this.props.numbers[i]}`}/>
            )

            checkBoxs.push(<span className="span-number-selector-line">{fillZero(this.props.numbers[i])}</span>)
        }

        return (
            <div className="div-number-selector-line">
                {checkBoxs}
            </div>
        )
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
        this.handleRangeChange = this.handleRangeChange.bind(this)
    }

    handleChange(event: any) {
        let num = getNumberFromID(event.target.id)
        this.props.onNumberSelected(this.props.index, num, event.target.checked)
    }

    handleRangeChange(event: any) {
        let num = getNumberFromID(event.target.id)
        this.props.onRangeSelected(this.props.index, num, event.target.checked)
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
        let numberEachLine: number = 11

        let lines: any[] = []
        let subLineNumbers: number[] = []
        for (let i = 1; i <= this.props.maxNumber; i++) {
            subLineNumbers.push(i)
            if (subLineNumbers.length % numberEachLine === 0) {
                lines.push(<NumberSelectorLine
                    type={true}
                    numbers={subLineNumbers}
                    selectedStatus={this.props.selectedStatus}
                    onChange={this.handleChange}/>)
                subLineNumbers = []
            }
        }
        if (subLineNumbers.length > 0) {
            lines.push(<NumberSelectorLine
                type={true}
                numbers={subLineNumbers}
                selectedStatus={this.props.selectedStatus}
                onChange={this.handleChange}/>)
            subLineNumbers = []
        }

        let selectLines: any[] = []
        for (let i = 0; i <= this.props.selectCount; i++) {
            subLineNumbers.push(i)
            if (subLineNumbers.length % numberEachLine === 0) {
                selectLines.push(<NumberSelectorLine 
                    type={false}
                    numbers={subLineNumbers}
                    selectedStatus={this.props.selectedRangeStatus}
                    onChange={this.handleRangeChange}/>)
                subLineNumbers = []
            }
        }
        if (subLineNumbers.length > 0) {
            selectLines.push(<NumberSelectorLine
                type={false}
                numbers={subLineNumbers}
                selectedStatus={this.props.selectedRangeStatus}
                onChange={this.handleRangeChange}/>)
            subLineNumbers = []
        }

        return (
            <div className={this.props.show ? "div-number-selector-visible" : "div-number-selector-invisible"} 
                onClick={this.handleDivClick}>
                <div className={this.props.show ? "div-number-selector-helper-visible" : "div-number-selector-helper-invisible"}>
                    <h2>条件{this.props.index + 1}:</h2>
                    <span className="span-number-selector-tips">选取数字:</span><br/>
                    {lines}
                    <div className="div-number-selector-range">
                        <span className="span-number-selector-tips">选取出现个数:</span><br/>
                        {selectLines}
                    </div>
                    <div className="div-number-selector-line">
                        <button className="button-number-selector-all" onClick={this.handleSelectedAllClick}>全选</button>
                        <button className="button-number-selector-clear" onClick={this.handleSelectedClearClick}>清空</button>
                        <button className="button-number-selector-delete" onClick={this.handleSelectedDeleteClick}>删除</button>
                    </div>
                </div>
                <img className={!this.props.show ? "img-number-selector-helper-visible" : "img-number-selector-helper-invisible"}
                    src="add.png" id="img-number-selector-add"/>
            </div>
        )
    }
}