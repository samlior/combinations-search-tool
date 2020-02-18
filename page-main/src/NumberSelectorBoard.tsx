import React from 'react';
import "./NumberSelectorBoard.css"

import { NumberSelector } from './NumberSelector';

export class NumberSelectorBoard extends React.Component<any, any> {
    render() {
        let selectors: any[] = []
        selectors.push(this.props.makeSettingsBoard())
        selectors.push(this.props.makeNumberCountBoard())
        for (let i = 0; i < this.props.rulesCount; i++) {
            selectors.push(
                <NumberSelector 
                    index={i}
                    show={true}
                    selectedStatus={this.props.totalSelectedStatus[i]}
                    maxNumber={this.props.maxNumber}
                    selectCount={this.props.selectCount}
                    selectedRangeStatus={this.props.totalSelectedRange[i]}
                    onNumberSelected={this.props.onNumberSelected}
                    onNumberSelectedAll={this.props.onNumberSelectedAll}
                    onNumberSelectedClear={this.props.onNumberSelectedClear}
                    onNumberSelectedDelete={this.props.onNumberSelectedDelete}
                    onNumberSelectedAdd={this.props.onNumberSelectedAdd}
                    onRangeSelected={this.props.onRangeSelected} />
            )
        }

        // 增加最后一个不显示的元素, 用于实现新增功能.
        let uselessSelectedStatus: boolean[] = []
        for (let i = 0; i < this.props.maxNumber; i++) {
            uselessSelectedStatus.push(false)
        }
        let uselessSelectedRange: boolean[] = []
        for (let i = 0; i <= this.props.selectCount; i++) {
            uselessSelectedRange.push(false)
        }
        selectors.push(
            <NumberSelector 
                index={selectors.length}
                show={false}
                selectedStatus={uselessSelectedStatus}
                maxNumber={this.props.maxNumber}
                selectCount={this.props.selectCount}
                selectedRangeStatus={uselessSelectedRange}
                onNumberSelected={this.props.onNumberSelected}
                onNumberSelectedAll={this.props.onNumberSelectedAll}
                onNumberSelectedClear={this.props.onNumberSelectedClear}
                onNumberSelectedDelete={this.props.onNumberSelectedDelete}
                onNumberSelectedAdd={this.props.onNumberSelectedAdd}
                onRangeSelected={this.props.onRangeSelected} />
        )

        return (
            <div>
                <span className="span-number-selector-board">当前条件总数: {this.props.rulesCount}</span>
                <div className="div-number-selector-board">
                    {selectors}
                </div>
            </div>
        )
    }
}