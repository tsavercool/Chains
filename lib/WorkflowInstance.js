const uuid = require('uuid');

class WorkFlowEventObj {
	constructor(id, state, stateData) {

	}

}

module.exports = class WorkFlowTarget {
	constructor(target, workflowChain, persist = false, write = () => {}) {
		this._target = target;
		this._workflowChain = workflowChain;

		this.id = uuid.v1(); // generate unique identifier for this instance

		this._state = ""; // Should pull first from workflow. Maybe create override with direct access?
		this._stateData = ""; // Stores state data like reciepts

		this._previousState = ""; // starts blank

		this._persist = persist; // needs to be forced to true when engine provided ( engine can override this itself )
		this._write = write; // Call something to dump state data into a record

		this._engineEmitter;

		this._step = false; // This should be overridden when an engine is provided
	}

	get target() { return this._target };

	write() {
		// function that dumps the state data to disk

		// record(target); // ??? - Hand object to something external to log it.
		//  // how to seperate properties from functions ??
	}

	setEngineEmitter(engineEmitter) {
			this._engineEmitter = engineEmitter;
	}

	start() {
		// get the first task in the workflow workFlowChain
		var objTask = this._workflowChain.getStart();
		this.setState( objTask );
		return objTask.run(this);
	}

	next() {
		// Set state to workflowTask
		if (! this._state ) {
			// If stateName is blank then we need to start from the begining
			this.start();
		} else {
			// Just get the next in line
			var nState = this._workflowChain.getNext(this._state);
			if ( nState.constructor.name.toString() == 'Object' ) {
				// TODO: Why did I think this could be an error?
				// We are either done or had an error
				this.setState('task.complete');
				return (nState);
			} else {
					this.setState( nState )
					nState.run( this );
					return { status : "next" };
			}
		}
		//
	}

	previous() {
		var pState = this._workFlowChain.getPrevious(this._state);
		if ( pState.constructor.name.toString() == 'Object' ) {
			// We received a status object, not a state
			// We did not change so don't call setState
			// Log possible error ?
			return false;
		} else {
				this.setState ( pState );

				return true;
		}

		// Raise 'Previous' event here
		// You may have reached this by the Next task in the queue calling this.previous() so handle accordingly
	}

	setState(objTask) {
//		if ( objTask._taskName == "error" || this._workflowChain.isValidState(objTask._taskName) ) {
		 console.log("Attempting to set state to", objTask._taskName);
	 	 if ( objTask._taskName == "task.error" ) {
			this._previousState = this._state;
			// this._stateData = ""; // clear stateData
			this._state = "task.error";
			// Raise 'StateChanged' event
			this.eventStateChanged();	
			// Raise state error event
		} else if ( this._workflowChain.isValidState(objTask._taskName) || objTask == "task.complete") {
			this._previousState = this._state;
			this._stateData = ""; // clear stateData
			this._state = objTask._taskName || 'task.complete';
			this.eventStateChanged();
		} else {
			// Log error
			// raise error event
			this._state = "task.error";
			this.eventStateChanged();
	  	}

		// if ( persist ) { } // writes target to record
	}

	eventStateChanged() {
		if (this._engineEmitter) {
			this._engineEmitter.emit('stateChanged', {instanceId: this.id, previousState: this._previousState, newState: this._state, stateData: this._stateData});
		}
	}
}
