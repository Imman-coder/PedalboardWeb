class PresetNode {
  static name = "Preset";

  constructor() {
    this.addInput("Trigger", SLOT_BANK_OUTPUT);
    this.properties = { name: "" };
    this.addWidget("text", "Name", this.properties.name, { property: "name" });
    this.addOutput(`Action`, SLOT_ACTION);
  }
}
