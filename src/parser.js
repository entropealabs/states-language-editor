export function editor_d3(graph) {
  let n = Object.keys(graph.nodes).map(key => graph.nodes[key]);
  let only_nodes = n.filter(node => !node.name.endsWith('Event'));
  let it = 0;
  let nodes = only_nodes.map(node => {
    return { id: it++, label: node.name, name: node.data.name };
  });

  let edges = only_nodes.flatMap(node => get_node_edges(node, graph, nodes));
  return { nodes: nodes, edges: edges };
}

function get_node_edges(node, graph, nodes) {
  return Object.keys(node.outputs).flatMap(key =>
    get_node_outputs(key, node, graph, nodes)
  );
}

function get_node_outputs(key, node, graph, nodes) {
  let conns = node.outputs[key].connections;
  return conns.reduce((acc, c) => {
    let event = graph.nodes[c.node.toString()];
    if (event.outputs.next.connections.length > 0) {
      let target_id = event.outputs.next.connections[0].node.toString();
      let target = graph.nodes[target_id];
      target = get_node_index(target.data.name, nodes);
      let source = get_node_index(node.data.name, nodes);
      acc.push({
        source: source,
        target: target,
        type: get_event_name(event),
      });
    }
    return acc;
  }, []);
}

function get_event_name(event) {
  var name = '';
  if (event.data.errors) {
    name = event.data.errors;
  } else if (event.data.event) {
    name = event.data.event;
  } else if (event.data.events) {
    name = event.data.events;
  }

  return name.split(',').map(n => n.trim());
}

function get_node_index(name, nodes) {
  return nodes.findIndex(n => n.name === name);
}
