let DisplayModeElement = document.getElementById("mode");
let currentMode = "bank";
let namespace = "afabdaojb";

var graph = new LGraph();
var canvas = new LGraphCanvas("#mycanvas", graph, { autoresize: true });
LiteGraph.clearRegisteredTypes();
LiteGraph.alt_drag_do_clone_nodes = true;
LiteGraph.allow_multi_output_for_events = false;
canvas.allow_searchbox = false;
// LiteGraph.release_link_on_empty_shows_menu = true;

graph.onNodeAdded = () => {
  gh?.saveState();
};
graph.onNodeRemoved = () => {
  gh?.saveState();
};
graph.onNodeConnectionChange = () => {
  gh?.saveState();
};

canvas.default_connection_color_byType = COLOR_TYPES;

LGraphCanvas.link_type_colors = COLOR_TYPES;
graph.runStep();

function registerConfiguratorNodes() {
  LiteGraph.clearRegisteredTypes();
  // DisplayModeElement.innerText = "Global";
  // currentMode = "global";
  LiteGraph.registerNodeType("Main/InputPorts", InputPortsNode);

  // Assignments
  LiteGraph.registerNodeType("Assignment/AssignmentNode", AssignMentNode);
  LiteGraph.registerNodeType(
    "Assignment/PresetAssignmentNode",
    PresetAssignmentNode
  );
  LiteGraph.registerNodeType("Preset/PresetNode", PresetNode);

  // Controllers
  LiteGraph.registerNodeType(
    "Controllers/ExpressionInput",
    ExpressionInputNode
  );
  LiteGraph.registerNodeType(
    "Controllers/laddercontroller",
    LadderControllerNode
  );
  LiteGraph.registerNodeType("Controllers/onecontroller", OneInputNode);
  LiteGraph.registerNodeType("Controllers/2Input", TwoInputNode);

  // Handlers
  LiteGraph.registerNodeType("Handlers/button-handler", ButtonHandlerNode);
  LiteGraph.registerNodeType(
    "Handlers/expression-handler",
    ExpressionHandlerNode
  );
}

function registerBankNodes() {
  LiteGraph.clearRegisteredTypes();
  // DisplayModeElement.innerText = "Bank";
  // currentMode = "bank" + currentBank;
  LiteGraph.registerNodeType("Bank/BankNode", BankNode);
  LiteGraph.registerNodeType("Preset/PresetChainNode", PresetNode);
  LiteGraph.registerNodeType("Action/ActionNode", ActionNode);
}

function switchToConf() {
  saveToLocalStorage();
  registerConfiguratorNodes();

  currentMode = "conf";
  DisplayModeElement.innerText = "conf";

  graph.clear();

  // Add default node
  graph.add(LiteGraph.createNode("Main/InputPorts"));

  // loading conf from local storage
  loadFromLocalStorage();
}

function switchToBank(bank = "bank0") {
  saveToLocalStorage();
  registerBankNodes();

  currentMode = bank;
  DisplayModeElement.innerText = bank;

  graph.clear();

  // Add default node
  graph.add(LiteGraph.createNode("Bank/BankNode"));

  // Loading bank from local storage
  loadFromLocalStorage();
}

