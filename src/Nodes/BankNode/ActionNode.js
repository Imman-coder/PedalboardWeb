class ActionNode {
    static title = "Action"
    constructor(){
        this.addInput("In", SLOT_ACTION);
        this.addOutput("Next", SLOT_ACTION);
    }
}

