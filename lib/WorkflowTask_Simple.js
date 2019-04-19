module.exports = class WorkflowTask_Simple {
	constructor(taskName, preValidation, postValidation, action) {
		this._taskName = taskName;

		this._preValidation = preValidation;
		this._postValidation = postValidation;
		this._action = action;

    this._result;

	}

	// These actions should be treated as 1 unit of work
	// try not to look at where the failure occured inside of this unit of work

	run(target) {
		// Update SubState

		// Call PreValidate
		try { this._result = this._preValidation(target); } catch(err) {
			// log or raise error event?
			target.previous();
		}
		// if fail ask object to go back ( previous()? )

    this._result = this._postValidation(target)
		if ( this._result ) {
      // Looks like this task doesn't need to execute
      target.next();
      return true;
		} else {
			this._result = this._action(target);
		}

    this._result = this._postValidation(target);
    if ( this._result ) {
      // ok we are done. Call next on target.
      // Maybe this should go through the event loop?
  		if (! target._step) { target.next() };
      return true;
    } else {
      target.setState("task.error");
      // Raise error event here
      return false;
    }

	}
	
	get taskName() { return this._taskName };

}
