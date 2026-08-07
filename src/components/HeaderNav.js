import React from 'react'
import styles from './HeaderNav.module.css'

const headerNav = (props) => {
  return (
    <div className={styles.bar}>
      {/* The search box was an <input> with no label and no handler: it looked like a
          feature and did nothing. Labelled, and wired to the filter below. */}
      <input
        type="search"
        aria-label="Filter tasks by title"
        placeholder="Filter tasks..."
        value={props.filter}
        onChange={props.onFilterChange}
      />
      <div>
        {/* Was <a href="#">, which CI reported as jsx-a11y/anchor-is-valid: an anchor
            with no destination is not a link, it is a button wearing a link's clothes,
            and it breaks keyboard and screen-reader expectations. */}
        <button type="button" onClick={props.toggleAddTaskForm} className={styles.myButton}>
          Create Task
        </button>
      </div>
    </div>
  )
}

export default headerNav
