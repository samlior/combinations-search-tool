import React from 'react';
import "./NumberCountBoard.css"

export class NumberCountBoard extends React.Component<any, any> {
    render() {
        return (
            <div className="div-number-count-board">
                <h2>数字数量设置:</h2>
                <div className="div-number-count-board-line">奇数数量: 
                    <input type="number" min="0" className="input-number-number-count-board"
                        max={this.props.selectCount} value={this.props.odd} onChange={this.props.onOddChange}/>
                    <button className="button-number-count-board" onClick={this.props.onOddClear}>
                        清空
                    </button>
                </div>
                <div className="div-number-count-board-line">偶数数量: 
                    <input type="number" min="0" className="input-number-number-count-board"
                        max={this.props.selectCount} value={this.props.even} onChange={this.props.onEvenChange}/>
                    <button className="button-number-count-board" onClick={this.props.onEvenClear}>
                        清空
                    </button>
                </div>
                <div className="div-number-count-board-line">质数数量: 
                    <input type="number" min="0" className="input-number-number-count-board"
                        max={this.props.selectCount} value={this.props.prime} onChange={this.props.onPrimeChange}/>
                    <button className="button-number-count-board" onClick={this.props.onPrimeClear}>
                        清空
                    </button>
                </div>
                <div className="div-number-count-board-line">合数数量: 
                    <input type="number" min="0" className="input-number-number-count-board"
                        max={this.props.selectCount} value={this.props.composite} onChange={this.props.onCompositeChange}/>
                    <button className="button-number-count-board" onClick={this.props.onCompositeClear}>
                        清空
                    </button>
                </div>
                <div className="div-number-count-board-line">连数数量: 
                    <input type="number" min="0" className="input-number-number-count-board"
                        max={this.props.selectCount} value={this.props.linking} onChange={this.props.onLinkingChange}/>
                    <button className="button-number-count-board" onClick={this.props.onLinkingClear}>
                        清空
                    </button>
                </div>
            </div>
        )
    }
}