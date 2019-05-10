import React from 'react'
import styles from './HeaderNav.module.css'

const headerNav = (props) => {
  return (
    <div className={styles.bar}>
      <input />
      <div>
        <a href="#" onClick={props.toggleAddTaskForm} className={styles.myButton}>Create Task</a>
      </div>
      <div>Filter</div>
    </div>
  )
}

export default headerNav
