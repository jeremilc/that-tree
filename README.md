# That-Tree

## Overview

File explorer project to navigate into server folders with a web app.

### Server

Nodejs server that watches files and folders for updates and send them to connected client via web sockets.

### File Explorer

React client web app that listens to a server via web sockets and displays received data. The client only knows that received data format is a node that can contains other nodes. It could be anything fitting that description, like files and folders.

## Requirements
* Yarn 1.22.4+.
* Node 16.13+

## Getting started

**Install all required dependencies.**

```
yarn
```

**Start server in dev mode.**

```
cd server && yarn start args
```
`args`: list of files and folder watched by the server.


Example:
```
cd server && yarn start /folder1/folder2 /file1 /folder3/file2 /folder4
```

**Start client in dev mode.**

```
cd file-explorer && yarn start
```

*Note: I try to start both client and server concurrently using [concurrently package](https://github.com/open-cli-tools/concurrently) but I didn't find a way to add outside CLI arguments to concurrent scripts.*
## Technological choices

### React and Typescript
Logical choices for a modern web app. Typescript ensure a more robust code base by defining both function return type and arguments type.

### Redux
Easy to implement with React and give a single source of truth for the app. Redux store ensures its constancy by giving permission to update the store to only reducers and by enabling all components to easily access needed store data via Redux selectors. 

### Immutable.js
React component state should be immutable by definition. So, by implementing immutable.js library in the Redux store, we ensure that the store is also immutable. Neither reducer nor components can mutate the store. 

### Normalized store
Web sockets send deeply nested data to the client. So, by normalizing them, it's easier to visualize the data and to access every node using Redux selectors.

### Web sockets
Probably the only solution for having a client always listening to a server.

### Structure by components
Each part of the app regroups all its logic inside a unique folder and exposes it to the outside world via an index file. Each part is then independent and easy to export.

## Further improvements

This app is far from perfect, and these are possible further improvements:

### More robust web sockets implementation
* Add exceptions handling on both client and server side.
* Validate received data.
* Try to reconnect or connect periodically to web sockets when not connected.

### More unit tests
Add unit tests for reducers, selectors, actions and components.

### Improve visual by using a Design system
Use a Design system, like Google's Material Design, to make the app prettier.








