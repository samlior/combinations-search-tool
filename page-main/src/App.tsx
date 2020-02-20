import React from 'react';
import "./App.css"

import { NumberSelectorBoard  } from './NumberSelectorBoard'
import { SettingsBoard } from './SettingsBoard'
import { NumberCountBoard } from './NumberCountBoard'
import { ResultsBoard } from './ResultsBoard'
import { SumSettings } from './SumSettings'

import { ipc } from './ipc'

import * as search from './search'

export class App extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.hanldeNumberSelected = this.hanldeNumberSelected.bind(this)
    this.handleNumberSelectedAll = this.handleNumberSelectedAll.bind(this)
    this.handleNumberSelectedClear = this.handleNumberSelectedClear.bind(this)
    this.handleNumberSelectedDelete = this.handleNumberSelectedDelete.bind(this)
    this.handleNumberSelectedAdd = this.handleNumberSelectedAdd.bind(this)
    this.handleRangeSelected = this.handleRangeSelected.bind(this)

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
    this.handleCopy = this.handleCopy.bind(this)

    this.makeSettingsBoard = this.makeSettingsBoard.bind(this)
    this.makeNumberCountBoard = this.makeNumberCountBoard.bind(this)
    this.makeSumSettings = this.makeSumSettings.bind(this)

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
      totalResults: []
    }

    for (let i = 0; i < this.state.rulesCount; i++) {
      let selectedStatus: boolean[] = []
      for (let j = 0; j < this.state.maxNumber; j++) {
        selectedStatus.push(false)
      }
      this.state.totalSelectedStatus.push(selectedStatus)

      let selectedRange: boolean[] = []
      for (let j = 0; j <= this.state.selectCount; j++) {
        selectedRange.push(false)
      }
      this.state.totalSelectedRange.push(selectedRange)
    }

    ipc.on("clearAll", ()=>{
      let state = this.state
      this.clearAllButDoNotReflesh(state)
      this.setState(state)
    })
  }

  handleRangeSelected(selectorIndex, num, checked) {
    let state = this.state
    if (selectorIndex >= state.totalSelectedRange.length) {
      return
    }

    state.totalSelectedRange[selectorIndex][num] = checked
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
    this.setState(state)
  }

  handleNumberSelectedDelete(selectorIndex) {
    let state: any = this.state
    if (selectorIndex >= state.totalSelectedStatus.length) {
      return
    }

    let newArr: boolean[][] = []
    let newArr2: boolean[][] = []
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
    let newArr2: boolean[] = []
    for (let i = 0; i <= this.state.selectCount; i++) {
      newArr2.push(false)
    }
    state.totalSelectedStatus.push(newArr)
    state.totalSelectedRange.push(newArr2)
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
    state.totalSelectedRange = []
    for (let i = 0; i < state.rulesCount; i++) {
      let selectedStatus: boolean[] = []
      for (let j = 0; j < state.maxNumber; j++) {
        selectedStatus.push(false)
      }
      state.totalSelectedStatus.push(selectedStatus)

      let selectedRange: boolean[] = []
      for (let j = 0; j <= state.selectCount; j++) {
        selectedRange.push(false)
      }
      state.totalSelectedRange.push(selectedRange)
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
        ipc.apiSend("messageDialog", "警告", "输入参数非法, 请重新输入! X﹏X")
        return
    }
    if (state.tmpMaxNumber > 99) {
        ipc.apiSend("messageDialog", "警告", "最大数字总数只支持99! X﹏X")
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

  handleStart() {

    ipc.api("checkLocalStatus").then(
      (response) => {
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

          for (let j = 0; j < this.state.totalSelectedRange[i].length; j++) {
            if (this.state.totalSelectedRange[i][j]) {
              rule.show_count.push(j)
            }
          }
          if (rule.show_count.length === 0) {
            continue
          }

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
          ipc.apiSend("messageDialog", "警告", `输入条件缺失, 请重新输入! X﹏X`)
          return
        }
        ipc.apiSend("modalClose")

        this.setState(state)
      },
      (response) => {}
    )
  }

  handleCopy() {
    let result = this.makeResult()
    ipc.apiSend("copyData", result)
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

  makeResult(): string {
    let result: string = ""
    for (let i = 0; i < this.state.totalResults.length; i++) {
      result += this.makeResultLine(this.state.totalResults[i]) + "\n"
    }
    if (result.length !== 0) {
      result = result.substr(0, result.length - 1)
    }
    return result
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

  makeSumSettings() {
    return (
      <SumSettings />
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
            onRangeSelected={this.handleRangeSelected}

            makeSettingsBoard={this.makeSettingsBoard}
            makeNumberCountBoard={this.makeNumberCountBoard}
            makeSumSettings={this.makeSumSettings} />
          <ResultsBoard
            result={this.makeResult()}
            totalResultCount={this.state.totalResults.length}

            onStart={this.handleStart}
            onCopy={this.handleCopy} />
      </div>
    )
  }
}