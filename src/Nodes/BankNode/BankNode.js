class BankNode {
  static name = "Bank Node";
  constructor() {
    this.properties = {}
    for (let i = 0; i < NUM_PRESETS_PER_BANK; i++) {
      this.addOutput(`Preset ${i + 1}`, SLOT_BANK_OUTPUT);
    }

    this.properties = { name: "" };
    this.addWidget("text", "Name", this.properties.name, { property: "name" });
  }

  onExecute() {
    for (let i = 0; i < NUM_PRESETS_PER_BANK; i++) {
      this.setOutputData(i, 0);
    }
  }
}
