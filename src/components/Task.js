import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import TaskArrowsForColumns from './TaskArrowsForColumns'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Task.module.css'

// function naming convention
const task = (props) => {
  // Was [styles.task, 'something'], where 'something' is not a class that exists
  // anywhere in this project: a placeholder that shipped.
  const classesForTaskString = [styles.task, props.isSelected ? styles.selected : '']
    .filter(Boolean)
    .join(' ')

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className={classesForTaskString}
            onClick={props.selectTask}>
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
