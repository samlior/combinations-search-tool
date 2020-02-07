import React from 'react';
import "./App.css"

import { NumberSelectorBoard  } from './NumberSelectorBoard'
import { SettingsBoard } from './SettingsBoard'
import { NumberCountBoard } from './NumberCountBoard'
import { ResultsBoard } from './ResultsBoard'

import { ipc } from './ipc'

import * as search from './search'
import { statSync } from 'fs';

export class App extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.hanldeNumberSelected = this.hanldeNumberSelected.bind(this)
    this.handleNumberSelectedAll = this.handleNumberSelectedAll.bind(this)
    this.handleNumberSelectedClear = this.handleNumberSelectedClear.bind(this)
    this.handleNumberSelectedDelete = this.handleNumberSelectedDelete.bind(this)
    this.handleNumberSelectedAdd = this.handleNumberSelectedAdd.bind(this)
    this.hanldeSelectMinChange = this.hanldeSelectMinChange.bind(this)
    this.hanldeSelectMaxChange = this.hanldeSelectMaxChange.bind(this)

    this.handleTotalCountChange = this.handleTotalCountChange.bind(this)
    this.handleSelectCountChange = this.handleSelectCountChange.bind(this)
    this.handleSettingsConfirm = this.handleSettingsConfirm.bind(this)

    this.handleOddChange = this.handleOddChange.bind(this)
    this.handleEvenChange = this.handleEvenChange.bind(this)
    this.handlePrimeChange = this.handlePrimeChange.bind(this)
    this.handleCompositeChange = this.handleCompositeChange.bind(this)
    this.handleLinkingChange = this.handleLinkingChange.bind(this)

    this.handleOddClear = this.handleOddClear.bind(this)
    this.handleEvenClear = this.handleEvenClear.bind(this)
    this.handlePrimeClear = this.handlePrimeClear.bind(this)
    this.handleCompositeClear = this.handleCompositeClear.bind(this)
    this.handleLinkingClear = this.handleLinkingClear.bind(this)

    this.handleStart = this.handleStart.bind(this)
    this.handleResultAdd = this.handleResultAdd.bind(this)
    this.handleResultReduce = this.handleResultReduce.bind(this)
    this.handlePageRowCountChange = this.handlePageRowCountChange.bind(this)
    this.hanldePageIndexChange = this.hanldePageIndexChange.bind(this)

    this.handleResultFirst = this.handleResultFirst.bind(this)
    this.handleResultPrevious = this.handleResultPrevious.bind(this)
    this.handleResultNext = this.handleResultNext.bind(this)
    this.handleResultLast = this.handleResultLast.bind(this)

    this.makeSettingsBoard = this.makeSettingsBoard.bind(this)
    this.makeNumberCountBoard = this.makeNumberCountBoard.bind(this)

    this.state = {
      totalSelectedStatus: [],
      totalSelectedRange: [],
      rulesCount: 1,
      maxNumber: search.total_count,
      selectCount: search.selected_count,
      tmpMaxNumber: search.total_count,
      tmpSelectCount: search.selected_count,
      odd: "",
      even: "",
      prime: "",
      composite: "",
      linking: "",
      resultPageCount: 1,
      resultRowEachPage: -1,
      resultPageIndex: 1,
      totalResults: []
    }

    for (let i = 0; i < this.state.rulesCount; i++) {
      let selectedStatus: boolean[] = []
      for (let j = 0; j < this.state.maxNumber; j++) {
        selectedStatus.push(false)
      }
      this.state.totalSelectedStatus.push(selectedStatus)

      let selectedRange = ["", ""]
      this.state.totalSelectedRange.push(selectedRange)
    }

    ipc.on("clearAll", ()=>{
      let state = this.state
      this.clearAllButDoNotReflesh(state)
      this.setState(state)
    })
  }

  hanldeSelectMinChange(selectorIndex, num: number) {
    let state = this.state
    if (selectorIndex >= state.totalSelectedRange.length) {
      return
    }

    state.totalSelectedRange[selectorIndex][0] = num
    this.setState(state)
  }

  hanldeSelectMaxChange(selectorIndex, num: number) {
    let state = this.state
    if (selectorIndex >= state.totalSelectedRange.length) {
      return
    }

    state.totalSelectedRange[selectorIndex][1] = num
    this.setState(state)
  }

  hanldeNumberSelected(selectorIndex, num, checked) {
    let state = this.state
    if (selectorIndex >= state.totalSelectedStatus.length) {
      return
    }

    state.totalSelectedStatus[selectorIndex][num - 1] = checked
    this.setState(state)
  }

  handleNumberSelectedAll(selectorIndex) {
    let state = this.state
    if (selectorIndex >= state.totalSelectedStatus.length) {
      return
    }

    for (let i = 0; i < state.totalSelectedStatus[selectorIndex].length; i++) {
      state.totalSelectedStatus[selectorIndex][i] = true
    }
    this.setState(state)
  }

  handleNumberSelectedClear(selectorIndex) {
    let state = this.state
    if (selectorIndex >= state.totalSelectedStatus.length) {
      return
    }

    for (let i = 0; i < state.totalSelectedStatus[selectorIndex].length; i++) {
      state.totalSelectedStatus[selectorIndex][i] = false
    }

    state.totalSelectedRange[selectorIndex][0] = ""
    state.totalSelectedRange[selectorIndex][1] = ""
    this.setState(state)
  }

  handleNumberSelectedDelete(selectorIndex) {
    let state: any = this.state
    if (selectorIndex >= state.totalSelectedStatus.length) {
      return
    }

    let newArr: boolean[][] = []
    let newArr2: number[][] = []
    for (let i = 0; i < state.totalSelectedStatus.length; i++) {
      if (i === selectorIndex)
        continue
      newArr.push(state.totalSelectedStatus[i])
      newArr2.push(state.totalSelectedRange[i])
    }
    state.totalSelectedStatus = newArr
    state.totalSelectedRange = newArr2

    if (state.rulesCount > 0) {
      state.rulesCount -= 1
    }

    this.setState(state)
  }

  handleNumberSelectedAdd() {
    let state: any = this.state
    let newArr: boolean[] = []
    for (let i = 0; i < this.state.maxNumber; i++) {
      newArr.push(false)
    }
    state.totalSelectedStatus.push(newArr)
    state.totalSelectedRange.push(["", ""])
    state.rulesCount += 1
    this.setState(state)
  }

  handleTotalCountChange(event: any) {
    let state: any = this.state
    state.tmpMaxNumber = Number(event.target.value)
    this.setState(state)
  }

  handleSelectCountChange(event: any) {
    let state: any = this.state
    state.tmpSelectCount = Number(event.target.value)
    this.setState(state)
  }

  clearAllButDoNotReflesh(state: any = this.state) {
    state.totalSelectedStatus = []
    for (let i = 0; i < state.rulesCount; i++) {
      let selectedStatus: boolean[] = []
      for (let j = 0; j < state.maxNumber; j++) {
        selectedStatus.push(false)
      }
      state.totalSelectedStatus.push(selectedStatus)

      state.totalSelectedRange[i][0] = ""
      state.totalSelectedRange[i][1] = ""
    }

    state.odd = ""
    state.even = ""
    state.prime = ""
    state.composite = ""
    state.linking = ""
    state.totalResults = []
  }

  handleSettingsConfirm() {
    let state: any = this.state
    if (state.tmpSelectCount === state.selectCount &&
      state.tmpMaxNumber === state.maxNumber) {
        return
    }

    if (state.tmpSelectCount >= state.tmpMaxNumber ||
      state.tmpSelectCount === 0 ||
      state.tmpMaxNumber <= 1) {
        ipc.apiSend("messageDialog", "警告", "输入参数非法, 请重新输入!")
        return
    }
    if (state.tmpMaxNumber > 100) {
        ipc.apiSend("messageDialog", "警告", "最大数字总数只支持100")
        return
    }
    state.maxNumber = state.tmpMaxNumber
    state.selectCount = state.tmpSelectCount

    this.clearAllButDoNotReflesh(state)
    search.reset(state.selectCount, state.maxNumber)

    this.setState(state)
  }

  handleOddChange(event: any) {
    let state: any = this.state
    state.odd = Number(event.target.value)
    this.setState(state)
  }
  handleEvenChange(event: any) {
    let state: any = this.state
    state.even = Number(event.target.value)
    this.setState(state)
  }
  handlePrimeChange(event: any) {
    let state: any = this.state
    state.prime = Number(event.target.value)
    this.setState(state)
  }
  handleCompositeChange(event: any) {
    let state: any = this.state
    state.composite = Number(event.target.value)
    this.setState(state)
  }
  handleLinkingChange(event: any) {
    let state: any = this.state
    state.linking = Number(event.target.value)
    this.setState(state)
  }

  handleOddClear() {
    let state: any = this.state
    state.odd = ""
    this.setState(state)
  }
  handleEvenClear() {
    let state: any = this.state
    state.even = ""
    this.setState(state)
  }
  handlePrimeClear() {
    let state: any = this.state
    state.prime = ""
    this.setState(state)
  }
  handleCompositeClear() {
    let state: any = this.state
    state.composite = ""
    this.setState(state)
  }
  handleLinkingClear() {
    let state: any = this.state
    state.linking = ""
    this.setState(state)
  }

  handleResultAdd() {
    let state: any = this.state
    state.resultPageCount++
    this.setState(state)
  }

  handleResultReduce() {
    let state: any = this.state
    if (state.resultPageCount >= 2) {
      state.resultPageCount--
      this.setState(state)
    }
  }

  handlePageRowCountChange(event: any) {
    let state: any = this.state
    let num: number = Number(event.target.value)
    if (num === state.resultRowEachPage || num < 1) {
      return
    }
    state.resultRowEachPage = Number(event.target.value)
    this.setState(state)
  }

  hanldePageIndexChange(event: any) {
    let state: any = this.state
    let num: number = Number(event.target.value)
    if (num === state.resultPageIndex || num < 1 ||
      num > Math.ceil(this.state.totalResults.length / this.state.resultRowEachPage)) {
      return
    }
    state.resultPageIndex = num
    this.setState(state)
  }

  handleResultFirst() {
    let event = {
      target: {
        value: 1
      }
    }
    this.hanldePageIndexChange(event)
  }

  handleResultPrevious() {
    let event = {
      target: {
        value: this.state.resultPageIndex - 1
      }
    }
    this.hanldePageIndexChange(event)
  }

  handleResultNext() {
    let event = {
      target: {
        value: this.state.resultPageIndex + 1
      }
    }
    this.hanldePageIndexChange(event)
  }

  handleResultLast() {
    let event = {
      target: {
        value: Math.ceil(this.state.totalResults.length / this.state.resultRowEachPage)
      }
    }
    this.hanldePageIndexChange(event)
  }

  handleStart() {

    let rules: search.search_rule[] = []
    for (let i = 0; i < this.state.totalSelectedStatus.length; i++) {
      let rule: search.search_rule = new search.search_rule()
      for (let j = 1; j <= this.state.totalSelectedStatus[i].length; j++) {
        if (this.state.totalSelectedStatus[i][j - 1]) {
          rule.nums.push(j)
        }
      }
      if (rule.nums.length === 0) {
        continue
      }

      if (this.state.totalSelectedRange[i][0] === "" || this.state.totalSelectedRange[i][1] === "" ||
        this.state.totalSelectedRange[i][0] > this.state.totalSelectedRange[i][1]) {
        ipc.apiSend("messageDialog", "警告", `条件${i + 1}的范围非法, 请重新输入!`)
        return
      }

      rule.show_count_min = Number(this.state.totalSelectedRange[i][0])
      rule.show_count_max = Number(this.state.totalSelectedRange[i][1])
      rules.push(rule)
    }

    let _odd: number = this.state.odd === "" ? -1 : Number(this.state.odd)
    let _even: number = this.state.even === "" ? -1 : Number(this.state.even)
    let _prime: number = this.state.prime === "" ? -1 : Number(this.state.prime)
    let _composite: number = this.state.composite === "" ? -1 : Number(this.state.composite)
    let _linking: number = this.state.linking === "" ? -1 : Number(this.state.linking)

    ipc.api("modalShow")
    if (!search.is_init()) {
      search.init()
    }

    let state: any = this.state
    state.totalResults = search.search(_odd, _even, _prime, _composite, _linking, rules)
    if (state.totalResults === null) {
      state.totalResults = []
      ipc.api("modalClose")
      ipc.apiSend("messageDialog", "警告", `输入条件缺失, 请重新输入!`)
      return
    }
    ipc.apiSend("modalClose")

    this.setState(state)
  }

  makeResultLine(result: number[]): string {
    if (result.length === 0) {
      return ""
    }

    let str: string = ""
    for (let num of result) {
      str += `${num}, `
    }
    return str.substr(0, str.length - 2)
  }

  makeResults(): string[] {
    let pageIndex = this.state.resultPageIndex - 1
    let state: any = this.state
    let results: string[] = []
    if (state.resultRowEachPage !== -1) {
      let index: number = pageIndex * state.resultRowEachPage
      while (results.length < state.resultPageCount) {
        let result: string = ""
        for (let i = index; i < state.totalResults.length && i < index + state.resultRowEachPage; i++) {
          result += this.makeResultLine(state.totalResults[i]) + "\n"
        }
        if (result.length !== 0) {
          result = result.substr(0, result.length - 1)
        }
        results.push(result)
        index += state.resultRowEachPage
      }
    }
    else {
      let result: string = ""
      for (let i = 0; i < state.totalResults.length; i++) {
        result += this.makeResultLine(state.totalResults[i]) + "\n"
      }
      if (result.length !== 0) {
        result = result.substr(0, result.length - 1)
      }
      results.push(result)
    }
    return results
  }

  makeSettingsBoard() {
    return (
      <SettingsBoard 
        totalCount={this.state.tmpMaxNumber}
        selectCount={this.state.tmpSelectCount}
        onTotalCountChange={this.handleTotalCountChange}
        onSelectCountChange={this.handleSelectCountChange}
        onSettingsConfirm={this.handleSettingsConfirm}/>
    )
  }

  makeNumberCountBoard() {
    return(
      <NumberCountBoard
        selectCount={this.state.selectCount}

        odd={this.state.odd}
        even={this.state.even}
        prime={this.state.prime}
        composite={this.state.composite}
        linking={this.state.linking}

        onOddChange={this.handleOddChange}
        onEvenChange={this.handleEvenChange}
        onPrimeChange={this.handlePrimeChange}
        onCompositeChange={this.handleCompositeChange}
        onLinkingChange={this.handleLinkingChange}
        
        onOddClear={this.handleOddClear}
        onEvenClear={this.handleEvenClear}
        onPrimeClear={this.handlePrimeClear}
        onCompositeClear={this.handleCompositeClear}
        onLinkingClear={this.handleLinkingClear}/>
    )
  }

  render() {
    return (
      <div className="div-app">
          <NumberSelectorBoard
            rulesCount={this.state.rulesCount}
            totalSelectedStatus={this.state.totalSelectedStatus}
            totalSelectedRange={this.state.totalSelectedRange}
            maxNumber={this.state.maxNumber}
            selectCount={this.state.selectCount}
            onNumberSelected={this.hanldeNumberSelected}
            onNumberSelectedAll={this.handleNumberSelectedAll}
            onNumberSelectedClear={this.handleNumberSelectedClear}
            onNumberSelectedDelete={this.handleNumberSelectedDelete}
            onNumberSelectedAdd={this.handleNumberSelectedAdd}
            onSelectMinChange={this.hanldeSelectMinChange}
            onSelectMaxChange={this.hanldeSelectMaxChange}
            makeSettingsBoard={this.makeSettingsBoard}
            makeNumberCountBoard={this.makeNumberCountBoard} />
          <ResultsBoard
            results={this.makeResults()}
            pageIndex={this.state.resultPageIndex}
            totalResultCount={this.state.totalResults.length}
            totalPageCount={Math.ceil(this.state.totalResults.length / this.state.resultRowEachPage)}
            pageRowCount={this.state.resultRowEachPage}

            onStart={this.handleStart}
            onPageRowCountChange={this.handlePageRowCountChange}
            onPageIndexChange={this.hanldePageIndexChange}
            onResultAdd={this.handleResultAdd}
            onResultReduce={this.handleResultReduce}
            
            onResultFirst={this.handleResultFirst}
            onResultPrevious={this.handleResultPrevious}
            onResultNext={this.handleResultNext}
            onResultLast={this.handleResultLast}/>
      </div>
    )
  }
}