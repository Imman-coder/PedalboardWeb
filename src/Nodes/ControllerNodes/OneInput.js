class OneInputNode {
  static title = "One Input Controller";
  constructor() {
    this.addInput("Port", SLOT_PORT);
    this.addOutput("Control", SLOT_BUTTON_CONTROLLER);
    this.size = [180, 30];

    this.serialize_widgets = true;

    this.properties = {
      type: "one",
      single: true,
      latched: false,
      double: false,
      long: false,
    };

    this.latchedWidget = this.addWidget("toggle", "Latched Emulation", false, {
      property: "latched",
    });
    this.singlePressWidget = this.addWidget("toggle", "Single Press", true, {
      property: "single",
    });
    this.doublePressWidget = this.addWidget("toggle", "Double Press", false, {
      property: "double",
    });
    this.longPressWidget = this.addWidget("toggle", "Long Press", false, {
      property: "long",
    });
  }

  onExecute() {
    let value = this.properties;
    this.setOutputData(0, value);
  }
  onOutputDblClick(i, e) {
    const a = LiteGraph.createNode("Handlers/button-handler");
    graph.add(a);
    this.connect(i, a, 0);
  }
}