document.addEventListener("DOMContentLoaded", async () => {
  redrawCanvas();
  switchToConf();
  // switchToBank();
  // loadFromLocalStorage();

  // console.log(bankLitegraphToConfig());

  var l = {
    ports: [
      {
        name: "",
        type: 4,
        invert_polarity: false,
        num_controls: 1,
      },
      {
        name: "",
        type: 3,
        invert_polarity: false,
        num_controls: 6,
      },
      {
        name: "",
        type: 0,
        invert_polarity: false,
        num_controls: 0,
      },
      {
        name: "",
        type: 0,
        invert_polarity: false,
        num_controls: 0,
      },
      {
        name: "",
        type: 0,
        invert_polarity: false,
        num_controls: 0,
      },
      {
        name: "",
        type: 4,
        invert_polarity: false,
        num_controls: 1,
      },
    ],
    controls: [
      {
        name: "Expression 1",
        on_change: 0,
      },
      {
        name: "Ladder 1",
        on_double_press: 1,
      },
      {
        name: "Ladder 3",
      },
      {
        name: "Ladder 3",
        on_press: 2,
      },
      {
        name: "Ladder 5",
      },
      {
        name: "Ladder 6",
      },
      {
        name: "Ladder 6",
        on_press: 3,
      },
      {
        name: "Expression 1",
        on_change: 4,
      },
    ],
    assignments: [
      {
        id: 0,
        type: 0,
        value1: 0,
        value2: 0,
      },
      {
        id: 1,
        type: 0,
        value1: 0,
        value2: 0,
      },
      {
        id: 2,
        type: 0,
        value1: 0,
        value2: 0,
      },
      {
        id: 3,
        type: 0,
        value1: 0,
        value2: 0,
      },
      {
        id: 4,
        type: 0,
        value1: 0,
        value2: 0,
      },
    ],
    banks: [
      {
        name: "Somethingg",
        presets: [[0, 1, 2], [], [], [], [], [], [], [], [], [3, 4, 5]],
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ],
    preset: [
      {
        name: "p1-1",
      },
      {
        name: "",
      },
      {
        name: "",
      },
      {
        name: "",
      },
      {
        name: "",
      },
      {
        name: "p10-3",
      },
    ],
  };

  // const b = bankEspConfigToLitegraph(l);

  // console.log(b);
  // graph.configure(b);
  // graph.runStep();
  // gh = new GraphHistory(graph);
});

const saveToLocalStorage = (name = "current-graphs") => {
  let b = JSON.parse(localStorage.getItem(name));
  if (!b) b = {};
  b[currentMode] = JSON.stringify(graph.serialize());
  localStorage.setItem(name, JSON.stringify(b));
};

function loadFromLocalStorage(name = "current-graphs") {
  const b = JSON.parse(localStorage.getItem(name)) || undefined;
  if (!b || !b[currentMode]) return;
  graph.clear();
  graph.configure(JSON.parse(b[currentMode]), false);
  graph.runStep();
}

const redrawCanvas = () =>
  canvas.canvas.dispatchEvent(
    new MouseEvent("mousemove", {
      clientX: 0,
      clientY: 0,
    })
  );

window.addEventListener("resize", redrawCanvas);

window.addEventListener("beforeunload", () => {
  saveToLocalStorage();
  localStorage.setItem(namespace, localStorage.getItem("current-graphs"));
});

canvas.getExtraMenuOptions = function (node, options) {
  return [
    {
      content: "Fullscreen",
      callback: () => {
        document.body.requestFullscreen();
      },
    },
    {
      content: "Settings",
      callback: () => {
        showDialog();
      },
    },
  ];
};

//////////////////////////////////////////////////////////////////////////////////////////
//                                 Dialog Box
//////////////////////////////////////////////////////////////////////////////////////////

const dialogScrim = document.getElementsByClassName("dialog-scrim")[0];
const dialogElement = document.getElementsByClassName("dialog-card")[0];
const settingsBtn = document.getElementById("setting-btn");

settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  showDialog();
});

dialogScrim.addEventListener("click", (e) => {
  dialogScrim.classList.remove("dialog-visible");
});

dialogElement.addEventListener("click", (e) => {
  e.stopPropagation();
});

function showDialog() {
  dialogScrim.classList.add("dialog-visible");
}

var settings = {
  tabletMode: false,
};

class GraphHistory {
  constructor(graph, limit = 20) {
    this.graph = graph;
    this.undoStack = [];
    this.redoStack = [];
    this.limit = limit;
    this.disableSave = false;

    this.saveState(); // save initial state
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    console.log(this.undoStack, this.redoStack);
  }

  saveState() {
    if (this.disableSave) return;
    const snapshot = this.graph.serialize();
    this.undoStack.push(snapshot);

    if (this.undoStack.length > this.limit) {
      this.undoStack.shift();
    }

    // once a new change happens, redo stack should be cleared
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 1) {
      const current = this.undoStack.pop();
      this.redoStack.push(current);
      const prev = this.undoStack[this.undoStack.length - 1];
      this.disableSave = true;
      this.graph.configure(JSON.parse(JSON.stringify(prev)));
      this.disableSave = false;
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(state);
      this.disableSave = true;
      this.graph.configure(JSON.parse(JSON.stringify(state)));
      this.disableSave = false;
    }
  }
}

let gh;

function doc_keyUp(e) {
  console.log(e);
  if (e.ctrlKey || e.metaKey) {
    switch (String.fromCharCode(e.which).toLowerCase()) {
      case "e":
        e.preventDefault();
        break;
      case "z":
        e.preventDefault();
        if (e.shiftKey) gh.redo();
        else gh.undo();
        break;
      case "q":
        e.preventDefault();
        saveToLocalStorage();
        break;
    }
  } else
    switch (e.code) {
      case "PageDown":
        break;
      case "PageUp":
        graph.arrange();
        break;
    }
}
// register the handler
document.addEventListener("keyup", doc_keyUp, false);

const tabsElement = document.getElementsByClassName("tabs")[0];

function populateTabs() {
  let html = `<div id="conf" conf class="tab">Configuration</div>`;
  html += `<div id="bank0" bank0 class="tab">Global Bank</div>`;
  for (let i = 0; i < 10; i++) {
    html += `<div id="bank${i + 1}" bank${i + 1} class="tab">Bank ${
      i + 1
    }</div>`;
  }
  tabsElement.innerHTML = html;
}

function setSelectedTab(s) {
  for (let tabElement of tabsElement.getElementsByClassName("tab")) {
    tabElement.classList.remove("selected");
  }
  console.log(s);
  // if(s.startsWith("conf")){
  tabsElement.querySelector(`[id=${s}]`).classList.add("selected");
  // } else {

  // }
}
populateTabs();

for (let tabElement of tabsElement.getElementsByClassName("tab")) {
  tabElement.addEventListener("click", (e) => {
    setSelectedTab(e.target.id);
    if (e.target.id.startsWith("bank")) switchToBank(e.target.id);
    else switchToConf();
  });
}
