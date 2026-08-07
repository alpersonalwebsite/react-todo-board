import React, { Component } from 'react'
import uuidv1 from 'uuid/v1'
import { DragDropContext } from 'react-beautiful-dnd'
import ListOfTasks from '../components/ListOfTasks'
import HeaderNav from '../components/HeaderNav'
import styles from './App.module.css'
import { readBoard, writeBoard } from '../boardStorage'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowAltCircleRight,
  faArrowAltCircleLeft,
  faTrashAlt,
  faCoffee,
  faAdjust,
  faSearch
} from '@fortawesome/free-solid-svg-icons'

library.add(faArrowAltCircleRight,
  faArrowAltCircleLeft,
  faCoffee,
  faAdjust,
  faTrashAlt,
  faSearch)

/*
I´m using solid and free
https://fontawesome.com/icons?d=gallery&s=solid&m=free

Example usage:
In the module or component... import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
Then: <FontAwesomeIcon icon="trash-alt" />
*/

class App extends Component {
  state = {
    displayTaskForm: false,
    createTaskTitle: '',
    createTaskDesc: '',
    listOfStatus:
    {
      toDo: 'To Do',
      inProgress: 'In Progress',
      done: 'Done'
    },
    toDo: [
      { id: '1', title: 'Title 1...', description: 'Description 1...' },
      { id: '2', title: 'Title 2...', description: 'Description 2...' },
      { id: '3', title: 'Title 3...', description: 'Description 3...' }
    ],
    inProgress: [
      { id: '4', title: 'Title 4...', description: 'Description 4...' },
      { id: '5', title: 'Title 5...', description: 'Description 5...' }
    ],
    done: [
      { id: '6', title: 'Title 6...', description: 'Description 6...' }
    ],
    selectedTask: '',
    filter: ''
  }

  listOfCategories = Object.keys(this.state.listOfStatus)

  // The board lived in component state only, so a reload threw away every task the user
  // had created and reset to the three hardcoded placeholders. It persists to
  // localStorage now, which is the smallest thing that makes a todo board usable.
  componentDidMount () {
    const saved = readBoard(this.listOfCategories)
    if (saved) this.setState(saved)
  }

  componentDidUpdate (prevProps, prevState) {
    const changed = this.listOfCategories.some(
      (category) => prevState[category] !== this.state[category]
    )
    if (changed) writeBoard(this.state, this.listOfCategories)
  }

  onFilterChange = (event) => {
    this.setState({ filter: event.target.value })
  }

  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  toggleAddTaskForm = () => {
    // Functional form. Reading this.state and then setting from it is the classic
    // React race: setState is asynchronous and batched, so two calls in the same batch
    // both read the same value and the second undoes the first.
    this.setState((state) => ({ displayTaskForm: !state.displayTaskForm }))
  }

  // working onSubmit
  // we suppose that we always add to toDo
  addTaskHandler = (event) => {
    event.preventDefault()

    // The form had no validation, so submitting it empty added a blank card with no
    // title and no description, and no way to tell it apart from the others.
    const title = this.state.createTaskTitle.trim()
    if (!title) return

    const task = {
      id: uuidv1(),
      title,
      description: this.state.createTaskDesc.trim()
    }

    this.setState((state) => ({
      createTaskTitle: '',
      createTaskDesc: '',
      toDo: [...state.toDo, task]
    }))
  }

  deleteTaskHandler = (index, status) => {
    this.setState((state) => ({
      [status]: state[status].filter((_, i) => i !== index)
    }))
  }

  moveStatusTaskHandler = (index, status, leftOrRight, dragResult, newIndex) => {
    // Remember always to create a new copy of the array
    let tempArray = [...this.state[status]]

    // delete from x-status
    let removedArray = tempArray.splice(index, 1)

    // leftOrRight could be "right" or "left"
    const statusList = this.listOfCategories
    let newColumnStatus
    if (leftOrRight) {
      newColumnStatus = leftOrRight === 'right'
        ? statusList[statusList.indexOf(status) + 1]
        : statusList[statusList.indexOf(status) - 1]
    }
    if (dragResult) {
      newColumnStatus = dragResult
    }
    // add to x-status
    // === not ==. Both operands are strings here so the behaviour is identical, but the
    // loose form is the one that eventually bites, and CI was reporting it as an eqeqeq
    // warning that CI=false suppressed.
    if (status === dragResult) {
      const newArr = this.placeElementinArray(this.state[status],
        this.state[status].slice(index)[0],
        newIndex)

      this.setState({ [status]: newArr })
    } else {
      this.setState({
        [status]: tempArray,
        [newColumnStatus]: [...this.state[newColumnStatus], removedArray[0]]
      })
    }
  }

