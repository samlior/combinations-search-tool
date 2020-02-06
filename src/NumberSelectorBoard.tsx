import React from 'react';
import "./NumberSelectorBoard.css"

import { NumberSelector } from './NumberSelector';

export class NumberSelectorBoard extends React.Component<any, any> {

    constructor(props) {
        super(props)
    }

    render() {
        let selectors: any[] = []
        for (let i = 0; i < this.props.rulesCount; i++) {
            selectors.push(
                <NumberSelector 
                    index={i}
                    show={true}
                    selectedStatus={this.props.totalSelectedStatus[i]}
                    maxNumber={this.props.maxNumber}
                    selectCount={this.props.selectCount}
                    selectMin={this.props.totalSelectedRange[i][0]}
                    selectMax={this.props.totalSelectedRange[i][1]}
                    onNumberSelected={this.props.onNumberSelected}
                    onNumberSelectedAll={this.props.onNumberSelectedAll}
                    onNumberSelectedClear={this.props.onNumberSelectedClear}
                    onNumberSelectedDelete={this.props.onNumberSelectedDelete}
                    onNumberSelectedAdd={this.props.onNumberSelectedAdd}
                    onSelectMinChange={this.props.onSelectMinChange}
                    onSelectMaxChange={this.props.onSelectMaxChange} />
            )
        }

        // 增加最后一个不显示的元素, 用于实现新增功能.
        let uselessSelectedStatus: boolean[] = []
        for (let i = 0; i < this.props.maxNumber; i++) {
            uselessSelectedStatus.push(false)
        }
        selectors.push(
            <NumberSelector 
                index={selectors.length}
                show={false}
                selectedStatus={uselessSelectedStatus}
                maxNumber={this.props.maxNumber}
                selectCount={this.props.selectCount}
                onNumberSelected={this.props.onNumberSelected}
                onNumberSelectedAll={this.props.onNumberSelectedAll}
                onNumberSelectedClear={this.props.onNumberSelectedClear}
                onNumberSelectedDelete={this.props.onNumberSelectedDelete}
                onNumberSelectedAdd={this.props.onNumberSelectedAdd} />
        )

        return (
            <div className="div-number-selector-board">
                <span className="span-number-selector-board">当前条件总数: {this.props.rulesCount}</span>
                {selectors}
            </div>
        )
    }
}