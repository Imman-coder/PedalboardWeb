class ButtonHandlerNode {
  static title = "Button Handler";
  constructor() {
    this.addInput("Control", SLOT_BUTTON_CONTROLLER);
    // this.addOutput("Event", SLOT_EVENT);
    this.addOutput("Single Press", SLOT_EVENT);
    this.addOutput("Double Press", SLOT_EVENT);
    this.addOutput("Long Press", SLOT_EVENT);
    this.nodee = {};
  }

  setInputType(d) {
    if (this.isChanged(d, this.nodee)) {
      if (!d) {
        this.nodee = {};
        // this.configureSlots();
        return;
      }
      this.nodee = { ...d };
      // this.configureSlots();
    }
  }

  configureSlots() {
    // this.outputs = [];
    // if (this.nodee?.single) {
    //   this.addOutput("Single Press", SLOT_EVENT);
    // }
    // if (this.nodee?.double) {
    //   this.addOutput("Double Press", SLOT_EVENT);
    // }
    // if (this.nodee?.long) {
    //   this.addOutput("Long Press", SLOT_EVENT);
    // }
  }

  onExecute() {
    this.setInputType(this.getInputData(0));
  }

  isChanged(prev, curr) {
    return JSON.stringify(prev) !== JSON.stringify(curr);
  }
  onOutputDblClick(i, e) {
    const a = LiteGraph.createNode("Assignment/AssignmentNode");
    graph.add(a);
    this.connect(i, a, 0);
  }
}
