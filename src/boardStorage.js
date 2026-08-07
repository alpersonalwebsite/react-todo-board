const KEY = 'react-todo-board'

// localStorage is untrusted input: the user can edit it, a half-finished write can
// truncate it, and reading it throws outright when storage is disabled by policy or in
// some private-browsing modes. Everything here fails to "no saved board" rather than
// taking the app down, because a corrupt value that throws during render would brick
// the board on every subsequent load too, with no way out through the UI.
export const readBoard = (categories) => {
  let raw
  try {
    raw = localStorage.getItem(KEY)
  } catch (err) {
    return null
  }
  if (!raw) return null

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    try {
      localStorage.removeItem(KEY)
    } catch (removeErr) {
      // nothing further to do
    }
    return null
  }

  if (!parsed || typeof parsed !== 'object') return null

  // Parsing succeeding is not the same as the value being usable. Only categories this
  // board actually has are accepted, and only entries with the right shape, so a stale
  // or hand-edited value cannot put something unrenderable into state.
  const board = {}
  categories.forEach((category) => {
    if (!Array.isArray(parsed[category])) return
    board[category] = parsed[category].filter(
      (task) =>
        task &&
        typeof task.id === 'string' &&
        typeof task.title === 'string'
    )
  })

  return Object.keys(board).length ? board : null
}

export const writeBoard = (state, categories) => {
  const board = {}
  categories.forEach((category) => {
    board[category] = state[category]
  })

  try {
    localStorage.setItem(KEY, JSON.stringify(board))
  } catch (err) {
    // QuotaExceededError, or storage disabled. Losing persistence is survivable.
  }
}
