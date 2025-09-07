class ExpressionHandlerNode {
  static title = "Expression Handler";
  constructor() {
    this.addInput("Control", SLOT_EXPRESSION_CONTROLLER);
    this.addOutput("On Change", SLOT_EVENT);

    this.size = [180, 30];
  }

  onOutputDblClick(i, e) {
    const a = LiteGraph.createNode("Assignment/AssignmentNode");
    graph.add(a);
    this.connect(i, a, 0);
  }
}
