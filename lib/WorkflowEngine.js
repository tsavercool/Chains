var events = require('events');

module.exports = class WorkflowEngine {
    constructor(){
        this.eventEmitter = new events.EventEmitter();
        this._instances = [];
    }   

    addInstance(instance) {
        if (instance.constructor.name == 'WorkFlowTarget') {
            // TODO:
            // Set GUID
            // Define a data provider layer so that you can modularly swap it out
            // Write GUID, Target object to DataProvider
            instance.setEngineEmitter(this.eventEmitter);
            this._instances.push(instance);
            return true;
        } else {
            return false;
        }
        
    }
}