# TODO list

[![Greenkeeper badge](https://badges.greenkeeper.io/alpersonalwebsite/react-todo-board.svg)](https://greenkeeper.io/)

Drag cards between lists... Under development...

### Notes:
1. In `.travis.yml` we run the following script: `process.env.CI=false yarn run build`

   a. Since we want to AVOID treating `warnings as errors` which would result in `Failed to compile` and, in consequence, our build would fail. In most `CI servers` CI is set it to `true` by default.

   b. We want to deploy the `artifact` or build of our project. 
