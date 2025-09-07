class InputPortsNode {
  static title = "Input Ports";
  static desc = "Inherits type from PortNode";
  constructor() {
    for (let i = 0; i < NUM_PORTS; i++) {
      this.addOutput(`Controller ${i + 1}`, SLOT_PORT);
    }
    for (let i = 0; i < NUM_PORTS; i++) {
      this.addOutput(`Button ${i + 1}`, SLOT_BUTTON_CONTROLLER);
    }
    this.addOutput(`D Button`, SLOT_BUTTON_CONTROLLER);
    this.setDirtyCanvas(true, true);
  }
}
