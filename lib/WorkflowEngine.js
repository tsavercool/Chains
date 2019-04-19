var events = require('events');

var deactivatorStates = ['task.error','task.complete','task.pending'];

module.exports = class WorkflowEngine {
    constructor(){
        this.eventEmitter = new events.EventEmitter();
        this._instances = [];

        this._activeInstances = new Set();
        this.maxActiveInstances = 10;

        // Event Listeners
        this.eventEmitter.on("stateChanged", (e) => {
            console.log(e.instanceId +": change from: " + e.previousState + " to: " + e.newState);

            if (deactivatorStates.includes(e.newState)){
                this._activeInstances.delete(e.instanceId);
            }
        });
    }   

    addInstance(instance) {
        if (instance.constructor.name == 'WorkFlowTarget') {
            instance.setEngineEmitter(this.eventEmitter);
            this._instances.push(instance);
            if (this.availableRunner()) {
                instance.next() 
            }
            return true;
        } else {
            return false;
        }
        
    }

    availableRunner() {
       return (this._activeInstances.size < this.maxActiveInstances);        
    }

    getInstanceStatus() {
        array = [];
        this._instances.forEach((i) => {
            array.push({
                instanceId: this.instanceId,
                state: this.state
            });
        })
        return array; 
    }


}