class AssignMentNode {
  static name = "Assignment Node";

  constructor() {
    this.addInput("Control", SLOT_EVENT);

    this.properties = { type: 0, bank: 1, preset: 1 };
    this.serialize_widgets = true;

    this.addWidget(
      "combo",
      "Action Type",
      assignmentNodetypes[0],
      (e) => this.onActionTypeChange(e),
      { property: "type", values: assignmentNodetypes }
    );

    this.onActionTypeChange();
  }

  onResize(s) {
    s = this.size;
    s[0] = 270;

    return s;
  }

  onActionTypeChange() {
    const e = this.properties.type;

    this.widgets = [];

    this.addWidget(
      "combo",
      "Action Type",
      e,
      (e) => this.onActionTypeChange(e),
      { property: "type", values: assignmentNodetypes }
    );

    switch (e) {
      case 5:
        this.addWidget("number", "Bank Number", this.properties.bank, {
          property: "bank",
          min: 1,
          step: 10,
          precision: 0,
          max: 20,
        });
        break;
      case 7:
        this.addWidget("number", "Bank Number", this.properties.bank, {
          property: "bank",
          min: 0,
          step: 10,
          precision: 0,
          max: 20,
        });
      case 6:
        this.addWidget("number", "Preset Number", this.properties.preset, {
          property: "preset",
          min: 1,
          step: 10,
          precision: 0,
          max: 20,
        });
        break;

      default:
        break;
    }
  }

  onExecute() {
    if (!this.first) {
      this.first = true;
      this.onActionTypeChange();
    }
  }
}

const assignmentNodetypes = {
  0: "None",
  1: "Bank Up",
  2: "Bank Down",
  3: "Preset Up",
  4: "Preset Down",
  5: "Bank Select",
  6: "Current Bank Preset",
  7: "Fixed Bank Preset",
};
