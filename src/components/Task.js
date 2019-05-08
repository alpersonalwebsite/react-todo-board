import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import TaskArrowsForColumns from './TaskArrowsForColumns'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Task.module.css'

// function naming convention
const task = (props) => {
  const classesForTaskArr = [styles.task]
  classesForTaskArr.push('something')

  // convert to string
  const classesForTaskString = classesForTaskArr.join(' ')

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className={classesForTaskString}
            onClick={props.selectTask}
            style={{ backgroundColor: 'lavender' }}>
            <div className={styles.arrowsWidth16}
              onClick={props.deleteTask}>
              <FontAwesomeIcon icon="trash-alt" />
            </div>
            <div>Title: {props.title}</div>
            <div>Description: {props.description}</div>
            <TaskArrowsForColumns
              statusList={props.statusList}
              status={props.status}
              moveStatusTask={props.moveStatusTask} />
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default task
