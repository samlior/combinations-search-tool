import React from 'react';
import "./ResultsBoard.css"

export class ResultsBoard extends React.Component<any, any> {
   render() {
        return (
            <div className="div-results-board">
                <div className="div-results-board-top">
                    <button className="button-results-board-start" onClick={this.props.onStart}>开始检索</button>
                    <button className="button-results-board-copy" onClick={this.props.onCopy}>复制结果</button>
                    <span className="span-results-board-page-info">共计{this.props.totalResultCount}个结果</span>
                </div>
                <div className="div-results-board-bottom">
                    <textarea value={this.props.result} className="textarea-results-board-result" readOnly>
                    </textarea>
                </div>
            </div>
        )
    }
}