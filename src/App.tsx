import React from 'react';
import "./App.css"

import { NumberSelectorBoard  } from './NumberSelectorBoard'
import { SettingsBoard } from './SettingsBoard'
import { NumberCountBoard } from './NumberCountBoard'

import { ipc } from './ipc'

export class App extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.hanldeNumberSelected = this.hanldeNumberSelected.bind(this)
    this.handleNumberSelectedAll = this.handleNumberSelectedAll.bind(this)
    this.handleNumberSelectedClear = this.handleNumberSelectedClear.bind(this)
    this.handleNumberSelectedDelete = this.handleNumberSelectedDelete.bind(this)
    this.handleNumberSelectedAdd = this.handleNumberSelectedAdd.bind(this)
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

    this.state = {
      totalSelectedStatus: [],
      rulesCount: 1,
      maxNumber: 33,
      selectCount: 6,
      tmpMaxNumber: 33,
      tmpSelectCount: 6,
      odd: "",
      even: "",
      prime: "",
      composite: "",
      linking: ""
    }

    for (let i = 0; i < this.state.rulesCount; i++) {
      let selectedStatus: boolean[] = []
      for (let j = 0; j < this.state.maxNumber; j++) {
        selectedStatus.push(false)
      }
      this.state.totalSelectedStatus.push(selectedStatus)
    }
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
    for (let i = 0; i < state.totalSelectedStatus.length; i++) {
      if (i === selectorIndex)
        continue
      newArr.push(state.totalSelectedStatus[i])
    }
    state.totalSelectedStatus = newArr

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
    state.maxNumber = state.tmpMaxNumber
    state.selectCount = state.tmpSelectCount

    state.totalSelectedStatus = []
    for (let i = 0; i < state.rulesCount; i++) {
      let selectedStatus: boolean[] = []
      for (let j = 0; j < state.maxNumber; j++) {
        selectedStatus.push(false)
      }
      state.totalSelectedStatus.push(selectedStatus)
    }

    state.odd = ""
    state.even = ""
    state.prime = ""
    state.composite = ""
    state.linking = ""

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

  render() {
    return (
      <div className="div-app">
          <SettingsBoard 
            totalCount={this.state.tmpMaxNumber}
            selectCount={this.state.tmpSelectCount}
            onTotalCountChange={this.handleTotalCountChange}
            onSelectCountChange={this.handleSelectCountChange}
            onSettingsConfirm={this.handleSettingsConfirm}/>
          <div className="div-app-sep"></div>
          <NumberSelectorBoard
            rulesCount={this.state.rulesCount}
            totalSelectedStatus={this.state.totalSelectedStatus}
            maxNumber={this.state.maxNumber}
            selectCount={this.state.selectCount}
            onNumberSelected={this.hanldeNumberSelected}
            onNumberSelectedAll={this.handleNumberSelectedAll}
            onNumberSelectedClear={this.handleNumberSelectedClear}
            onNumberSelectedDelete={this.handleNumberSelectedDelete}
            onNumberSelectedAdd={this.handleNumberSelectedAdd} />
          <div className="div-app-sep"></div>
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
          <div className="div-app-sep"></div>
      </div>
    )
  }
}