class PresetAssignmentNode {
  static name = "Preset Assignment";

  constructor() {
    this.addInput("Control", SLOT_EVENT);
    this.addOutput("Preset", SLOT_BANK_OUTPUT);
  }

  onResize(s) {
    s = this.size;
    s[0] = 200;

    return s;
  }
}
