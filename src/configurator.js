//////////////////////////////////////////////////////////////////////////
//                Litegraph to ESP Config
//////////////////////////////////////////////////////////////////////////

/**
 * Convert global graph to ESP Config
 */
function globalLitegraphToConfig(litegraph = graph) {
  let config = {
    ports: [],
    controls: [],
    assignments: [],
  };

  const root = getRootNode(litegraph);

  for (let i = 0; i < NUM_PORTS; i++) {
    const next = getNextConnectedNodeOnSlot(root, i, litegraph);
    if (!next) {
      config.ports.push({
        name: "",
        type: 0,
        invert_polarity: false,
        num_controls: 0,
      });
      continue;
    }
    let data = {
      name: next.name || "",
      type: getPortTypeId(next),
      invert_polarity: false,
      num_controls: getPortNumControls(next),
    };
    config.ports.push(data);
    for (let n = 0; n < getPortNumControls(next); n++) {
      const b = getNextConnectedNodeOnSlot(next, n, litegraph);
      if (!b) {
        config.controls.push({
          name: getPortTypeName(next) + (config.controls.length + 1),
        });
        continue;
      }
      let d = {
        name: b.name || getPortTypeName(next) + (n + 1),
      };

      for (let c = 0; c < b.outputs.length; c++) {
        const u = getNextConnectedNodeOnSlot(b, c, litegraph);

        if (!u) continue;
        if (u.type == "Assignment/AssignmentNode") {
          d[convertControlTypeName(b.outputs[c].name)] =
            config.assignments.length;
          config.assignments.push({
            id: config.assignments.length,
            type: u.properties.type,
            value1: u.properties.bank || 0,
            value2: u.properties.preset || 0,
          });
        }
      }
      config.controls.push(d);
    }
  }

  return config;
}

/**
 * Converts bank graph to ESP Config
 */
function bankLitegraphToConfig(litegraph = graph, presets, actions) {
  let config = {
    bank: {},
    presets: presets || [{ name: "  -", actions: [] }],
    actions: actions || [],
  };

  const root = getRootNode(litegraph);
  if (!root) return config;
  config.bank.name = root.properties.name;
  config.bank.presets_id = [];

  for (let i = 0; i < NUM_PRESETS_PER_BANK; i++) {
    config.bank.presets_id[i] = 0;
    let a = getNextConnectedNodeOnSlot(root, i, litegraph);

    if (a == null) continue;
    let d = {
      name: a.properties.name,
      actions: [],
    };
    a = getNextConnectedNodeOnSlot(a, 0, litegraph);
    while (a != null) {
      d.actions.push(config.actions.length);
      config.actions.push({ a: 0 });
      a = getNextConnectedNodeOnSlot(a, 0, litegraph);
    }
    config.bank.presets_id[i] = config.presets.length;
    config.presets.push(d);
  }
  return config;
}

////////////// Helper functions. ///////////////////
function getRootNode(litegraph) {
  for (let node of litegraph._nodes) {
    if (node.type === "Main/InputPorts" || node.type === "Bank/BankNode") {
      return node;
    }
  }
}

function getNextConnectedNodeOnSlot(parent, slot_no, litegraph) {
  try {
    var x = parent.outputs[slot_no].links;
    x = x[0];
    x = litegraph.links[x];
    return litegraph._nodes_by_id[x.target_id];
  } catch (error) {
    return null;
  }
}

function getPortTypeId(element) {
  const map = {
    "Controllers/ExpressionInput": 4,
    "Controllers/laddercontroller": 3,
    "Controllers/onecontroller": 1,
    "Controllers/2Input": 2,
  };
  return map[element.type] || 0;
}
function getPortNumControls(element) {
  const map = {
    "Controllers/ExpressionInput": 1,
    "Controllers/laddercontroller": NUM_LADDER,
    "Controllers/onecontroller": 1,
    "Controllers/2Input": 2,
  };
  return map[element.type] || 0;
}
function getPortTypeName(element) {
  const map = {
    "Controllers/ExpressionInput": "Expression ",
    "Controllers/laddercontroller": "Ladder ",
    "Controllers/onecontroller": "Button ",
    "Controllers/2Input": "Control ",
  };
  return map[element.type] || 0;
}
function convertControlTypeName(name) {
  const map = {
    "Single Press": "on_press",
    "Double Press": "on_double_press",
    "Long Press": "on_long_press",
    "On Change": "on_change",
  };
  return map[name] || null;
}

/**
 * Generates full ESP Config saved in localstorage
 */
function getParsedConfig(name = "current-graphs") {
  var graph = new LGraph();
  let a = localStorage.getItem(name);

  if (!a) return {};
  a = JSON.parse(a);
  if (!a) return {};

  graph.clear();
  graph.configure(JSON.parse(a.conf), false);

  var data = {};

  data = { ...globalLitegraphToConfig(graph) };

  data.banks = [];
  data.actions = [];
  data.presets = [{ name: "  -", actions: [] }];
  for (let i = 0; i <= NUM_BANKS; i++) {
    var graph = new LGraph();
    let b = a[`bank${i}`];
    if (b) b = JSON.parse(b);
    if (!b) b = {};
    graph.clear();
    graph.configure(b, false);
    var d = bankLitegraphToConfig(graph, data.presets, data.actions);
    data.banks.push(d.bank);
  }
  
  return data;
}

