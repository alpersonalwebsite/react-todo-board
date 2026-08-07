import { readBoard, writeBoard } from './boardStorage'

const CATEGORIES = ['toDo', 'inProgress', 'done']
const KEY = 'react-todo-board'

beforeEach(() => localStorage.clear())

it('returns null when nothing is saved', () => {
  expect(readBoard(CATEGORIES)).toBeNull()
})

it('round-trips a board', () => {
  const state = {
    toDo: [{ id: 'a', title: 'One', description: '' }],
    inProgress: [],
    done: [],
    filter: 'ignored'
  }
  writeBoard(state, CATEGORIES)
  expect(readBoard(CATEGORIES)).toEqual({ toDo: state.toDo, inProgress: [], done: [] })
})

// The board is rendered straight from this, so a corrupt value that threw would take
// the app down on every load, not just once.
it('survives a corrupt value and clears it', () => {
  localStorage.setItem(KEY, '{"toDo": ')
  expect(readBoard(CATEGORIES)).toBeNull()
  expect(localStorage.getItem(KEY)).toBeNull()
})

it('ignores unknown categories and malformed tasks', () => {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      toDo: [{ id: 'a', title: 'keep' }, { id: 2, title: 'bad id' }, null, 'nope'],
      somethingElse: [{ id: 'x', title: 'not a column here' }]
    })
  )
  expect(readBoard(CATEGORIES)).toEqual({ toDo: [{ id: 'a', title: 'keep' }] })
})
