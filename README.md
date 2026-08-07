# React TODO board

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

A three-column TODO board with drag and drop between columns, built with
`react-beautiful-dnd`. Create a task, drag it between To Do, In Progress and Done, or
move it with the arrows in each column header.

| File | Role |
| --- | --- |
| `src/containers/App.js` | all the state and every handler |
| `src/components/ListOfTasks.js` | one column, a `<Droppable>` |
| `src/components/Task.js` | one card, a `<Draggable>` |
| `src/components/TaskArrowsForColumns.js` | the left/right arrows, hidden at the ends |
| `src/components/HeaderNav.js` | the filter box and the Create Task button |
| `src/boardStorage.js` | reads and writes the board to localStorage, safely |

## The bug worth knowing about

`onDragEnd` used to read `result.destination.droppableId` with no guard.
`react-beautiful-dnd` sets `destination` to **null** whenever a drop does not land on a
droppable, which happens when the user presses Escape mid-drag, releases outside every
column, or drops a card back exactly where it started. All three threw
`Cannot read property 'droppableId' of null` and took the whole app down, in this
repo's headline feature.

```js
onDragEnd = (result) => {
  if (!result.destination) return
  ...
}
```

One line, and it is the first thing to check in any `react-beautiful-dnd` integration.

## Persistence

The board saves to `localStorage` and reloads from it, so a refresh no longer throws
away everything you typed and resets to the three placeholder cards.

`src/boardStorage.js` treats storage as the untrusted input it is: a corrupt value
returns `null` and is **removed**, rather than throwing during render, because a value
that throws would brick the board on every subsequent load with no way out through the
UI. Unknown columns and malformed tasks are filtered at the boundary, and both reads
and writes are wrapped, since storage access throws outright when disabled by policy
and `setItem` throws on quota.

## What is deliberately not here

- No backend. The board is local to your browser.
- No editing a card once created, and no adding or removing columns.
- Tasks are added to **To Do** only.

## Installation

```shell
yarn install --frozen-lockfile
yarn start
yarn run lint
yarn test
yarn run build
```

`yarn.lock` is the committed lockfile, so this is a yarn project.

`.eslintrc` sets `parser: babel-eslint`. Without it eslint's default parser hits the
class properties in `App.js` and stops with `Parsing error: Unexpected token =`, which
is why `yarn run lint` had never completed a run here. `babel-eslint` is pinned to
exactly `10.0.1` because `react-scripts` 3.0.1's preflight check refuses to build when
`node_modules` holds a different version.

The pre-commit hook runs `yarn run fix && yarn run lint`, so `standard`'s formatting is
applied automatically rather than argued about.

**On Node 17 or newer `yarn run build` fails** with `ERR_OSSL_EVP_UNSUPPORTED`: webpack 4
asking OpenSSL 3 for MD4, not a problem with this code. The versions here are
deliberately frozen, so pass the flag:

```shell
NODE_OPTIONS=--openssl-legacy-provider yarn run build
```

CI runs on GitHub Actions, replacing a `.travis.yml` that deployed to a Heroku free
dyno with an encrypted API key, ran `echo "skipping tests"` in place of the tests, and
set `CI=false` so Create React App would stop reporting its warnings. Those warnings
were real: an `==`, an unused import, and an `<a href="#">` used as a button.