///////////////////////////////////////////////////////////////////////////////
//                      ESP Config to Litegraph
///////////////////////////////////////////////////////////////////////////////

/**
 * Converts Global ESP Config to Global Graph
 */
function globalEspConfigToLitegraph(config) {
  const LiteGraph = getNewLitegraphInstance();
  let graph = new LGraph();

  function addNode(type, pos = [0, 0], properties = {}) {
    let b = LiteGraph.createNode(type, null, properties);
    b.pos = pos;
    graph.add(b);
    return b;
  }

  function addLink(srcNode, srcSlot, dstNode, dstSlot) {
    srcNode.connect(srcSlot, dstNode, dstSlot);
  }

  // Create InputPorts root
  let root = addNode("Main/InputPorts", [100, 100]);
  let cc = 0;

  // Rebuild ports/controllers
  config.ports.forEach((port, i) => {
    let ctrlType = {
      1: "Controllers/onecontroller",
      2: "Controllers/2input",
      3: "Controllers/laddercontroller",
      4: "Controllers/ExpressionInput",
    }[port.type];
    if (!ctrlType) return;

    let node = addNode(ctrlType, [300, 100 + port.id * 80]);

    // add slots, etc. based on type
    addLink(root, i, node, 0);

    for (let i = 0; i < port.num_controls; i++) {
      let g = config.controls[cc++];
      let bn =
        g.on_change ?? g.on_press ?? g.on_double_press ?? g.on_long_press;
      if (bn !== undefined) {
        let nodee;
        if (port.type === 4) {
          nodee = addNode("Handlers/expression-handler");
        } else {
          nodee = addNode("Handlers/button-handler");
        }

        let asg = config.assignments[bn];

        let assignn = addNode("Assignment/AssignmentNode");

        assignn.configure({
          widget_values: [
            assignmentNodetypes[asg.type],
            asg.value1,
            asg.value2,
          ],
          properties: {
            type: asg.type,
            bank: asg.value1,
            preset: asg.value2,
          },
        });
        if (g.on_change !== undefined || g.on_press !== undefined)
          addLink(nodee, 0, assignn, 0);
        else if (g.on_double_press) addLink(nodee, 1, assignn, 0);
        else if (g.on_long_press) addLink(nodee, 2, assignn, 0);

        addLink(node, i, nodee, 0);
      }
    }
  });

  graph.arrange();

  return graph.serialize();
}

function bankEspConfigToLitegraph(config, bank_no = 0) {
  const LiteGraph = getNewLitegraphInstance();
  let graph = new LGraph();

  function addNode(type, pos = [0, 0], properties = {}) {
    let b = LiteGraph.createNode(type, null, properties);
    b.pos = pos;
    graph.add(b);
    return b;
  }

  function addLink(srcNode, srcSlot, dstNode, dstSlot) {
    srcNode.connect(srcSlot, dstNode, dstSlot);
  }

  const root = addNode("Bank/BankNode");
  const bank = config.banks[bank_no];

  console.log(bank);

  if (bank.name) {
    root.properties.name = bank.name;
    bank.presets.forEach((n, ss) => {
      let pn;
      n.forEach((i) => {
        if (!pn) {
          pn = addNode("Preset/PresetNode");
          addLink(root, ss, pn, 0);
        } else {
          let cn = addNode("Preset/PresetNode");
          addLink(pn, 0, cn, 0);
          pn = cn;
        }
      });
    });
  }

  graph.arrange();
  return graph.serialize();
}

function getNewLitegraphInstance() {
  const LG = Object.create(LiteGraph);
  LG.registerNodeType("Main/InputPorts", InputPortsNode);

  // Assignments
  LG.registerNodeType("Assignment/AssignmentNode", AssignMentNode);
  LG.registerNodeType("Assignment/PresetAssignmentNode", PresetAssignmentNode);
  LG.registerNodeType("Preset/PresetNode", PresetNode);

  // Controllers
  LG.registerNodeType("Controllers/ExpressionInput", ExpressionInputNode);
  LG.registerNodeType("Controllers/laddercontroller", LadderControllerNode);
  LG.registerNodeType("Controllers/onecontroller", OneInputNode);
  LG.registerNodeType("Controllers/2Input", TwoInputNode);

  // Handlers
  LG.registerNodeType("Handlers/button-handler", ButtonHandlerNode);
  LG.registerNodeType("Handlers/expression-handler", ExpressionHandlerNode);

  // Bank
  LG.registerNodeType("Bank/BankNode", BankNode);
  return LG;
}
