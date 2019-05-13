# TODO list

[![Greenkeeper badge](https://badges.greenkeeper.io/alpersonalwebsite/react-todo-board.svg)](https://greenkeeper.io/)

Drag cards between lists... Under development...

### Notes:
1. In `.travis.yml` we add the following `environment variable`:
   ```
   env:
    - CI=false
   ```
... since we want to AVOID treating `warnings as errors` which would result in `Failed to compile` and, in consequence, our build would fail. In most `CI servers` CI is set it to `true` by default.
1. We set `eslint` and all `eslint` related libraries inside `dependencies` (not `devDependencies`)
   ```json
    "eslint": "^5.16.0",
    "eslint-config-standard": "^12.0.0",
    "eslint-plugin-import": "^2.17.2",
    "eslint-plugin-node": "^9.0.1",
    "eslint-plugin-promise": "^4.1.1",
    "eslint-plugin-react": "^7.12.4",
    "eslint-plugin-standard": "^4.0.0"
   ```
   We are going to do this for any current and/or future dependency in apps created wth `Create React App` that were not ejected. 

For more information check: https://github.com/facebook/create-react-app/issues/2696

> TLDR: this solves issues for some users, and doesn't make any difference for other people. Those who don't like it can always move it to devDependencies themselves.
 I don't think npm's advice is very relevant here. It is primarily concerning Node apps. CRA doesn't give you a Node app. From that perspective, all dependencies (including React) are "dev" dependencies because they're only necessary for the build: once you build the app, it has no deps at all. But putting react and react-dom in devDependencies will be just as confusing, and create those additional problems for some hosting providers. So instead we put them all in dependencies. **Dan Abramov**