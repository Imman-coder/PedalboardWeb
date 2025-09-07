class ExpressionInputNode {
  static title = "Expression Controller";

  constructor() {
    this.addInput("Port", SLOT_PORT);
    this.addOutput("Control", SLOT_EXPRESSION_CONTROLLER);
    this.size = [180, 30];
  }

  onOutputDblClick(i,e) {
    const a = LiteGraph.createNode("Handlers/expression-handler")
    graph.add(a);
    this.connect(i,a,0);
  }
}