  placeElementinArray = (arr, elem, index) => {
    const filteredArr = arr.filter(el => el.id !== elem.id)
    const arrStartIndex = 0
    const arrEndIndex = arr.length - 1

    if (typeof index !== 'number') {
      return filteredArr
    } else if (index === arrStartIndex) {
      return [elem, ...filteredArr]
    } else if (index === arrEndIndex) {
      return [...filteredArr, elem]
    } else {
      return [...filteredArr.slice(arrStartIndex, index), elem, ...filteredArr.slice(index)]
    }
  }

  // Selecting a card used to console.log and nothing else, so the feature existed in
  // the UI and did nothing. It now highlights the selected card, and clicking it again
  // clears the selection.
  // The header's search box existed but was wired to nothing. Filtering happens at
  // render time rather than by mutating the lists, so clearing the box brings
  // everything back and a filtered view can never lose a task.
  visibleTasks = (category) => {
    const needle = this.state.filter.trim().toLowerCase()
    if (!needle) return this.state[category]
    return this.state[category].filter(
      ({ title, description }) =>
        title.toLowerCase().includes(needle) ||
        (description || '').toLowerCase().includes(needle)
    )
  }

  selectTaskHandler = (id) => {
    this.setState((state) => ({ selectedTask: state.selectedTask === id ? '' : id }))
  }

  onDragEnd = (result) => {
    // result.destination is null whenever the drop did not land on a droppable: the
    // user pressed Escape, released outside every column, or dropped back exactly where
    // they started. react-beautiful-dnd documents this and it is the single most common
    // way to crash a board. Reading .droppableId off it threw
    // "Cannot read property 'droppableId' of null" and took the whole app down, in this
    // repo's headline feature.
    if (!result.destination) return

    this.moveStatusTaskHandler(result.source.index,
      result.source.droppableId,
      null,
      result.destination.droppableId,
      result.destination.index)
  }

  render () {
    let tasksForm = null
    if (this.state.displayTaskForm) {
      tasksForm = (
        <div>
          <form onSubmit={this.addTaskHandler}>
            <input name="createTaskTitle" type="text" onChange={this.changeHandler} value={this.state.createTaskTitle} />
            <input name="createTaskDesc" type="text" onChange={this.changeHandler} value={this.state.createTaskDesc} />
            <input type="submit" value="Submit" />
          </form>
        </div>
      )
    }

    // Que pasa cuando borro todas por ehjemplo de todo
    let mappingTasksCategories = null

    // es necesario...? por si o borro o agrego functionalidad de borrar categoria ????

    if (this.state.listOfStatus) {
      mappingTasksCategories = this.listOfCategories.map((category) => {
        return (
          <ListOfTasks
            key={category}
            status={category}
            moveStatusTask={this.moveStatusTaskHandler}
            statusList={this.listOfCategories}
            deleteTask={this.deleteTaskHandler}
            selectTask={this.selectTaskHandler}
            selectedTask={this.state.selectedTask}
            tasks={this.visibleTasks(category)} >
            {`${this.state.listOfStatus[category]}  ${this.state[category].length}`}
          </ ListOfTasks>
        )
      })
    }
    return (
      <div className="App">
        <h1>Board</h1>
        <HeaderNav
          toggleAddTaskForm={this.toggleAddTaskForm}
          filter={this.state.filter}
          onFilterChange={this.onFilterChange}
        />
        {tasksForm}

        <div className={styles.flexGrid}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {mappingTasksCategories}
          </DragDropContext>
        </div>
      </div>
    )
  }
}

export default App
