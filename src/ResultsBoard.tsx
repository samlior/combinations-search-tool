import React from 'react';
import "./ResultsBoard.css"

export class ResultsBoard extends React.Component<any, any> {
    /*
    render() {

        let textareas: any[] = []
        for (let i = 0; i < this.props.results.length; i++) {
            textareas.push(
                <div className="div-results-board-result">
                    {`第${i + this.props.pageIndex}页:\n\n${this.props.results[i]}`}
                </div>
            )
        }

        return (
            <div className="div-results-board">
                <div className="div-results-board-top">
                    <button className="button-results-board-start" onClick={this.props.onStart}>开始检索</button>
                    <span className="span-results-board-page-info">共显示</span>
                    <div className="div-results-board-control" onClick={this.props.onResultAdd}><img src="add.png" className="img-results-board"/></div>
                    <span className="span-results-board-page-info">{this.props.results.length}</span>
                    <div className="div-results-board-control" id="div-results-board-reduce" onClick={this.props.onResultReduce}><img src="reduce.png" className="img-results-board"/></div>
                    <span className="span-results-board-page-info">页, 每页显示</span>
                    <input className="input-number-results-board" type="number" min="1" value={this.props.pageRowCount} onChange={this.props.onPageRowCountChange}/>
                    <span className="span-results-board-page-info">个结果, 当前展示第</span>
                    <div className="div-results-board-control" onClick={this.props.onResultFirst}><img src="first.png" className="img-results-board"/></div>
                    <div className="div-results-board-control" onClick={this.props.onResultPrevious}><img src="previous.png" className="img-results-board"/></div>
                    <input className="input-number-results-board" type="number" min="1" value={this.props.pageIndex} onChange={this.props.onPageIndexChange}/>
                    <div className="div-results-board-control" onClick={this.props.onResultNext}><img src="next.png" className="img-results-board"/></div>
                    <div className="div-results-board-control" onClick={this.props.onResultLast}><img src="last.png" className="img-results-board"/></div>
                    <span className="span-results-board-page-info">页, 共计{this.props.totalPageCount}页({this.props.totalResultCount}个结果)</span>
                </div>
                <div className="div-results-board-bottom">
                    {textareas}
                </div>
            </div>
        )
    }
    */

   render() {

    let textareas: any[] = []
    for (let i = 0; i < this.props.results.length; i++) {
        textareas.push(
            <div className="div-results-board-result">
                {this.props.results[i]}
            </div>
        )
    }

    return (
        <div className="div-results-board">
            <div className="div-results-board-top">
                <button className="button-results-board-start" onClick={this.props.onStart}>开始检索</button>
                <span className="span-results-board-page-info">共计{this.props.totalResultCount}个结果</span>
            </div>
            <div className="div-results-board-bottom">
                {textareas}
            </div>
        </div>
    )
}
}