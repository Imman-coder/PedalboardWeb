class LadderControllerNode {
  static title = "Ladder Controller";
  constructor() {
    this.addInput("Port", SLOT_PORT);

    for (let i = 0; i < NUM_LADDER; i++) {
      this.addOutput(`Out ${i + 1}`, SLOT_BUTTON_CONTROLLER);
    }

    this.serialize_widgets = true;

    this.properties = {
      useCustomLadder: false,
      ladderValue: [0, 0, 0, 0, 0, 0, 0],
      type: "one",
      single: true,
      latched: false,
      double: false,
      long: false,
    };

    this.addWidget("toggle", "Latched Emulation", false, {
      property: "latched",
    });
    // this.addWidget("toggle", "Single Press", true, {
    //   property: "single",
    // });
    // this.addWidget("toggle", "Double Press", false, {
    //   property: "double",
    // });
    // this.addWidget("toggle", "Long Press", false, {
    //   property: "long",
    // });

    this.addWidget(
      "toggle",
      "Custom Range",
      this.properties.useCustomLadder,
      (e) => this.onCustomRangeEnableChange(),
      { property: "useCustomLadder" }
    );
  }

  onCustomRangeEnableChange() {
    const e = this.properties.useCustomLadder;
    this.widgets = [];
    this.setDirtyCanvas(true, true);

    this.addWidget("toggle", "Latched Emulation", this.properties.latched, {
      property: "latched",
    });
    // this.addWidget("toggle", "Single Press", this.properties.single, {
    //   property: "single",
    // });
    // this.addWidget("toggle", "Double Press", this.properties.double, {
    //   property: "double",
    // });
    // this.addWidget("toggle", "Long Press", this.properties.long, {
    //   property: "long",
    // });
    this.addWidget(
      "toggle",
      "Custom Range",
      this.properties.useCustomLadder,
      (e) => this.onCustomRangeEnableChange(),
      { property: "useCustomLadder" }
    );

    if (!e) return;

    for (let i = 0; i < NUM_LADDER; i++) {
      this.addWidget(
        "number",
        `Ladder ${i + 1}`,
        this.properties.ladderValue[i],
        (e) => this.onCustomRangeChange(e, i),
        { min: 0, max: 100, step: 10 }
      );
    }
  }

  onCustomRangeChange(e, i) {
    this.properties.ladderValue[i] = e;
  }

  onExecute() {
    if (!this.first) {
      this.first = true;
      this.onCustomRangeEnableChange();
    }
    for (let i = 0; i < NUM_LADDER; i++) {
      this.setOutputData(i, this.properties);
    }
  }
  onOutputDblClick(i, e) {
    const a = LiteGraph.createNode("Handlers/button-handler");
    graph.add(a);
    this.connect(i, a, 0);
  }
}
