import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './TaskArrowsForColumns.module.css'

const taskArrowsForColumns = (props) => {
  let arrowsForColumn = null
  if (props.statusList.indexOf(props.status) === 0) {
    arrowsForColumn = (
      <div className={styles.arrowsRow}>
        <span className={styles.arrowsWidth16} ></span>
        <span>{props.status}</span>
        <span
          className={styles.arrowsWidth16}
          onClick={props.moveStatusTask.bind(this, 'right')}>
          <FontAwesomeIcon icon="arrow-alt-circle-right" />
        </span>
      </div>
    )
  } else if (props.statusList.indexOf(props.status) === props.statusList.length - 1) {
    arrowsForColumn = (
      <div className={styles.arrowsRow}>
        <span
          className={styles.arrowsWidth16}
          onClick={props.moveStatusTask.bind(this, 'left')}>
          <FontAwesomeIcon icon="arrow-alt-circle-left" />
        </span>
        <span>{props.status}</span>
        <span className={styles.arrowsWidth16}></span>
      </div>
    )
  } else {
    arrowsForColumn = (
      <div className={styles.arrowsRow}>
        <span
          className={styles.arrowsWidth16}
          onClick={props.moveStatusTask.bind(this, 'left')}>
          <FontAwesomeIcon icon="arrow-alt-circle-left" />
        </span>
        <span>{props.status}</span>
        <span
          className={styles.arrowsWidth16}
          onClick={props.moveStatusTask.bind(this, 'right')}>
          <FontAwesomeIcon icon="arrow-alt-circle-right" />
        </span>
      </div>
    )
  }

  return arrowsForColumn
}

export default taskArrowsForColumns
