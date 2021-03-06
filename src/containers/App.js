import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';
import { DragDropContext } from 'react-beautiful-dnd';
import ListOfTasks from '../components/ListOfTasks';
import HeaderNav from '../components/HeaderNav';
import styles from './App.module.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowAltCircleRight,
  faArrowAltCircleLeft,
  faTrashAlt,
  faCoffee,
  faAdjust,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

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
    selectedTask: ''
  }

  listOfCategories = Object.keys(this.state.listOfStatus)

  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  toggleAddTaskForm = () => {
    const currentValue = this.state.displayTaskForm;
    this.setState({ displayTaskForm: !currentValue })
  }

  // working onSubmit
  // we suppose that we always add to toDo
  addTaskHandler = (event) => {
    event.preventDefault();
    let tempObject = {};
    tempObject.id = uuidv1();
    tempObject.title = this.state.createTaskTitle;
    tempObject.description = this.state.createTaskDesc;
    this.setState({
      createTaskTitle: '',
      createTaskDesc: '',
      toDo: [...this.state.toDo, tempObject]
    })
  }

  deleteTaskHandler = (index, status) => {
    // Remember always to create a new copy of the array
    let tempArray = [...this.state[status]]
    tempArray.splice(index, 1);
    this.setState({ [status]: tempArray })
  }

  moveStatusTaskHandler = (index, status, leftOrRight, dragResult, newIndex) => {

    // Remember always to create a new copy of the array
    let tempArray = [...this.state[status]];

    // delete from x-status
    let removedArray = tempArray.splice(index, 1);

    //leftOrRight could be "right" or "left"
    const statusList = this.listOfCategories
    let newColumnStatus
    if (leftOrRight) {
      newColumnStatus = leftOrRight === 'right' ?
        statusList[statusList.indexOf(status) + 1] :
        statusList[statusList.indexOf(status) - 1];
    }
    if (dragResult) {
      newColumnStatus = dragResult
    }
    //add to x-status
    if (status == dragResult) {
      const newArr = this.placeElementinArray(this.state[status],
        this.state[status].slice(index)[0],
        newIndex)

      this.setState({ [status]: newArr })

    } else {
      this.setState({
        [status]: tempArray,
        [newColumnStatus]: [...this.state[newColumnStatus], removedArray[0]]
      });
    }

  }

  placeElementinArray = (arr, elem, index) => {

    const filteredArr = arr.filter(el => el.id !== elem.id);
    const arrStartIndex = 0
    const arrEndIndex = arr.length - 1

    if (typeof index != 'number') {
      return filteredArr
    } else if (index === arrStartIndex) {
      return [elem, ...filteredArr]
    } else if (index === arrEndIndex) {
      return [...filteredArr, elem]
    } else {
      return [...filteredArr.slice(arrStartIndex, index), elem, ...filteredArr.slice(index)]
    }
  }

  selectTaskHandler = (id, status) => {
    console.log('Selected!', id, status)
  }

  onDragEnd = (result) => {
    this.moveStatusTaskHandler(result.source.index,
      result.source.droppableId,
      null,
      result.destination.droppableId,
      result.destination.index)
  }

  render() {

    let tasksForm = null;
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
    let mappingTasksCategories = null;

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
            tasks={this.state[category]} >
            {`${this.state.listOfStatus[category]}  ${this.state[category].length}`}
          </ ListOfTasks>
        )
      })
    }
    return (
      <div className="App">
        <h1>Board</h1>
        <HeaderNav toggleAddTaskForm={this.toggleAddTaskForm} />
        {tasksForm}



        <div className={styles.flexGrid}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {mappingTasksCategories}
          </DragDropContext>
        </div>
      </div>
    );
  }
}

export default App;
