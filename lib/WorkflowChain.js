module.exports = class WorkflowChain {
	constructor (workflowTask) {
		this._workflowTask = workflowTask
	}

  isValidState(state) {
    var f = this._workflowTask.filter( (value, index, arr) => {
      if ( value.taskName == state ) { return value };
    });
    if ( f.length > 0 ) {
      return true;
    } else {
      return false;
    }
  }

  getStart() {
    return this._workflowTask[0];
  }

  getNext(state){
    // Get the index of the provided state
    var i = this._workflowTask.map( (e) => {
      return e._taskName;
    }).indexOf(state);

    if ( i == (this._workflowTask.length - 1) ) {
			// Should return a complete or success object ???
      return { "status" : "complete" };
    } else {
      return this._workflowTask[i + 1];
    }
  }

  getPrevious(state) {
    // Get the index of the provided state
    var i = this._workflowTask.map( (e) => {
      return e._taskName;
    }).indexOf(state);

    // return the previous state (unless index = 0)
    if ( i == 0 ) {
      // Give em the first one
      return this._workflowTask[0];
     } else {
      // give em the previous one
      return this._workflowTask[i - 1];
    }
  }

  // Insert Link At
  // // Should be able to handle this natively via splice

  // Add Link

  // Export Chain

  // Persist Chain ???
}
