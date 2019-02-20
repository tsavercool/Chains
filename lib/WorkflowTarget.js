module.exports = class WorkFlowTarget {
	constructor(target, workflowChain, persist = false, write = () => {}) {
		this._target = target;
		this._workflowChain = workflowChain;

		this._state = ""; // Should pull first from workflow. Maybe create override with direct access?
		this._stateData = ""; // Stores state data like reciepts

		this._previousState = ""; // starts blank

		this._persist = persist;
		this._write = write; // Call something to dump state data into a record
	}

	get target() { return this._target };

	write() {
		// function that dumps the state data to disk

		// record(target); // ??? - Hand object to something external to log it.
		//  // how to seperate properties from functions ??
	}

	start() {
		// get the first task in the workflow workFlowChain
		this.setState( workflowChain.getStart() );
		objTask.run(this);
	}

	next() {
		// Set state to workflowTask
		if (! this._state ) {
			// If stateName is blank then we need to start from the begining
			this.start();
		} else {
			console.log("Nexting to:", this); // DELETE ME
			// Just get the next in line
			nState = this._workflowChain.getWorkflowTask(this._state);
			if ( pState.constructor.name.toString() == 'Object' ) {}
			this._state = objTask.taskName
			console.log("Nexting to:", this);
			// objTask.run(this);
		}
		//
	}

	previous() {
		var pState = this._workFlowChain.getPrevious(this.stateName);
		if ( pState.constructor.name.toString() == 'Object' ) {
			// We received a status object, not a state
			// We did not change so don't call setState
			// Log possible error ?
		} else {
				this.setState ( pState );
		}

		// Raise 'Previous' event here
		// You may have reached this by the Next task in the queue calling this.previous() so handle accordingly
	}

	setState(state) { // I should ideally be called with "workflowChain.state(id)" or workflowChain.getStateByName("Name");
		if ( state = "error" || this._workflowChain.isValidState(state) ) {
			this._previousState = this._state;
			this._stateData = ""; // clear stateData
			this._state = state;
			// Raise 'StateChanged' event
		} else {
			// Log error
			// raise error event
			this._state = "error";
		}

		// if ( persist ) { } // writes target to record
	}
}
