# Chains - a workflow engine

## Quick Start
### Setup
npm install chains

const chains = require('chains');

### Make free standing tasks

var fs = require('fs');

var task1 = new WorkflowTask_Simple(
  "Create Test File",
  () => {console.log("task1: Pre Validation"); return true},
  () => {console.log("task1: Post Validation"); if ( fs.existsSync('/home/me/Desktop/test.txt') ) { return true } else { return false; } },
  () => {console.log("task1: Action phase"); fs.appendFile('/home/me/Desktop/test.txt', 'testing123', () => {});}
);

var task2 = new WorkflowTask_Simple(
  "Delete Test File",
  () => {console.log("task2: Pre Validation"); if ( fs.existsSync('/home/me/Desktop/test.txt') ) { return true } else { return false; } },
  () => {console.log("task2: Post Validation"); if ( fs.existsSync('/home/me/Desktop/test.txt') ) { return false } else { return true; } },
  () => {console.log("task2: Action phase"); fs.unlink('/home/me/Desktop/test.txt', () => {}); }
);

var task3 = new WorkflowTask_Simple(
  "Delete Test File 2",
  () => {console.log("task3: Pre Validation"); if ( fs.existsSync('/home/me/Desktop/test.txt') ) { return true } else { return false; } },
  () => {console.log("task3: Post Validation"); if ( fs.existsSync('/home/me/Desktop/test.txt') ) { return false } else { return true; } },
  () => {console.log("task3: Action phase"); fs.unlink('/home/me/Desktop/test.txt', () => {}); }
);

### Make a task chain that includes these tasks
var wfChain = new chains.WorkflowChain([task1, task2, task3]);



