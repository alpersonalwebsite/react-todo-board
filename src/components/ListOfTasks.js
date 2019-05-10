import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import Task from './Task'
import styles from './ListOfTasks.module.css'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'

const listOfTasks = (props) => {
  return (
    <Droppable droppableId={props.status}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className={styles.col}>
          <div className={styles.title}>{props.children}</div>
          {props.tasks.map(({ id, title, description }, index) =>
            <Task
              statusList={props.statusList}
              status={props.status}
              moveStatusTask={(leftOrRight) => props.moveStatusTask(index, props.status, leftOrRight)}
              deleteTask={() => props.deleteTask(index, props.status)}
              selectTask={() => props.selectTask(id, props.status)}
              key={id}
              id={id}
              index={index}
              title={title}
              description={description} />
          )
          }
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default listOfTasks
