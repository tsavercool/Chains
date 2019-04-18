// console.clear();

/*
var Datastore = require('nedb');
var serversdb = new Datastore({ filename: 'servers.db', autoload: true});
serversdb.ensureIndex({ fieldName: 'server', unique: true });
*/


var WorkflowTarget = require('./lib/WorkflowTarget.js');
var WorkflowTask_Simple = require('./lib/WorkflowTask_Simple.js');
var WorkflowTask_Reciept = require('./lib/WorkflowTask_Reciept.js');
var WorkflowChain = require('./lib/WorkflowChain.js');
var WorkflowEngine = require('./lib/WorkflowEngine.js');

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

var engine = new WorkflowEngine();
var wfList = [task1, task2, task3];
var chain = new WorkflowChain(wfList);
var t = new WorkflowTarget("testServer1", chain);
//t._step =true;
//t.start();


/*
console.log( chain.isValidState("Create Test File") );
console.log( chain.isValidState("Create Test Fi2le") );
console.log( chain.getPrevious("Create Test File") );
console.log( chain.getPrevious("Delete Test File") );
*/

/*
obj = {
  taskName : "task3",
  preValidation : () => {console.log("task1: Pre Validation"); return true},
  postValidation : () => {console.log("task1: post Validation"); if ( fs.existsSync('/home/me/Desktop/test.txt') ) { return true } else { return false; } },
  action : () => {console.log("task1: action phase"); fs.appendFile('/home/me/Desktop/test.txt', 'testing123', () => {});}
}
var task3 = new WorkflowTask_Simple(obj);
*/
